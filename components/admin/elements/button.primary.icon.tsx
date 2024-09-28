import React, { FC, ReactNode } from "react";

interface ButtonPrimaryIconProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string | "";
  icon: ReactNode;
  size?: "small" | "medium" | "large";
}

const ButtonPrimaryIcon: FC<ButtonPrimaryIconProps> = (props) => {
  const buttonStyles = (size: "small" | "medium" | "large") => {
    switch (size) {
      case "small":
        return "p-2";
      case "medium":
        return "p-3";
      case "large":
        return "py-3";
    }
  };
  return (
    <button
      {...props}
      className={`${
        props.className ?? ""
      } flex items-center justify-center h-12 w-12 rounded-lg text-white bg-admin-dark aspect-square transition duration-200 hover:bg-admin-hover-dark ${buttonStyles(
        props.size ?? "large"
      )}`}
    >
      <span className="text-lg">{props.icon}</span>
    </button>
  );
};

export default ButtonPrimaryIcon;
