import React from "react";

interface ValidatedInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = true,
}) => {
  return (
    <div>
      <label className="text-sm font-semibold">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full border p-2 rounded-md mt-1 ${
          error ? "border-red-500" : ""
        }`}
        required={required}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default ValidatedInput;
