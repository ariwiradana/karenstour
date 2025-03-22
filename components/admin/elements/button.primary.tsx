import React, { FC, ReactNode } from "react";

interface ButtonPrimaryProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  className?: string | "";
  icon?: ReactNode;
  size?: "small" | "medium" | "large";
}

const ButtonPrimary: FC<ButtonPrimaryProps> = (props) => {
  const buttonStyles = (size: "small" | "medium" | "large") => {
    switch (size) {
      case "small":
        return "px-3 py-2 text-sm";
      case "medium":
        return "px-4 py-3 text-sm";
      case "large":
        return "px-6 py-3 text-base";
    }
  };

  return (
    <button
      {...props}
      className={`${
        props.className ?? ""
      } flex items-center rounded-lg text-white bg-admin-dark transition duration-200 hover:bg-admin-hover-dark justify-start ${buttonStyles(
        props.size ?? "large"
      )}`}
    >
      <span className="text-sm">{props.icon}</span>
      <span className={`${props.icon ? "ml-2" : "ml-0"}`}>{props.title}</span>
    </button>
  );
};

export default ButtonPrimary;
