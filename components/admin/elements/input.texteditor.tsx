import dynamic from "next/dynamic";
import React, { FC } from "react";
// import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface InputTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  info?: string;
  full?: boolean;
  className?: string;
}

const InputTextEditor: FC<InputTextEditorProps> = ({
  label,
  value,
  onChange,
  error,
  info,
  full,
  className,
}) => {
  return (
    <div className={`${full ? "w-full" : "w-auto"} ${className || ""}`}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <ReactQuill
      
        theme="snow"
        value={value}
        onChange={onChange}
        className="mt-1 block w-full border border-gray-300 rounded-md"
      />
      {error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : info ? (
        <p className="text-darkgray text-sm">{info}</p>
      ) : null}
    </div>
  );
};

export default InputTextEditor;
