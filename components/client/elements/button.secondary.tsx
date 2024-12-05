import { unbounded } from "@/constants/font";
import React, { FC, ReactNode } from "react";

interface ButtonSecondaryProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string | "";
  icon?: ReactNode;
  disabled?: boolean;
  id: string;
}

const ButtonSecondary: FC<ButtonSecondaryProps> = (props) => {
  return (
    <button
      {...props}
      id={props.id ?? props.title.replace(" ", "-").toLowerCase()}
      aria-label={props.id ?? props.title.replace(" ", "-").toLowerCase()}
      disabled={props.disabled}
      onClick={props.onClick}
      className={`${unbounded.className} ${
        props.className
      } flex items-center gap-x-3 h-auto w-auto text-nowrap justify-center outline-none py-3 lg:py-4 px-4 lg:px-5 text-sm md:text-sm transition-colors ease-in-out duration-500 text-primary border border-transparent ${
        props.disabled
          ? "bg-primary/20 pointer-events-none cursor-not-allowed"
          : "bg-primary/10 pointer-events-auto"
      } rounded-xl`}
    >
      <span>{props.title}</span>{" "}
      {props.icon && <span className="text-xl text-primary">{props.icon}</span>}
    </button>
  );
};

export default ButtonSecondary;
