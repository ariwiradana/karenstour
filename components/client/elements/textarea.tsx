import { montserrat } from "@/constants/font";
import React, { FC } from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  error?: string;
  info?: string;
  disabled?: boolean;
}

const CustomTextarea: FC<Props> = (props) => {
  return (
    <div className={`flex flex-col ${montserrat.className}`}>
      <label
        className="text-sm mb-1 font-medium text-darkgray ml-1"
        htmlFor={props.id}
      >
        {props.label}
        {props.required ? "*" : ""}
      </label>
      <textarea
        className={`outline-none bg-gray-50 p-3 text-base font-semibold w-full rounded-lg focus:outline-none transition-all ease-in-out duration-500 border border-gray-100 focus:border-primary ${
          props.disabled ? "text-darkgray opacity-95" : "opacity-100"
        }`}
        id={props.id}
        rows={5}
        {...props}
      />
      {props.error ? (
        <p className="text-xs mt-1 ml-1 text-red-500">{props.error}</p>
      ) : props.info ? (
        <p className="text-xs mt-1 ml-1 text-darkgray">{props.info}</p>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CustomTextarea;
