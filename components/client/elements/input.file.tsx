import React, { FC, useRef } from "react";

interface Props extends React.HtmlHTMLAttributes<HTMLInputElement> {
  label: string;
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
      <p className="text-xs mb-1 font-medium text-darkgray">
        {props.label}
        {props.required ? "*" : ""}
      </p>
      <input
        placeholder={props.placeholder}
        readOnly
        className="bg-white min-h-12 px-3 text-base font-semibold w-full rounded-xl focus:outline-none border cursor-default"
        value={props.value.toString()}
        id="fileInput"
        type="text"
        onClick={handleClick}
      />

      <input
        ref={buttonRef}
        type="file"
        onChange={props.onChange}
        className="block w-full invisible px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#81A263]"
      />
    </div>
  );
};

export default InputFile;
