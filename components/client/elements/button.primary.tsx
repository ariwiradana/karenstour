import { montserrat } from "@/constants/font";
import React, { FC, ReactNode } from "react";

interface ButtonPrimaryProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string | "";
  icon?: ReactNode;
  disabled?: boolean;
  id: string;
}

const ButtonPrimary: FC<ButtonPrimaryProps> = (props) => {
  return (
    <button
      {...props}
      id={props.id ?? props.title.replace(" ", "-").toLowerCase()}
      aria-label={props.id ?? props.title.replace(" ", "-").toLowerCase()}
      disabled={props.disabled}
      onClick={props.onClick}
      className={`${montserrat.className} ${
        props.className
      } flex items-center gap-x-3 h-auto w-auto text-nowrap outline-none font-medium py-3 lg:py-4 px-4 lg:px-5 text-sm md:text-lg lg:font-medium transition-colors ease-in-out duration-500 text-white ${
        props.disabled
          ? "bg-gray-400 pointer-events-none cursor-not-allowed"
          : "bg-primary pointer-events-auto"
      } rounded-lg`}
    >
      <span>{props.title}</span>{" "}
      <span className="text-2xl">{props.icon && props.icon}</span>
    </button>
  );
};

export default ButtonPrimary;
