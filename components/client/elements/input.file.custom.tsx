import { montserrat } from "@/constants/font";
import React, { useRef, useState } from "react";

interface InputFileCustomProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileSelected: (files: FileList | null) => void;
  label: string;
  photos: FileList | null | undefined;
}

const InputFileCustom: React.FC<InputFileCustomProps> = ({
  onFileSelected,
  label,
  photos,
  ...props
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelected(event.target.files);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true); // Show drag active style
  };

  const handleDragLeave = () => {
    setIsDragging(false); // Remove drag active style when dragging leaves
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      onFileSelected(event.dataTransfer.files);
      event.dataTransfer.clearData();
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-300 ${
        isDragging ? "border-primary bg-primary/5" : "border-gray-300 bg-white"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        {...props}
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={handleClick}
          className="px-4 py-2 bg-primary text-sm text-white rounded-xl transition-colors duration-300 mb-2"
        >
          {label}
        </button>
        <p className={`text-dark/60 text-sm ${montserrat.className}`}>
          {photos && photos.length > 0
            ? `${photos.length} files selected`
            : "or drag and drop files here"}
        </p>
      </div>
    </div>
  );
};

export default InputFileCustom;
