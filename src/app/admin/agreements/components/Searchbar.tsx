interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-sm mx-1 font-semibold text-gray-600">Search Startups</div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-md px-4 py-2 text-sm w-full"
      />
    </div>
  );
};
