import React from "react";

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  color?: string;
  hoverColor?: string;
  size?: string;
  disabled?: any
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  color = "text-[#2286C0]",
  hoverColor = "",
  size = "w-4 h-4",
  disabled
}) => {
  return (
    <button
      className={`transition-all ${disabled ? 'text-gray-300 cursor-default' : `${color} ${hoverColor}`}`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className={size}>{icon}</div>
    </button>
  );
};

export default IconButton;
