import React from "react";
import { FieldError } from "react-hook-form"; // Import FieldError type
import { Merge, FieldErrorsImpl } from "react-hook-form"; // For type handling

interface InputProps {
  name: string;
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>; // Accept both FieldError and merged error types
}

const Input: React.FC<InputProps> = ({
  name,
  label,
  value,
  type = "text",
  placeholder,
  onChange,
  readOnly = false,
  error,
}) => {
  // Extract the error message from FieldError or string, ensuring it's a string
  const errorMessage = error && typeof error !== "string" ? (error as FieldError).message : error;

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
        } ${error ? "border-red-500" : ""}`}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={onChange}
      />
      {/* Render the error message if it exists */}
      {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
    </div>
  );
};

export default Input;
