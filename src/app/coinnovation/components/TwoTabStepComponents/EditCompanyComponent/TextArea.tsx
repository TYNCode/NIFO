// components/TextArea.tsx
import React from "react";

interface TextAreaProps {
  name: string;
  label: string;
  value: string;
  rows?: number;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  name,
  label,
  value,
  rows = 3,
  placeholder,
  onChange,
  required = false,
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default TextArea;
