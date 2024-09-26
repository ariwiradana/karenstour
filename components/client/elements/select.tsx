import { montserrat } from "@/constants/font";
import React, { FC } from "react";

interface Option {
  key: string;
  value: string;
}

interface CustomSelectProps {
  transparent?: boolean;
  id: string;
  value: string | "";
  options: Option[];
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CustomSelect: FC<CustomSelectProps> = (props) => {
  return (
    <div
      className={`min-h-10 bg-lightgray border border-gray-100 cursor-pointer hover:border-gray-200 rounded-lg flex items-center ${montserrat.className}`}
    >
      <select
        id={props.id}
        className={`${
          props.className
        } outline-none text-sm font-semibold p-3 2xl:p-4 cursor-pointer rounded-lg ${
          props.transparent
            ? "bg-transparent text-white"
            : "bg-lightgray text-dark"
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
    </div>
  );
};

export default CustomSelect;
