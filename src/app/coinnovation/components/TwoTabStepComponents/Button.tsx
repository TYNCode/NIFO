import React from "react";

interface ButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset"; 
}

const Button: React.FC<ButtonProps> = ({
  label,
  icon,
  onClick,
  disabled = false,
  type = "button",
}) => {
  return (
    <button
      type={type}
      className={`flex flex-row justify-center items-center text-normal gap-1.5 px-4 rounded-[12px] text-sm py-2 cursor-pointer bg-[#0070C0] text-white
        ${disabled ? "opacity-50 cursor-not-allowed bg-gray-400" : "hover:bg-[#005A9C]"}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <div className="text-lg">{icon}</div>}
      <div className="font-semibold">{label}</div>
    </button>
  );
};

export default Button;
