import { montserrat } from "@/constants/font";
import React, { useRef, useState } from "react";
import { BiUpload } from "react-icons/bi";

interface InputFileCustomProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileSelected: (files: FileList | null) => void;
  label: string;
  photos: FileList | null | undefined;
  required?: boolean;
}

const InputFileCustom: React.FC<InputFileCustomProps> = ({
  onFileSelected,
  label,
  photos,
  required = false,
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
    <div>
      <p
        className={`text-sm mb-1 font-medium text-darkgray ml-1 ${montserrat.className}`}
      >
        {label}
        {required ? "*" : ""}
      </p>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 bg-white"
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

        <div className="flex flex-col items-center justify-center gap-3">
          <BiUpload className="text-2xl text-dark" />
          <p
            className={`text-dark/60 text-sm text-center ${montserrat.className}`}
          >
            Drag and drop files here or
            <span>
              {" "}
              <button
                type="button"
                onClick={handleClick}
                className="text-dark underline font-medium"
              >
                Choose File
              </button>
            </span>
          </p>
          {photos && photos?.length > 0 && (
            <p
              className={`text-dark text-sm text-center ${montserrat.className}`}
            >
              {photos.length} files selected
            </p>
          )}
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default InputFileCustom;
