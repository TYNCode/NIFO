import React from "react";

interface NoResultMessageProps {
  searchText: string;
  onAddStartup?: () => void;
  loading?: boolean;
}

const NoResultMessage: React.FC<NoResultMessageProps> = ({
  searchText,
  onAddStartup,
  loading = false,
}) => {
  if (loading) return null;

  const hasSearch = searchText.trim().length > 0;

  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        {hasSearch ? (
          // Search results empty state
          <>
            <svg 
              className="mx-auto h-12 w-12 text-gray-400 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
            <h3 className="text-lg font-medium text-customBlack mb-2">
              No startups found
            </h3>
            <p className="text-sm text-customGreyishBlack mb-4">
              We couldn't find any startups matching "{searchText}". Try adjusting your search terms or check the spelling.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Search tips:</strong> Try using different keywords, check for typos, or search by industry instead.
              </p>
            </div>
          </>
        ) : (
          // No startups at all empty state
          <>
            <svg 
              className="mx-auto h-12 w-12 text-gray-400 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
              />
            </svg>
            <h3 className="text-lg font-medium text-customBlack mb-2">
              No startups yet
            </h3>
            <p className="text-sm text-customGreyishBlack mb-6">
              Your startup directory is empty. Get started by adding your first startup to begin building your portfolio.
            </p>
            {onAddStartup && (
              <button
                onClick={onAddStartup}
                className="bg-customBlue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 inline-flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add First Startup</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NoResultMessage;