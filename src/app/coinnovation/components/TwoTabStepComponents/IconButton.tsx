import React from "react";

interface IconButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  color?: string;
  hoverColor?: string;
  size?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  color = "text-[#2286C0]",
  hoverColor = "",
  size = "w-4 h-4",
}) => {
  return (
    <button
      className={`transition-all ${color} ${hoverColor}`}
      onClick={onClick}
    >
      <div className={size}>{icon}</div>
    </button>
  );
};

export default IconButton;
