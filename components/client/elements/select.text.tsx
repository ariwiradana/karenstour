import React, { FC } from "react";

interface Option {
  key: string;
  value: string;
}

interface SelectTextInputProps {
  transparent?: boolean;
  id: string;
  value: string | "";
  options: Option[];
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectTextInput: FC<SelectTextInputProps> = (props) => {
  return (
    <select
      id={props.id}
      className={`${props.className} outline-none text-sm font-medium ${
        props.transparent
          ? "bg-transparent text-white"
          : "bg-white text-gray-700 "
      }`}
      value={props.value}
      onChange={props.onChange}
    >
      {props.options.map(({ key, value }) => (
        <option key={`${props.id}-${key}`} value={value}>
          {key}
        </option>
      ))}
    </select>
  );
};

export default SelectTextInput;
