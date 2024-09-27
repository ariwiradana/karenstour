import React, { FC, ReactNode } from "react";

interface ButtonPrimaryProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  className?: string | "";
  icon?: ReactNode;
}

const ButtonPrimary: FC<ButtonPrimaryProps> = (props) => {
  return (
    <button
      {...props}
      className={`${
        props.className ?? ""
      } flex items-center py-3 px-4 rounded-lg text-white bg-blue-500 w-full transition duration-200 hover:bg-blue-400 justify-start`}
    >
      <span className="text-lg">{props.icon}</span>
      <span className={`text-base ${props.icon ? "ml-3" : "ml-0"}`}>
        {props.title}
      </span>
    </button>
  );
};

export default ButtonPrimary;
