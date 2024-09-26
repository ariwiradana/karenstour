import { montserrat } from "@/constants/font";
import React, { FC, ReactNode } from "react";

interface ButtonPrimaryProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string | "";
  icon?: ReactNode;
  disabled?: boolean;
}

const ButtonPrimary: FC<ButtonPrimaryProps> = (props) => {
  return (
    <button
      {...props}
      disabled={props.disabled}
      onClick={props.onClick}
      className={`${montserrat.className} ${
        props.className
      } flex items-center gap-x-3 h-auto w-auto text-nowrap outline-none font-medium py-3 lg:py-4 px-4 lg:px-5 text-sm md:text-lg lg:font-medium transition-colors ease-in-out duration-500 text-white ${
        props.disabled
          ? "bg-gray-400 pointer-events-none cursor-not-allowed"
          : "bg-primary cursor-auto"
      } rounded`}
    >
      {props.icon && props.icon} <span>{props.title}</span>
    </button>
  );
};

export default ButtonPrimary;
