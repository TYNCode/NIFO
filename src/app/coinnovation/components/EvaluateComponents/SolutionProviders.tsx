import React, { useState } from 'react';
import ParameterAccordion from './ParameterAccordion';
import { FiEdit2 } from "react-icons/fi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

interface SolutionProvidersProps {
  providerId: string;
}

const SolutionProviders: React.FC<SolutionProvidersProps> = ({ providerId }) => {
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({});
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});

  const toggleAccordion = (sectionKey: string) => {
    setOpenAccordions(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const toggleEditMode = (sectionKey: string) => {
    setEditMode(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const sections = [
    { label: "Total Investment (CAPEX)", key: "CAPEX" },
    { label: "Existing Annual Expenses", key: "Existing_Annual_Expenses" },
    { label: "Annual Recurring Expenses (OPEX) - Estimate", key: "Annual_OPEX" },
    { label: "Annual Savings (Recurring Benefits)", key: "Annual_Savings" },
    { label: "Invaluable ROI", key: "Invaluable_ROI" }
  ];

  return (
    <div className="flex flex-col gap-6 w-full px-4 sm:px-6 md:px-10">
      {sections.map(section => {
        const isOpen = openAccordions[section.key] ?? false;
        const isEditing = editMode[section.key] ?? false;

        return (
          <div
            key={section.key}
            className={`rounded-xl border border-gray-200 shadow-sm transition-all duration-300 ${
              isOpen ? "bg-white" : "bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4 border-b">
              <h2 className="text-xs sm:text-base font-semibold text-[#2F2F2F]">
                {section.label}
              </h2>

              <div className="flex gap-4 items-center">
                <button
                  onClick={() => toggleEditMode(section.key)}
                  disabled={!isOpen}
                  className={`text-sm sm:text-base font-medium flex items-center gap-1 transition ${
                    isOpen
                      ? 'text-[#2286C0] hover:underline'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isEditing ? (
                    <>
                      💾 <span className='text-xs sm:text-base'>Save</span>
                    </>
                  ) : (
                    <FiEdit2 className="text-lg" />
                  )}
                </button>

                <button onClick={() => toggleAccordion(section.key)} className="text-[#2286C0] text-xl">
                  {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
              </div>
            </div>

            {isOpen && (
              <div className="p-4 sm:p-6 bg-white transition-all">
                <ParameterAccordion sectionKey={section.key} isEditable={isEditing} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SolutionProviders;
