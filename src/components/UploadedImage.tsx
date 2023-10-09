import Image from 'next/image';
import { memo } from 'react';
import { v4 as uuid } from 'uuid';

export const UploadedImage = ({
  file,
  id,
  convertToWebp,
  updateWebpToggle,
  handleDelete,
}: any) => {
  const handleWebpToggle = (itemId: string) => {
    updateWebpToggle(itemId, !convertToWebp);
  };

  return (
    <div
      key={id}
      className="indicator flex flex-row gap-4 shadow-xl p-4 w-full"
    >
      <span
        onClick={() => handleDelete(id)}
        className="indicator-item bg-red-500 shadow hover:bg-base-100 hover:text-red-500 transition-all p-2 cursor-pointer text-white rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </span>

      <div className="flex flex-col lg:flex-row items-center lg:items-start w-full gap-6">
        <Image
          className="rounded object-cover"
          width={200}
          height={200}
          alt={file.name}
          src={URL.createObjectURL(file)}
        />
        {/* Image Setting */}
        <div className="flex flex-col w-full gap-6">
          {/* Webp Toggle */}
          {/* <div className="flex flex-row items-center gap-10">
            <label htmlFor="webp-toggle" className="cursor-pointer">
              Convert to Webp
            </label>
            <input
              id="webp-toggle"
              type="checkbox"
              className="toggle"
              checked={convertToWebp}
              onClick={() => handleWebpToggle(id)}
              accept="image/*"
            />
          </div> */}
          {/* Quality */}
          {/* <div>
    <h2>Quality</h2>
    <input
      type="range"
      min={0}
      max="100"
      value="25"
      className="range"
      step="25"
    />
    <div className="w-full flex justify-between text-xs px-2">
      {Array(101)
        .fill(0)
        .map((_, i) => {
          if (i % 5 === 0) {
            return <span key={i}>{i}</span>;
          }
        })
        .filter((r) => r)}
    </div>
  </div> */}
        </div>
      </div>
    </div>
  );
};
