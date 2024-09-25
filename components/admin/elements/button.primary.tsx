import { montserrat } from "@/constants/font";
import React, { FC, ReactNode } from "react";

interface ButtonPrimaryProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string | "";
  icon?: ReactNode;
  type?: "button" | "submit";
}

const ButtonPrimary: FC<ButtonPrimaryProps> = (props) => {
  return (
    <button
      type={props.type || "button"}
      onClick={props.onClick}
      className={`${
        props.className ?? ""
      } text-white font-semibold text-base py-3 px-4 rounded ${
        props.disabled
          ? "cursor-not-allowed bg-gray-300 bg-opacity-60 pointer-events-none"
          : "bg-admin-success"
      } ${montserrat.className}`}
    >
      {props.icon && props.icon} <span>{props.title}</span>
    </button>
  );
};

export default ButtonPrimary;
