import React, { useState } from 'react';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';

interface AccordionSectionProps {
  title: string;
  items: string[];
  icon: React.ComponentType<{ className?: string }>;
  sectionIndex: number;
  onFilterChange: (category: string, item: string, isSelected: boolean) => void;
  checkedState: { [item: string]: boolean };
}

const FilterOptions: React.FC<AccordionSectionProps> = ({
  title,
  items,
  icon: Icon,
  sectionIndex,
  onFilterChange,
  checkedState,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (item: string, isSelected: boolean) => {
    onFilterChange(title, item, isSelected);
  };

  return (
    <div className="border-b border-gray-200 p-2">
      <button
        onClick={toggleSection}
        className={`w-full flex justify-between items-center px-4 py-2 hover:bg-[#e7f5ff] focus:outline-none font-semibold ${
          isOpen ? 'bg-[#e7f5ff] text-[#4dabf7]' : 'bg-white hover:bg-[#e7f5ff] text-[#495057]'
        }`}
      >
        <div className="flex gap-2 justify-center items-center">
          <Icon className="h-5 w-5 font-semibold" />
          <span>{title}</span>
        </div>
        {isOpen ? <IoChevronUp className="w-4 h-4 font-semibold" /> : <IoChevronDown className="w-4 h-4 font-semibold" />}
      </button>
      {isOpen && (
        <div className="p-4 ml-8 scrollable-section">
          {items.map((item, index) => (
            <div key={`${sectionIndex}-${index}`} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`checkbox-${sectionIndex}-${index}`}
                className="form-checkbox h-4 w-4 border-[#adb5bd] text-[#22b8cf] focus:outline-cyan-50 rounded"
                checked={checkedState[item] || false}
                onChange={(e) => handleCheckboxChange(item, e.target.checked)}
              />
              <label htmlFor={`checkbox-${sectionIndex}-${index}`} className="ml-2 text-[#495057]">
                {item}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterOptions;
