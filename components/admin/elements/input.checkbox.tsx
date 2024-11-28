import { montserrat } from "@/constants/font";
import React, { FC, useState } from "react";

interface InputCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  id?: string;
  inputSize?: "small" | "medium" | "large";
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputCheckbox: FC<InputCheckboxProps> = ({
  label,
  checked = false,
  id,
  onChange,
  ...props
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    if (onChange) {
      onChange(e);
    }
  };

  const paddingStyles = (size: "small" | "medium" | "large") => {
    switch (size) {
      case "small":
        return "p-1";
      case "medium":
        return "p-2";
      case "large":
        return "p-3";
    }
  };

  const handleContainerClick = () => {
    setIsChecked((prevState) => !prevState);
  };

  return (
    <div
      onClick={handleContainerClick}
      className={`${props.className ?? ""} ${
        montserrat.className
      } text-sm flex items-center gap-x-2 border rounded-lg cursor-pointer select-none ${
        isChecked ? "border-dark bg-dark text-white" : "border-gray-300"
      } ${paddingStyles(props.inputSize ?? "large")}`}
    >
      <input
        checked={isChecked}
        type="checkbox"
        {...props}
        id={id}
        className={`accent-dark cursor-pointer`}
        onChange={handleCheckboxChange}
      />
      <label
        onClick={handleContainerClick}
        htmlFor={id ?? props.name}
        className={`block font-medium cursor-pointer ${montserrat.className} ${
          isChecked ? "accent-white" : "accent-dark"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default InputCheckbox;
