import React, { FC } from "react";

interface InputTextareaProps
  extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  error?: string;
  rows?: number;
}

const InputTextarea: FC<InputTextareaProps> = (props) => {
  return (
    <div>
      <label
        htmlFor={props.id}
        className="block text-sm font-medium text-gray-700"
      >
        {props.label}
      </label>
      <textarea
        rows={props.rows ?? 4}
        {...props}
        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
      />
      {props.error && <p className="text-red-500 text-sm">{props.error}</p>}
    </div>
  );
};

export default InputTextarea;
