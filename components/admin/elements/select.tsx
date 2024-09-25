import React, { FC } from "react";

interface Option {
  value: string;
  label: string;
}

interface InputSelectProps {
  id?: string;
  type?: "text" | "number" | "email";
  label: string;
  value: string | number;
  name: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  error?: string;
  full?: boolean;
  options: Option[];
}

const InputSelect: FC<InputSelectProps> = (props) => {
  return (
    <div className={props.full ? "w-full" : "w-auto"}>
      <label
        htmlFor={props.id}
        className="block text-sm font-medium text-gray-700"
      >
        {props.label}
      </label>
      <select
        name={props.name}
        id={props.id}
        value={props.value.toString()}
        onChange={props.onChange}
        className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-[9.5px]"
      >
        {props.options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {props.error && <p className="text-red-500 text-sm">{props.error}</p>}
    </div>
  );
};

export default InputSelect;
