import React, { useState } from 'react';

const CardListToggle = () => {
  const [view, setView] = useState('card');

  return (
    <div className="inline-flex items-center justify-center rounded-lg overflow-hidden border border-gray-300 shadow-sm">
      <button
        onClick={() => setView('card')}
        className={`flex items-center py-2 px-3 transition-all duration-200 ease-in-out ${
          view === 'card'
            ? 'bg-[#339af0] text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <span className="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <rect width="6" height="6" x="3" y="3" rx="1" />
            <rect width="6" height="6" x="15" y="3" rx="1" />
            <rect width="6" height="6" x="3" y="15" rx="1" />
            <rect width="6" height="6" x="15" y="15" rx="1" />
          </svg>
        </span>
        Card View
      </button>

      <button
        onClick={() => setView('list')}
        className={`flex items-center py-2 px-3 transition-all duration-200 ease-in-out ${
          view === 'list'
            ? 'bg-[#339af0] text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <span className="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
        </span>
        List View
      </button>
    </div>
  );
};

export default CardListToggle;
