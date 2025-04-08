interface BadgeProps {
  text: string;
}

const Badge: React.FC<BadgeProps> = ({ text }) => {
  return (
    <span className="bg-[#E3F2FE] text-gray-700 p-2 rounded-xl text-xs font-medium">
      {text}
    </span>
  );
};

export default Badge;
