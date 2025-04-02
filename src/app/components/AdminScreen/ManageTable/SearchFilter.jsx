import { IoIosSearch } from "react-icons/io";

export const SearchFilter = ({ filter, setFilter, placeholder }) => (
  <div className="flex items-center justify-center border border-gray-300 rounded p-1 w-[40%]">
    <IoIosSearch className="pl-1 text-gray-500 text-2xl" />
    <input
      type="text"
      placeholder={placeholder}
      className="border-none focus:outline-none focus:ring-0 w-full"
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
    />
  </div>
);
