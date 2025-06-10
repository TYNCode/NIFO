import React from "react";

interface ButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  icon,
  onClick,
  disabled = false,
  type = "button",
  className = "",
  variant = "primary",
  size = "md",
  fullWidth = false,
}) => {
  const baseClasses = `
    flex flex-row justify-center items-center gap-2 
    rounded-lg font-semibold transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2
    ${fullWidth ? "w-full" : ""}
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
  `;

  const sizeClasses = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantClasses = {
    primary: disabled 
      ? "bg-gray-400 text-white" 
      : "bg-primary text-white hover:bg-[#005A9C] focus:ring-blue-500",
    secondary: disabled 
      ? "bg-gray-200 text-gray-400" 
      : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500",
    outline: disabled 
      ? "border-gray-300 text-gray-400" 
      : "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-blue-500",
  };

  const responsiveClasses = `
    ${sizeClasses[size]}
    px-2 py-1 text-xs
    sm:px-3 sm:py-2 sm:text-xs
    md:px-4 md:py-2.5 md:text-sm
  `;

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${responsiveClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && (
        <div className="flex items-center justify-center">
          {icon}
        </div>
      )}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
};

export default Button;