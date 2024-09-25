import React, { useState } from "react";

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

  return (
    <div>
      <label
        className="block text-sm font-medium text-gray-700"
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
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          placeholder={props.placeholder}
        />
        {isOpen && filteredOptions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-32 overflow-y-auto">
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleOptionClick(option)}
                className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer text-sm text-dark"
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
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

export default SearchableSelect;
