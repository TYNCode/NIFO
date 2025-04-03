// components/Input.tsx
import React from "react";

interface InputProps {
  name: string;
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  value,
  type = "text",
  placeholder,
  onChange,
  readOnly = false,
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className={`border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          readOnly ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
