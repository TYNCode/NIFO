import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';
import { RiDeleteBin6Line, RiEditFill } from 'react-icons/ri';
import data from '../../data/ccd.json'
import axios from 'axios';
interface OneTabStepThreeProps {
}

const OneTabStepThree: React.FC<OneTabStepThreeProps> = (props) => {
    const [challengeTab, setChallengeTab] = useState("Focus Areas");
    const [endUserTab, setEndUserTab] = useState("Roles");
    const [outcomeTab, setOutcomeTab] = useState("Functional Requirements");
    const [isChallengeOpen, setChallengeOpen] = useState(true);
    const [isEndUserOpen, setEndUserOpen] = useState(false);
    const [isOutcomeOpen, setOutcomeOpen] = useState(false);
    const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
    const [docxFileUrl, setDocxFileUrl] = useState('')
    const API_BASE_URL = "https://tyn-server.azurewebsites.net/coinnovation";
    const challengeScenarioData = data?.final_document?.["Challenge Scenario"]?.[0] || {};
    const endUserProfileData = data?.final_document?.["Profile of the End-Users"]?.[0] || {};
    const getChallengeTabData = (key) => {
        const scenarioArray = data.final_document["Challenge Scenario"] || [];
        const foundObject = scenarioArray.find((item) => item[key]);
        return foundObject ? foundObject[key] : [];
    };

    const tabMapping = {
        "Roles": "Role",
        "Current Methods Employed": "Current methods to overcome the challenge"
    };

    const outcomeTabMapping = {
        "Functional Requirements": "Functional Requirements",
        "Constraints": "Constraints",
        "Key Performance Indicators (KPIs)": "Anticipated high-level % improvements & % reduction in KPIs possible through this initiative",
        "List of Features & Functionalities": "List of Features & Functionalities"
    };

    const getOutcomeTabData = (tabKey) => {
        const jsonKey = outcomeTabMapping[tabKey];
        if (!jsonKey) return ["No data available"];

        const outcomeData = data.final_document["Outcomes (Requirements & KPIs)"] || {};
        return outcomeData[jsonKey] ? outcomeData[jsonKey] : ["No data available"];
    };


    const getEndUserTabData = (tabKey) => {
        const jsonKey = tabMapping[tabKey];
        if (!jsonKey) return ["No data available"];
        const endUserArray = data.final_document["Profile of the End-Users"] || [];
        for (const obj of endUserArray) {
            const objKey = Object.keys(obj)[0];
            console.log(`Checking key: ${objKey} against ${jsonKey}`);
            if (objKey === jsonKey) {
                console.log("Match found:", obj[objKey]);
                return Array.isArray(obj[objKey]) ? obj[objKey] : [obj[objKey]];
            }
        }
        return ["No data available"];
    };

    const toggleAccordion = (section: string) => {
        if (section === "challenge") setChallengeOpen(!isChallengeOpen);
        if (section === "endUser") setEndUserOpen(!isEndUserOpen);
        if (section === "outcome") setOutcomeOpen(!isOutcomeOpen);
    };

    const callGenerateDocxAPI = async (jsonData) => {
        console.log("document issssssssss generated")
        setIsGeneratingDocx(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/generate-docx/`,
                jsonData,
                { headers: { "Content-Type": "application/json" }, responseType: "blob" }
            );
            const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
            const url = window.URL.createObjectURL(blob);
            setDocxFileUrl(url);

        } catch (error) {
            console.error("Error generating DOCX document:", error);
            alert("Failed to generate DOCX document.");
        } finally {
            setIsGeneratingDocx(false);
        }
    };

    const kpiTable = data.final_document["Operational KPI Metrics Table"];
    console.log(kpiTable);
    const metricKeys = Object.keys(kpiTable);

    return (
        <div className='bg-[#F4FCFF] px-4 py-4 flex flex-col gap-4'>
            <div>
                <div className='flex flex-row items-center justify-between px-6 py-4 bg-white rounded-[8px]'>
                    <div className='flex flex-col '>
                        <div className='text-[15px] font-semibold text-[#4A4D4E]'>1. Challenge Scenario</div>
                        <div className='text-[#4A4D4E] text-[12px] italic'>100-120 word description broadly to help understand the use cases, including relevant technical & operational requirements, constraints, and expected benefits</div>
                    </div>
                    <div className='flex flex-row gap-8'>
                        <div className='text-[#2286C0]'>
                            <FiEdit2 />
                        </div>
                        <div className='text-[#2286C0]'>
                            <RiDeleteBin6Line />
                        </div>
                        <div className="cursor-pointer" onClick={() => toggleAccordion("challenge")}>
                            <FaChevronDown className={`text-[#2286C0] transition-transform duration-300 ${isChallengeOpen ? "rotate-180" : ""}`} />
                        </div>
                    </div>
                </div>
                {isChallengeOpen && (
                    <div className='flex flex-col gap-4 py-4 px-4 rounded-[8px] bg-white'>
                        <div className='text-[#4A4D4E] text-[14px]'>
                            {data.final_document['Challenge Scenario'][0]?.Overview}
                        </div>
                        <div className='flex flex-col justify-center items-center bg-[#F4FCFF] px-4 pb-4 rounded-[8px]'>
                            <div className="flex border-b w-full border-gray-300 justify-center items-center">
                                {["Focus Areas", "Technical Requirements", "Expected Benefits"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setChallengeTab(tab)}
                                        className={`px-4 pb-3 pt-4 font-semibold text-sm transition duration-200 flex justify-center items-center
                            ${challengeTab === tab ? "border-b-2 border-[#2286C0] text-[#2286C0]" : "text-[#A1AEBE]"}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="text-[#4A4D4E] text-[14px] leading-tight px-4 mt-4 py-4 bg-white rounded-[8px] w-full">
                                {Array.isArray(getChallengeTabData(challengeTab)) ? (
                                    <ul className="list-disc list-inside space-y-2">
                                        {getChallengeTabData(challengeTab).map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No data available</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>

            <div className='flex flex-col'>
                <div className='flex flex-row gap-10 items-center justify-between px-6 py-4 bg-white rounded-[8px]'>
                    <div className='flex flex-col'>
                        <div className='text-[15px] font-semibold text-[#4A4D4E]'>2. Describe End Users Profile</div>
                        <div className='text-[#4A4D4E] text-[12px] italic'>Describe the profile of the end-users who face the challenge, including details of what are the current systems/capabilities available, and the methods employed to overcome the challenge.</div>
                    </div>
                    <div className='flex flex-row gap-8'>
                        <div className='text-[#2286C0]'>
                            <FiEdit2 />
                        </div>
                        <div className='text-[#2286C0]'>
                            <RiDeleteBin6Line />
                        </div>
                        <div className="cursor-pointer" onClick={() => toggleAccordion("endUser")}>
                            <FaChevronDown className={`text-[#2286C0] transition-transform duration-300 ${isEndUserOpen ? "rotate-180" : ""}`} />
                        </div>
                    </div>
                </div>

                {isEndUserOpen && (
                    <div className='flex flex-col gap-4 py-4 px-4 rounded-[8px] bg-white'>
                        <div className='flex flex-col justify-center items-center bg-[#F4FCFF] px-4 pb-4 rounded-[8px]'>
                            <div className="flex border-b w-full border-gray-300 justify-center items-center">
                                {["Roles", "Current Methods Employed"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setEndUserTab(tab)}
                                        className={`px-4 pb-3 pt-4 font-semibold text-sm transition duration-200 flex justify-center items-center
                            ${endUserTab === tab ? "border-b-2 border-[#2286C0] text-[#2286C0]" : "text-[#A1AEBE]"}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="text-[#4A4D4E] text-[14px] leading-tight px-4 mt-4 py-4 bg-white rounded-[8px] w-full">
                                {getEndUserTabData(endUserTab).length > 0 ? (
                                    <ul className="list-disc list-inside space-y-2">
                                        {getEndUserTabData(endUserTab).map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No data available</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div>
                <div className='flex flex-row  items-center justify-between px-6 py-4 bg-white rounded-[8px]'>
                    <div className='flex flex-col'>
                        <div className='text-[15px] font-semibold text-[#4A4D4E]'>3. Describe Outcomes ( KPI’s & Requirements )</div>
                        <div className='text-[#4A4D4E] text-[12px] italic'>Describe the quantified & qualified outcomes as KPIs and list out the various requirements in terms of jobs to be done, constraints, desired features & functionality the solution must meet.</div>
                    </div>
                    <div className='flex flex-row gap-8'>
                        <div className='text-[#2286C0]'>
                            <FiEdit2 />
                        </div>
                        <div className='text-[#2286C0]'>
                            <RiDeleteBin6Line />
                        </div>
                        <div className="cursor-pointer" onClick={() => toggleAccordion("outcome")}>
                            <FaChevronDown className={`text-[#2286C0] transition-transform duration-300 ${isOutcomeOpen ? "rotate-180" : ""}`} />
                        </div>
                    </div>
                </div>
                {isOutcomeOpen && (
                    <div className='flex flex-col gap-4 py-4 px-4 rounded-[8px] bg-white'>
                        <div className='flex flex-col justify-center items-center bg-[#F4FCFF] px-4 pb-4 rounded-[8px]'>
                            <div className="flex border-b w-full border-gray-300 justify-center items-center">
                                {[
                                    "Functional Requirements",
                                    "Constraints",
                                    "Key Performance Indicators (KPIs)",
                                    "List of Features & Functionalities"
                                ].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setOutcomeTab(tab)}
                                        className={`px-4 pb-3 pt-4 font-semibold text-sm transition duration-200 flex justify-center items-center
                            ${outcomeTab === tab ? "border-b-2 border-[#2286C0] text-[#2286C0]" : "text-[#A1AEBE]"}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="text-[#4A4D4E] text-[14px] leading-tight px-4 mt-4 py-4 bg-white rounded-[8px] w-full">
                                {Array.isArray(getOutcomeTabData(outcomeTab)) ? (
                                    <ul className="list-disc list-inside space-y-2">
                                        {getOutcomeTabData(outcomeTab).map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No data available</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-4 bg-white rounded-[8px] px-4 py-4">
                <div className="text-[14px] font-semibold text-[#354052]">Operational KPI Metrics</div>

                <div className='flex flex-col border border-[#E1E1E1] rounded-[8px]'>
                    <div className="grid grid-cols-5 text-[12px] font-semibold text-[#534D59] border-b border-[#E1E1E1] items-center">
                        {metricKeys.map((key, index) => (
                            <div key={index} className="px-4 py-3">
                                {key}
                            </div>
                        ))}
                    </div>

                    {kpiTable["Operational KPI Metrics"].map((_, rowIndex) => (
                        <div key={rowIndex} className="grid grid-cols-5 border-b border-[#E1E1E1] items-center">
                            {metricKeys.map((key, colIndex) => (
                                <div key={colIndex} className="px-4 py-3 text-[#1B2128] text-[12px]">
                                    {kpiTable[key][rowIndex]}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

            </div>

            <div className='flex flex-row gap-4 justify-end'>
                <button className='flex flex-row gap-2 bg-[#2286C0] text-white px-4 py-2 rounded-[12px] items-center justify-center shadow-[6px_10px_20px_0px_rgba(7, 7, 7, 0.1)]'>
                    <div>
                        <img src='/coinnovation/savepdd-icon.svg'/>
                    </div>
                    <div className='text-[12px]'>Save</div>
                </button>
                <button className='flex flex-row gap-2 bg-[#979797] text-white px-4 py-2 rounded-[12px] items-center justify-center shadow-[6px_10px_20px_0px_rgba(7, 7, 7, 0.1)]' onClick={callGenerateDocxAPI}>
                    <div>
                        <img src='/coinnovation/pdd-icon.svg' className=''/>
                    </div>
                    <div className='text-[12px]'>PDD Download</div>
                </button>
            </div>
        </div>
    );
};

export default OneTabStepThree;