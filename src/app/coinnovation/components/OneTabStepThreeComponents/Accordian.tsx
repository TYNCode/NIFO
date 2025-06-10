import React, { ReactNode } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';
import { LuSave } from 'react-icons/lu';

interface AccordionProps {
  title: string;
  subtitle: string;
  isOpen: boolean;
  isEditing: boolean;
  onToggle: () => void;
  onEditClick: () => void;
  children: ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  subtitle,
  isOpen,
  isEditing,
  onToggle,
  onEditClick,
  children,
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between px-3 sm:px-6 py-4 bg-white rounded-[8px]">
        <div className="flex flex-col flex-1 pr-2">
          <div className="text-[13px] sm:text-[15px] font-semibold text-[#4A4D4E] leading-tight">
            {title}
          </div>
          <div className="text-[#4A4D4E] text-[10px] sm:text-[12px] italic mt-1">
            {subtitle}
          </div>
        </div>
        <div className="flex flex-row gap-4 sm:gap-8 items-center">
          <button
            className="text-[#2286C0] cursor-pointer p-1 hover:bg-gray-100 rounded transition-colors"
            onClick={onEditClick}
          >
            {isEditing ? <LuSave size={16} /> : <FiEdit2 size={16} />}
          </button>
          <button
            className="cursor-pointer p-1 hover:bg-gray-100 rounded transition-colors"
            onClick={onToggle}
          >
            <FaChevronDown
              size={14}
              className={`text-[#2286C0] transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="flex flex-col gap-4 py-4 px-2 sm:px-4 rounded-[8px] bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;