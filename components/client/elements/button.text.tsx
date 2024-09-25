import { unbounded } from "@/constants/font";
import React, { FC } from "react";

interface ButtonTextProps {
  title: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string | "";
}

const ButtonText: FC<ButtonTextProps> = (props) => {
  return (
    <button
      onClick={props.onClick}
      className={`${unbounded.className} ${props.className} h-auto text-nowrap outline-none uppercase font-medium underline text-sm text-primary`}
    >
      {props.title}
    </button>
  );
};

export default ButtonText;
