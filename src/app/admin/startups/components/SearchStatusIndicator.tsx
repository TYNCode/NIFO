import React from "react";

interface SearchStatusIndicatorProps {
  isSearchMode: boolean;
  searchText: string;
  resultCount: number;
  onClearSearch: () => void;
}

const SearchStatusIndicator: React.FC<SearchStatusIndicatorProps> = ({
  isSearchMode,
  searchText,
  resultCount,
  onClearSearch,
}) => {
  if (!isSearchMode || !searchText.trim()) return null;
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-900">
              {resultCount > 0 
                ? `Found ${resultCount} result${resultCount === 1 ? '' : 's'} for "${searchText}"`
                : `No results found for "${searchText}"`
              }
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Searching across all startups in the database
            </p>
          </div>
        </div>
        <button
          onClick={onClearSearch}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
        >
          <span>Clear search</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchStatusIndicator;