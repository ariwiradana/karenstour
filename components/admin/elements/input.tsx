import { montserrat } from "@/constants/font";
import React, { FC } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  info?: string;
  full?: boolean;
  className?: string;
  id?: string;
  inputSize?: "small" | "medium" | "large";
}

const Input: FC<InputProps> = (props) => {
  const paddingStyles = (size: "small" | "medium" | "large") => {
    switch (size) {
      case "small":
        return "p-2";
      case "medium":
        return "p-3";
      case "large":
        return "p-4";
    }
  };
  return (
    <div className={`${props.className ?? ""} ${montserrat.className} text-sm`}>
      <label
        htmlFor={props.id ?? props.name}
        className="block text-gray-700 mb-1 font-montserrat"
      >
        {props.label}
      </label>
      <input
        {...props}
        id={props.id}
        className={`w-full border rounded-lg focus:ring-1 focus:outline-none ${
          props.error
            ? "border-admin-danger focus:ring-transparent"
            : "border-gray-300 focus:ring-black"
        } ${paddingStyles(props.inputSize ?? "large")}`}
      />
      {props.error && (
        <p className="text-admin-danger border-admin-danger text-sm mt-1">
          {props.error}
        </p>
      )}
    </div>
  );
};

export default Input;
