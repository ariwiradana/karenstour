import { unbounded } from "@/constants/font";
import React, { FC, ReactNode } from "react";
import { BiLoaderAlt } from "react-icons/bi";

interface ButtonPrimaryProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string | "";
  icon?: ReactNode;
  disabled?: boolean;
  id: string;
  isLoading?: boolean;
}

const ButtonPrimary: FC<ButtonPrimaryProps> = ({
  isLoading = false,
  ...props
}) => {
  return (
    <button
      {...props}
      id={props.id ?? props.title.replace(" ", "-").toLowerCase()}
      aria-label={props.id ?? props.title.replace(" ", "-").toLowerCase()}
      disabled={props.disabled}
      onClick={props.onClick}
      className={`${unbounded.className} ${
        props.className
      } flex items-center gap-x-3 h-auto w-auto justify-center text-nowrap outline-none py-3 lg:py-4 px-4 lg:px-5 text-sm md:text-sm transition-colors ease-in-out duration-500 text-white ${
        props.disabled || isLoading
          ? "bg-gray-400 pointer-events-none cursor-not-allowed"
          : "bg-primary pointer-events-auto"
      } rounded-xl`}
    >
      <span>{props.title}</span>{" "}
      {isLoading ? (
        <span className="text-xl">
          <BiLoaderAlt className="animate-spin" />
        </span>
      ) : (
        <>{props.icon && <span className="text-xl">{props.icon}</span>}</>
      )}
    </button>
  );
};

export default ButtonPrimary;
