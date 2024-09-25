import React, { FC } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  error?: string;
  info?: string;
  full?: boolean;
  className?: string;
}

const Input: FC<InputProps> = (props) => {
  return (
    <div
      className={`${props.full ? "w-full" : "w-auto"} ${props.className || ""}`}
    >
      <label
        htmlFor={props.id}
        className="block text-sm font-medium text-gray-700"
      >
        {props.label}
      </label>
      <input
        {...props}
        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
      />
      {props.error ? (
        <p className="text-red-500 text-sm">{props.error}</p>
      ) : props.info ? (
        <p className="text-darkgray text-sm">{props.info}</p>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Input;
