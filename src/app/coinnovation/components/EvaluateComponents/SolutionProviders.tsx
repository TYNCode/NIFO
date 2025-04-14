import React, { useState } from 'react';
import ParameterAccordion from './ParameterAccordion';
import { FiEdit2 } from "react-icons/fi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

interface SolutionProvidersProps { }

const SolutionProviders: React.FC<SolutionProvidersProps> = () => {
    const [openAccordions, setOpenAccordions] = useState<{ [key: number]: boolean }>({});

    const toggleAccordion = (index: number) => {
        setOpenAccordions(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const sections = [
        "Total Investment (CAPEX)",
        "Existing Annual Expenses",
        "Annual Recurring Expenses (OPEX) - Estimate",
        "Annual Savings (Recurring Benefits)",
        "Payback Period Calculation",
        "Invaluable ROI"
    ];

    return (
        <div className="flex flex-col gap-6">
            {sections.map((sectionTitle, index) => (
                <div key={index} className={`${openAccordions[index] ? "" : "border-b pb-2"}`}>
                    <div className="flex flex-row justify-between items-center">
                        <div className="text-[#4A4D4E] text-sm font-semibold">{sectionTitle}</div>
                        <div className="flex flex-row gap-8 items-center">
                            <FiEdit2 className=" text-[#2286C0]  cursor-pointer" />
                            <div onClick={() => toggleAccordion(index)} className="text-[#2286C0] cursor-pointer">
                                {openAccordions[index] ? <IoIosArrowUp /> : <IoIosArrowDown />}
                            </div>
                        </div>
                    </div>
                    {openAccordions[index] && (
                        <div className="mt-2">
                            <ParameterAccordion />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SolutionProviders;
