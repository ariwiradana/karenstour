import { montserrat } from "@/constants/font";
import React, { FC, ReactNode } from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: ReactNode;
  loading?: boolean;
}

const CustomButton: FC<Props> = (props) => {
  return (
    <div className={`flex flex-col items-start w-auto ${montserrat.className}`}>
      <button
        className={`text-white px-3 py-4 md:px-4 text-sm font-medium uppercase tracking-wider rounded focus:outline-none transition-all ease-in-out duration-500 group ${
          props.disabled
            ? "opacity-50 cursor-not-allowed bg-gray-300"
            : "opacity-100 bg-primary"
        }`}
        id={props.id}
        {...props}
      >
        {props.icon ? (
          <div className="flex gap-x-2 items-center justify-center">
            {props.icon}
            <span>{props.label}</span>
          </div>
        ) : (
          props.label
        )}
      </button>
    </div>
  );
};

export default CustomButton;
