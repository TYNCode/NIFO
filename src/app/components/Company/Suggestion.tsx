"use client";

import React from 'react';
import { encryptURL } from '../../utils/shareUtils';

interface SuggestionProps {
  suggestion: {
    startup_id: number;
    startup_name: string;
  };
  onSuggestionClick: (name: string) => void; 
}

const Suggestions: React.FC<SuggestionProps> = ({ suggestion, onSuggestionClick }) => {
  const handleSuggestionClick = () => {
    onSuggestionClick(suggestion.startup_name);
  };

  return (
    <div>
      <div
        key={suggestion.startup_id}
        className="p-2 hover:bg-gray-200 cursor-pointer"
        onClick={handleSuggestionClick}
      >
        {suggestion.startup_name}
      </div>
    </div>
  );
};

export default Suggestions;
