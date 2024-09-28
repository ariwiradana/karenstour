import React, { useState } from "react";
import { montserrat } from "@/constants/font";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  error?: string;
  info?: string;
  label: string;
  name: string;
  placeholder?: string;
  inputSize?: "small" | "medium" | "large";
}

const SearchableSelect: React.FC<SearchableSelectProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(props.value);

  const filteredOptions = props.options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionClick = (option: Option) => {
    const event = {
      target: { value: option.value },
    } as React.ChangeEvent<HTMLSelectElement>;

    props.onChange(event);
    setSearchTerm(option.label);
    setIsOpen(false);
  };

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
    <div className={`${montserrat.className} text-sm`}>
      <label
        className="block text-gray-700 mb-1 font-montserrat"
        htmlFor={props.name}
      >
        {props.label}
      </label>
      <div className="relative">
        <input
          type="text"
          name={props.name}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={props.placeholder}
          className={`w-full border rounded-lg focus:ring-1 focus:outline-none ${
            props.error
              ? "border-admin-danger focus:ring-transparent"
              : "border-gray-300 focus:ring-black"
          } ${paddingStyles(props.inputSize ?? "large")}`}
        />
        {isOpen && filteredOptions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-[7.6rem] overflow-y-auto">
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleOptionClick(option)}
                className="px-4 py-2 hover:bg-darkgray hover:text-white cursor-pointer text-base text-dark"
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      {props.error ? (
        <p className="text-admin-danger text-sm mt-1">{props.error}</p>
      ) : props.info ? (
        <p className="text-darkgray text-sm mt-1">{props.info}</p>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SearchableSelect;
