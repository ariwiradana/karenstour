import { Options } from "@/constants/types";
import React, { FC } from "react";

interface InputSelectProps
  extends React.InputHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  full?: boolean;
  options: Options[];
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
