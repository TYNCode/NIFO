import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';
import { RiDeleteBin6Line, RiEditFill } from 'react-icons/ri';
import data from '../../data/ccd.json'
interface OneTabStepThreeProps {
}

const OneTabStepThree: React.FC<OneTabStepThreeProps> = (props) => {
    const [activeTab, setActiveTab] = useState("Focus Areas");

    const challengeScenarioData = data?.final_document?.["Challenge Scenario"]?.[0] || {};
    const getTabData = (key) => {
        const scenarioArray = data.final_document["Challenge Scenario"] || []; 
        const foundObject = scenarioArray.find((item) => item[key]); 
        return foundObject ? foundObject[key] : []; 
    };



    return (
        <div>
            <div>
                <div className='flex flex-row gap-2'>
                    <div>
                        <div>1. Challenge Scenario</div>
                        <div>100-120 word description broadly to help understand the use cases, including relevant technical & operational requirements, constraints, and expected benefits</div>
                    </div>
                    <div>
                        <FiEdit2 />
                    </div>
                    <div>
                        <RiDeleteBin6Line />
                    </div>
                    <div>
                        <FaChevronDown />
                    </div>
                </div>
                <div>
                    <div>
                        <div className='text-[#4A4D4E] font-[14px]'>
                            {data.final_document['Challenge Scenario'][0]?.Overview}
                        </div>
                        <div className="flex border-b border-gray-300 justify-center items-center">
                            {["Focus Areas", "Technical Requirements", "Expected Benefits"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 font-semibold text-sm transition duration-200 flex justify-center items-center
                            ${activeTab === tab ? "border-b-2 border-[#2286C0] text-[#2286C0]" : "text-[#A1AEBE]"}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 text-[#4A4D4E]">
                            {Array.isArray(getTabData(activeTab)) ? (
                                <ul className="list-disc list-inside space-y-2">
                                    {getTabData(activeTab).map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No data available</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
            <div>
                <div className='flex flex-col'>
                    <div>2. Describe End Users Profile</div>
                    <div>Describe the profile of the end-users who face the challenge, including details of what are the current systems/capabilities available, and the methods employed to overcome the challenge.</div>
                </div>
                <div>
                    <FiEdit2 />
                </div>
                <div>
                    <RiDeleteBin6Line />
                </div>
                <div>
                    <FaChevronDown />
                </div>
            </div>
            <div className='flex flex-row'>
                <div className='flex flex-col'>
                    <div>Describe Outcomes ( KPI’s & Requirements )</div>
                    <div>Describe the quantified & qualified outcomes as KPIs and list out the various requirements in terms of jobs to be done, constraints, desired features & functionality the solution must meet.</div>
                </div>
                <div>
                    <FiEdit2 />
                </div>
                <div>
                    <RiDeleteBin6Line />
                </div>
                <div>
                    <FaChevronDown />
                </div>
            </div>
        </div>
    );
};

export default OneTabStepThree;