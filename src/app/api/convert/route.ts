import { NextRequest } from 'next/server';
import fs from 'fs';
import sharp from 'sharp';
import path, { join } from 'path';
import { promisify } from 'util';
import { EventEmitter, pipeline as streamPipeline } from 'stream';
import JSZip from 'jszip';

/**
 * BUN
 * TypeError: FormData parse error missing final boundary
 * https://github.com/oven-sh/bun/issues/2644
 */

const delay = (seconds = 1) =>
  new Promise((resolve) => setTimeout(resolve, 1000 * seconds));

const eventEmitter = new EventEmitter();

eventEmitter.on('cleanup-images', async () => {
  const rawFolderContent = fs.readdirSync('./storage/raw');
  const convertedFolderContent = fs.readdirSync('./storage/converted');

  console.log('cleanup-images');
  await Promise.all([
    ...convertedFolderContent.map(async (file) => {
      const filePath = join('./storage/converted', file);
      fs.unlinkSync(filePath);
    }),
    ...rawFolderContent.map(async (file) => {
      const filePath = join('./storage/raw', file);
      fs.unlinkSync(filePath);
    }),
  ]);
});
eventEmitter.on('cleanup-zip', () => {
  console.log('cleanup-zip');
  fs.unlinkSync('./storage/z.zip');
});

export const POST = async (req: NextRequest) => {
  try {
    // Parse the uploaded files.
    const formData = await req.formData();

    /** image conversion settings */
    const settings = JSON.parse(formData.get('settings') as string);

    const files: File[] = [];

    const saveFiles: Promise<any>[] = [];

    formData.forEach((value, key) => {
      if (key.includes('file-')) {
        const file = value as File;

        files.push(file);

        const promise = new Promise(async (resolve, reject) => {
          const buffer = await file.arrayBuffer();
          fs.writeFile(
            `./storage/raw/${file.name}`,
            Buffer.from(buffer),
            (err) => {
              if (err) {
                console.log(err);
                reject(err);
              }
              resolve(null);
            }
          );
        });
        saveFiles.push(promise);
      }
    });

    console.log('Files#', files.length);
    console.log('Saved Locally');
    await Promise.all(saveFiles);

    // Convert raw to webp

    const rawFolderContent = fs.readdirSync('./storage/raw');

    await delay(1);

    await Promise.all(
      rawFolderContent.map(async (rawFileName) => {
        const rawFilePath = join('./storage/raw', rawFileName);

        const split = rawFileName.split('.');
        split.length = split.length - 1;

        const rawFileNameWithoutExtention = split.join('-');

        const outputPath = join(
          './storage/converted',
          rawFileNameWithoutExtention + '.webp'
        );

        const fileBuffer = fs.readFileSync(rawFilePath);

        await sharp(fileBuffer)
          .webp({
            lossless: true,
            quality: 25,
          })
          .toFile(outputPath);
      })
    );
    console.log('Converted to Webp');

    await delay(1);

    // make zip file
    const zip = new JSZip();

    // Get a list of all the files in the input directory.
    const convertedFilesForZip = fs.readdirSync('./storage/converted');

    // Iterate over the files and add them to the zip file.
    await Promise.all(
      convertedFilesForZip.map(async (file) => {
        const inputPath = join('./storage/converted', file);
        const fileBuffer = fs.readFileSync(inputPath);

        zip.file(file, fileBuffer);
      })
    );

    const s = await zip.generateAsync({
      type: 'nodebuffer',
    });

    fs.writeFileSync('./storage/z.zip', s);

    console.log('Added to Zip file');

    eventEmitter.emit('cleanup-images');

    return Response.json({
      url: '/api/convert',
    });
  } catch (error) {
    console.log(error);
  }
};

export const GET = async () => {
  const zipReadStream = fs.createReadStream('./storage/z.zip');

  const stats = fs.statSync('./storage/z.zip');

  zipReadStream.on('close', () => {
    eventEmitter.emit('cleanup-zip');
  });

  //@ts-ignore
  const response = new Response(zipReadStream, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="output.zip"`,
      'Content-Length': stats.size,
    },
  });

  return response;
};
