import React from "react";

interface ImageUploadPreviewProps {
  images: File[];
  onRemove: (index: number) => void;
  onAddClick: (e: React.MouseEvent) => void;
}

export default function ImageUploadPreview({
  images,
  onRemove,
  onAddClick,
}: ImageUploadPreviewProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((file, index) => (
        <div
          key={index}
          className="relative aspect-square rounded-lg overflow-hidden group"
        >
          <img
            src={URL.createObjectURL(file)}
            alt={`Upload preview ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              onRemove(index);
            }}
            className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}

      <button
        onClick={onAddClick}
        className="aspect-square rounded-lg border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors flex items-center justify-center"
      >
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
}
