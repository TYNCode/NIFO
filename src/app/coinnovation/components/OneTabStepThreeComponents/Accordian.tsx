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
      <div className="flex flex-row items-center justify-between px-6 py-4 bg-white rounded-[8px]">
        <div className="flex flex-col">
          <div className="text-[15px] font-semibold text-[#4A4D4E]">{title}</div>
          <div className="text-[#4A4D4E] text-[12px] italic">{subtitle}</div>
        </div>
        <div className="flex flex-row gap-8">
          <div className="text-[#2286C0] cursor-pointer" onClick={onEditClick}>
            {isEditing ? <LuSave /> : <FiEdit2 />}
          </div>
          <div className="cursor-pointer" onClick={onToggle}>
            <FaChevronDown
              className={`text-[#2286C0] transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {isOpen && <div className="flex flex-col gap-4 py-4 px-4 rounded-[8px] bg-white">{children}</div>}
    </div>
  );
};

export default Accordion;