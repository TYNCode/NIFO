import React, { useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchStartupSearchSuggestions } from "@/app/redux/features/companyprofile/companyProfileSlice";

interface SearchBarWithReduxProps {
  onSearchChange: (value: string) => void;
  onSearchSubmit: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBarWithRedux: React.FC<SearchBarWithReduxProps> = ({
  onSearchChange,
  onSearchSubmit,
  placeholder = "Search startups by name...",
  className = "flex-1 max-w-md",
}) => {
  const dispatch = useAppDispatch();
  const { searchResults } = useAppSelector((state) => state.companyProfile);
  const [searchText, setSearchText] = useState("");

  // Debounce search suggestions
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value.trim()) {
        dispatch(fetchStartupSearchSuggestions(value));
      }
    }, 300),
    [dispatch]
  );

  const handleInputChange = (value: string) => {
    setSearchText(value);
    onSearchChange(value);

    // Trigger suggestions for autocomplete
    debouncedSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearchSubmit(searchText);
    }
  };

  const handleClearSearch = () => {
    setSearchText("");
    onSearchChange("");
    onSearchSubmit(""); // Clear search results
  };

  return (
    <div className={className}>
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder={placeholder}
          value={searchText}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent transition-all duration-200"
          autoComplete="off"
        />
        {searchText && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            type="button"
            aria-label="Clear search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default SearchBarWithRedux;
