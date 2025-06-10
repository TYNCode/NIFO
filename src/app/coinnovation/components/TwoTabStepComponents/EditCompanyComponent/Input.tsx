import React from "react";
import { FieldError } from "react-hook-form";
import { Merge, FieldErrorsImpl } from "react-hook-form";

interface InputProps {
  name: string;
  label: string;
  value: string;
  type?: string;
  className?: string; 
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  error?: any;
  required?: boolean;
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
  className = "",
  required = false,
}) => {
  const errorMessage =
    error && typeof error !== "string" ? (error as FieldError).message : error;

  return (
    <div className="flex flex-col w-full">
      <label 
        htmlFor={name} 
        className="mb-2 text-sm font-medium text-gray-700 px-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className={`
          w-full border border-gray-300 rounded-lg px-3 py-3 
          text-sm focus:outline-none focus:ring-2 focus:ring-[#56A8F0] 
          focus:border-[#56A8F0] transition-all duration-200
          ${className} 
          ${readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"} 
          ${error ? "border-red-500 focus:ring-red-200" : ""}
          sm:py-2 sm:text-xs
        `}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
      />
      {errorMessage && (
        <p className="text-red-500 text-xs mt-1 px-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default Input;