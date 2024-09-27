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
      } text-white font-semibold text-base py-2 px-4 rounded-md transition duration-300 ease-in-out ${
        props.disabled
          ? "cursor-not-allowed bg-gray-300"
          : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
      } ${montserrat.className}`}
    >
      {props.icon && <span className="mr-2">{props.icon}</span>}
      <span>{props.title}</span>
    </button>
  );
};

export default ButtonPrimary;
