import { montserrat } from "@/constants/font";
import React, { FC } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  info?: string;
  min?: number; // Optional minimum value
  max?: number; // Optional maximum value
  value: number; // Controlled input value
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Function to handle change
}

const CustomInputNumber: FC<Props> = ({
  label,
  required,
  disabled,
  error,
  info,
  min,
  max,
  value,
  onChange,
  ...inputProps
}) => {
  // Handle increment of the number value
  const handleIncrement = () => {
    if (value < (max ?? Infinity)) {
      onChange({
        target: { value: String(value + 1) },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  // Handle decrement of the number value
  const handleDecrement = () => {
    if (value > (min ?? 0)) {
      onChange({
        target: { value: String(value - 1) },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className={`flex flex-col ${montserrat.className}`}>
      <p className="text-xs mb-1 font-medium text-darkgray ml-2">
        {label}
        {required ? "*" : ""}
      </p>
      <div className="min-h-12 flex items-center rounded-lg">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || (min !== undefined && value <= min)}
          className={`bg-gray-200 rounded-l-lg px-4 h-12 aspect-square flex justify-center items-center ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <BiMinus className="text-dark text-sm" />
        </button>
        <input
          type="number"
          value={value}
          onChange={onChange}
          className={`bg-white min-h-12 px-3 text-base font-semibold w-full text-center rounded-none focus:outline-none border disabled pointer-events-none ${
            error ? "border-red-500 focus:border-red-500" : "border-gray-100"
          } focus:border-gray-200 transition-all ease-in-out duration-500 ${
            disabled ? "text-darkgray opacity-95" : "opacity-100"
          }`}
          disabled={disabled}
          {...inputProps}
        />
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || (max !== undefined && value >= max)}
          className={`bg-gray-200 rounded-r-lg h-12 aspect-square flex justify-center items-center ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <BiPlus className="text-dark text-sm" />
        </button>
      </div>
      {error ? (
        <p className="text-xs mt-1 ml-2 text-red-500">{error}</p>
      ) : info ? (
        <p className="text-xs mt-1 ml-2 text-darkgray">{info}</p>
      ) : null}
    </div>
  );
};

export default CustomInputNumber;
