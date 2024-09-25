import { montserrat } from "@/constants/font";
import React, { FC } from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  error?: string;
  info?: string;
}

const CustomTextarea: FC<Props> = (props) => {
  return (
    <div className={`flex flex-col ${montserrat.className}`}>
      <label
        className="text-xs mb-1 font-medium text-darkgray ml-2"
        htmlFor={props.id}
      >
        {props.label}
        {props.required ? "*" : ""}
      </label>
      <textarea
        className={`p-3 text-base font-semibold focus:outline-none bg-white rounded-lg border ${
          props.error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-100 focus:border-gray-200"
        } transition-all ease-in-out duration-500 ${
          props.disabled ? "text-darkgray opacity-95" : "opacity-100"
        }`}
        id={props.id}
        rows={5}
        {...props}
      />
      {props.error ? (
        <p className="text-xs mt-1 ml-2 text-red-500">{props.error}</p>
      ) : props.info ? (
        <p className="text-xs mt-1 ml-2 text-darkgray">{props.info}</p>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CustomTextarea;
