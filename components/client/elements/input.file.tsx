import React, { FC, useRef } from "react";

interface Props extends React.HtmlHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  value: File | string;
  placeholder?: string;
}

const InputFile: FC<Props> = (props) => {
  const buttonRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    buttonRef.current?.click();
  };

  return (
    <div>
      {props.label && (
        <p className="text-xs mb-1 font-medium text-darkgray">
          {props.label}
          {props.required ? "*" : ""}
        </p>
      )}
      <input
        accept="image/*"
        placeholder={props.placeholder}
        readOnly
        className="bg-white min-h-12 px-3 hover:bg-zinc-50 cursor-pointer placeholder:text-sm text-base font-medium w-full rounded-lg focus:outline-none border"
        value={props.value.toString()}
        id="fileInput"
        type="text"
        onClick={handleClick}
      />

      <input
        accept="image/*"
        ref={buttonRef}
        type="file"
        onChange={props.onChange}
        className="w-full hidden invisible px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#81A263]"
      />
    </div>
  );
};

export default InputFile;
