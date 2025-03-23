import { unbounded } from "@/constants/font";
import React, { FC } from "react";

interface ButtonTextProps {
  title: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string | "";
}

const ButtonText: FC<ButtonTextProps> = (props) => {
  const id = `btn-${props.title.replace(" ", "-").toLowerCase()}`;
  return (
    <button
      id={id}
      aria-label={id}
      onClick={props.onClick}
      className={`${unbounded.className} ${props.className} h-auto text-nowrap outline-none font-medium underline text-sm md:text-base text-primary`}
    >
      {props.title}
    </button>
  );
};

export default ButtonText;
