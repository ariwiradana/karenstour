import { montserrat } from "@/constants/font";
import React, { FC } from "react";
import { BiChevronDown } from "react-icons/bi";

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
  name?: string;
  label?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CustomSelect: FC<CustomSelectProps> = (props) => {
  return (
    <div>
      {props.label && (
        <p
          className={`text-xs mb-1 font-medium text-darkgray ml-2 ${montserrat.className}`}
        >
          {props.label}
          {props.required ? "*" : ""}
        </p>
      )}
      <div
        className={`bg-white cursor-pointer hover:border-gray-200 rounded-lg flex items-center relative ${montserrat.className}`}
      >
        <select
          name={props.name}
          id={props.id}
          className={`${
            props.className
          } outline-none text-xs md:text-sm lg:text-sm font-medium py-2 pl-3 pr-[26px] cursor-pointer rounded-lg appearance-none ${
            props.transparent
              ? "bg-transparent text-white"
              : "bg-white text-dark"
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
        <BiChevronDown className="absolute right-[6px] text-darkgray text-base" />
      </div>
    </div>
  );
};

export default CustomSelect;
