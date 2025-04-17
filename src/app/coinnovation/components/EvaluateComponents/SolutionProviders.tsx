import React, { useState } from 'react';
import ParameterAccordion from './ParameterAccordion';
import { FiEdit2 } from "react-icons/fi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

interface SolutionProvidersProps { }

const SolutionProviders: React.FC<SolutionProvidersProps> = () => {
    const [openAccordions, setOpenAccordions] = useState<{ [key: number]: boolean }>({});
    const [editMode, setEditMode] = useState<{ [key: number]: boolean }>({});

    const toggleAccordion = (index: number) => {
        setOpenAccordions(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const toggleEditMode = (index: number) => {
        setEditMode((prev) => ({
            ...prev,
            [index]: !prev[index]
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
            {sections.map((section, index) => (
                <div key={index} className={`${openAccordions[index] ? "" : "border-b pb-2"}`}>
                    <div className="flex flex-row justify-between items-center">
                        <div className="text-[#4A4D4E] text-sm font-semibold">{section.label}</div>
                        <div className="flex flex-row gap-8 items-center">
                            <div className="text-[#2286C0] cursor-pointer" onClick={() => toggleEditMode(index)}>
                                {editMode[index] ? <span className="text-xs font-semibold">💾 Save</span> : <FiEdit2 />}
                            </div>
                            <div onClick={() => toggleAccordion(index)} className="text-[#2286C0] cursor-pointer">
                                {openAccordions[index] ? <IoIosArrowUp /> : <IoIosArrowDown />}
                            </div>
                        </div>
                    </div>
                    {openAccordions[index] && (
                        <div className="mt-2">
                            <ParameterAccordion sectionKey={section.key} isEditable={editMode[index] ?? false} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SolutionProviders;
