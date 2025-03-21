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
    <div className={`flex flex-col ${montserrat.className} w-full`}>
      <p className="text-sm mb-1 text-darkgray ml-1">
        {label}
        {required ? "*" : ""}
      </p>
      <div className={`min-h-12 flex items-center bg-white rounded-lg`}>
        <input
          className={`min-h-12 outline-none bg-gray-50 px-3 text-base font-semibold w-full rounded-lg focus:outline-none transition-all ease-in-out duration-500 ${
            disabled ? "text-darkgray opacity-95" : "opacity-100"
          } ${
            inputProps.type !== "date"
              ? "border border-gray-100 focus:border-primary"
              : "border border-gray-100"
          }`}
          {...inputProps}
        />
      </div>
      {error ? (
        <p className="text-xs mt-1 ml-1 text-red-500">{error}</p>
      ) : info ? (
        <p className="text-xs mt-1 ml-1 text-darkgray">{info}</p>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CustomInput;
