'use client';
import { ImageList } from '@/components/ImageList';
import { UploadedImage } from '@/components/UploadedImage';
import { Meta } from '@/layout/Meta';
import { Main } from '@/template/Main';
import axios from 'axios';
import { ReadStream } from 'fs';
import Image from 'next/image';
import {
  ChangeEvent,
  ChangeEventHandler,
  LegacyRef,
  useRef,
  useState,
} from 'react';
import { v4 as uuid } from 'uuid';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>();
  const [webpToggle, setWebpToggle] = useState(true);

  // const handleWebpToggle = (index: number) => {
  //   console.log(index);

  //   const updated = files.map((f, i) => {
  //     const updatedItem = { ...f };
  //     if (i === index) {
  //       updatedItem.convertToWebp = !updatedItem.convertToWebp;
  //     }
  //     return updatedItem;
  //   });
  //   setFiles(updated);
  // };

  const onFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    const fs: File[] = [];

    for (let i = 0; i < 100; i++) {
      const currentFile = files[i];

      if (!currentFile) {
        break;
      }
      fs.push(currentFile);
    }

    setFiles((prev) => {
      return [...prev, ...fs];
    });
  };

  const handleDelete = (id: number) => {
    const updated = files
      .map((_, i) => {
        if (i === id) {
          return null;
        }
        return _;
      })
      .filter((r) => r) as File[];
    if (fileInputRef.current) {
      fileInputRef.current.files = new FileList();
    }
    setFiles(updated);
  };

  const handleApi = async () => {
    setIsLoading(true);
    try {
      const form = new FormData();

      files.forEach((f, i) => {
        form.append(`file-${i}`, f);
      });
      form.append(
        'settings',
        JSON.stringify({
          convertToWebp: webpToggle,
        })
      );

      // ReadStream()

      const { data } = await axios.post('/api/convert', form);

      window.location.href = window.location.origin + data.url;

      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.files = new FileList();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  let buttonText = 'Convert';

  if (isLoading) {
    buttonText = 'Loading...';
  }

  if (!files.length) {
    buttonText = 'Select files first';
  }

  return (
    <Main
      meta={
        <Meta
          title="ImConv"
          description="Convert your image and optimize according to your need"
        />
      }
    >
      <div className="p-4">
        {/* Input Component */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Pick a file</span>
            <span className="label-text-alt">Optimize</span>
          </label>
          <input
            accept="image/*"
            type="file"
            className="file-input file-input-bordered w-full"
            multiple={true}
            onChange={onFileUpload}
          />
        </div>
        <div>
          <button
            className={`my-8 btn`}
            onClick={handleApi}
            disabled={isLoading || !files.length}
          >
            {isLoading && <span className="loading loading-spinner"></span>}
            {buttonText}
          </button>
        </div>
        <div>
          {/* Settings */}
          {/* <h2 className="my-8">Settings</h2>
          <div className="flex flex-row items-center gap-10">
            <label htmlFor="webp-toggle" className="cursor-pointer">
              Convert to Webp
            </label>
            <input
              id="webp-toggle"
              type="checkbox"
              className="toggle"
              value={webpToggle ? 'on' : 'off'}
              onChange={() => setWebpToggle(!webpToggle)}
              accept="image/*"
            />
          </div> */}
        </div>
        {/* Image Preview */}
        <ImageList {...{ files, handleDelete }} />
      </div>
    </Main>
  );
}
