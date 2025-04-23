import React, { useEffect, useState } from 'react';
import ParameterAccordion from './ParameterAccordion';
import { FiEdit2 } from "react-icons/fi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useAppSelector } from '../../../redux/hooks';

interface SolutionProvidersProps {
    providerId: string;
}

const SolutionProviders: React.FC<{ providerId: string }> = ({ providerId }) => {
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
        <div className="flex flex-col gap-6">
            {sections.map((section) => {
                const isOpen = openAccordions[section.key] ?? false;
                const isEditing = editMode[section.key] ?? false;

                return (
                    <div key={section.key} className={`${isOpen ? "" : "border-b pb-2"}`}>
                        <div className="flex flex-row justify-between items-center">
                            <div className="text-[#4A4D4E] text-sm font-semibold">{section.label}</div>
                            <div className="flex flex-row gap-8 items-center">
                                <div
                                    className={`text-[#2286C0] cursor-pointer transition-opacity ${!isOpen ? 'pointer-events-none text-gray-500 opacity-50' : ''}`}
                                    onClick={() => toggleEditMode(section.key)}
                                >
                                    {isEditing ? (
                                        <span className="text-xs font-semibold">💾 Save</span>
                                    ) : (
                                        <FiEdit2 />
                                    )}
                                </div>

                                <div onClick={() => toggleAccordion(section.key)} className="text-[#2286C0] cursor-pointer">
                                    {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                                </div>
                            </div>
                        </div>
                        {isOpen && (
                            <div className="mt-2">
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
