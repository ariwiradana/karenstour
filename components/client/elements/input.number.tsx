import { montserrat } from "@/constants/font";
import React, { FC, memo } from "react";
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
      <p className="text-sm mb-1 font-medium text-darkgray ml-1">
        {label}
        {required ? "*" : ""}
      </p>
      <div className="min-h-12 flex items-center rounded-lg">
        <button
          aria-label="btn-decrement"
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
          className={`bg-gray-50 min-h-12 px-3 text-base font-semibold w-full text-center rounded-none focus:outline-none disabled pointer-events-none transition-all ease-in-out duration-500 border border-gray-100 ${
            disabled ? "text-darkgray opacity-95" : "opacity-100"
          }`}
          disabled={disabled}
          {...inputProps}
        />
        <button
          aria-label="btn-increment"
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
        <p className="text-xs mt-1 ml-1 text-red-500">{error}</p>
      ) : info ? (
        <p className="text-xs mt-1 ml-1 text-darkgray">{info}</p>
      ) : null}
    </div>
  );
};

export default memo(CustomInputNumber);
