import { montserrat } from "@/constants/font";
import React, { FC } from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  info?: string;
}

const CustomInput: FC<Props> = ({
  label,
  required,
  disabled,
  error,
  info,
  ...inputProps
}) => {
  return (
    <div
      className={`flex flex-col ${montserrat.className} w-full ${
        inputProps.type === "date" ? "border border-gray-100" : ""
      }`}
    >
      <p className="text-xs mb-1 font-medium text-darkgray ml-2">
        {label}
        {required ? "*" : ""}
      </p>
      <div className="min-h-12 flex items-center bg-white rounded-lg">
        <input
          className={`bg-white min-h-12 outline-none px-3 text-base font-semibold w-full rounded-lg focus:outline-none border ${
            error
              ? "border-red-500 focus:border-red-500"
              : inputProps.type !== "date"
              ? "border-gray-100"
              : "border-transparent"
          } ${
            inputProps.type === "date"
              ? "focus:border-transparent"
              : "focus:border-gray-200"
          } transition-all ease-in-out duration-500 ${
            disabled ? "text-darkgray opacity-95" : "opacity-100"
          }`}
          {...inputProps}
        />
      </div>
      {error ? (
        <p className="text-xs mt-1 ml-2 text-red-500">{error}</p>
      ) : info ? (
        <p className="text-xs mt-1 ml-2 text-darkgray">{info}</p>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CustomInput;
