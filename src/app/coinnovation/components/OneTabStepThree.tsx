import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';
import axios from 'axios';
import { LuSave } from 'react-icons/lu';
import { toast } from 'react-toastify';

interface OneTabStepThreeProps {
    jsonForDocument: Record<string, any> | null;
    setJsonForDocument: React.Dispatch<React.SetStateAction<Record<string, any> | null>>;
}
const OneTabStepThree: React.FC<OneTabStepThreeProps> = ({jsonForDocument, setJsonForDocument}) => {
    const [challengeTab, setChallengeTab] = useState("Focus Areas");
    const [endUserTab, setEndUserTab] = useState("Roles");
    const [outcomeTab, setOutcomeTab] = useState("Functional Requirements");
    const [isChallengeOpen, setChallengeOpen] = useState(true);
    const [isEndUserOpen, setEndUserOpen] = useState(false);
    const [isOutcomeOpen, setOutcomeOpen] = useState(false);
    const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
    const [docxFileUrl, setDocxFileUrl] = useState('');
    const [isEditingKpiTable, setIsEditingKpiTable] = useState(false);
    const [isEditingOutcome, setIsEditingOutcome] = useState(false);
    const [editableText, setEditableText] = useState('');
    const [isEditingEndUser, setIsEditingEndUser] = useState(false);
    const [editableEndUserText, setEditableEndUserText] = useState('');
    const [isEditingChallenge, setIsEditingChallenge] = useState(false);
    const [editableChallengeText, setEditableChallengeText] = useState('');

    const API_BASE_URL = "http://127.0.0.1:8000/coinnovation";
    const challengeScenarioData = jsonForDocument["Challenge Scenario"]?.[0] || {};
    const endUserProfileData = jsonForDocument["Profile of the End-Users"]?.[0] || {};
    const getChallengeTabData = (key) => {
        const scenarioArray = jsonForDocument["Challenge Scenario"] || [];
        const foundObject = scenarioArray.find((item) => item[key]);
        return foundObject ? foundObject[key] : [];
    };

    const endUserTabMapping = {
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

        const outcomeData = jsonForDocument["Outcomes (Requirements & KPIs)"] || {};
        return outcomeData[jsonKey] ? outcomeData[jsonKey] : ["No data available"];
    };


    const getEndUserTabData = (tabKey) => {
        const jsonKey = endUserTabMapping[tabKey];
        if (!jsonKey) return ["No data available"];
        const endUserArray = jsonForDocument["Profile of the End-Users"] || [];
        console.log(JSON.stringify(endUserArray));
        for (const obj of endUserArray) {
            const objKey = Object.keys(obj)[0];
            if (objKey === jsonKey) {
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
        const wrappedData = {
            final_document: jsonData  
        };
        setIsGeneratingDocx(true);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/generate-docx/`,
                wrappedData,   
                {
                    headers: { "Content-Type": "application/json" },
                    responseType: "blob"  
                }
            );

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Final_Document.docx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error generating DOCX document:", error);
            toast.error("Failed to generate DOCX document.");
        } finally {
            setIsGeneratingDocx(false);
        }
    };

    const kpiTable = jsonForDocument["Operational KPI Metrics Table"] || {};
    const metricKeys = Object.keys(kpiTable);
    const numRows = kpiTable["Operational KPI Metrics"]?.length || 0;

    const handleKpiCellChange = (rowIndex, columnKey, value) => {
        setJsonForDocument(prev => {
            const updated = { ...prev };
            const updatedColumn = [...updated["Operational KPI Metrics Table"][columnKey]];
            updatedColumn[rowIndex] = value;
            updated["Operational KPI Metrics Table"][columnKey] = updatedColumn;
            return updated;
        });
    };

    const handleAddKpiRow = () => {
        setJsonForDocument(prev => {
            const updated = { ...prev };
            const table = updated["Operational KPI Metrics Table"];

            const numRows = table["Operational KPI Metrics"].length;

            const isLastRowEmpty = metricKeys.some(key => table[key][numRows - 1] === "");

            if (numRows === 0 || !isLastRowEmpty) {
                metricKeys.forEach(key => {
                    table[key].push("");  
                });
            }

            return updated;
        });
    };

    const handleEditClick = () => {
        const currentData = getOutcomeTabData(outcomeTab);
        setEditableText(currentData.join('\n'));
        setIsEditingOutcome(true);
    };

    const handleSaveClick = () => {
        const updatedArray = editableText.split('\n').map(line => line.trim()).filter(line => line);
        updateOutcomeData(outcomeTab, updatedArray);
        setIsEditingOutcome(false);
    };

    const updateOutcomeData = (tab, dataArray) => {
        setJsonForDocument(prev => {
            const updated = { ...prev };
            const outcomeData = updated["Outcomes (Requirements & KPIs)"] || {};
            const jsonKey = outcomeTabMapping[tab];
            outcomeData[jsonKey] = dataArray;
            updated["Outcomes (Requirements & KPIs)"] = outcomeData;
            return updated;
        });
    };

    const handleEditEndUserClick = () => {
        const currentData = getEndUserTabData(endUserTab);
        setEditableEndUserText(currentData.join('\n'));
        setIsEditingEndUser(true);
    };

    const handleSaveEndUserClick = () => {
        const updatedArray = editableEndUserText.split('\n').map(line => line.trim()).filter(line => line);
        updateEndUserData(endUserTab, updatedArray);
        setIsEditingEndUser(false);
    };

    const updateEndUserData = (tab, dataArray) => {
        setJsonForDocument(prev => {
            const updated = { ...prev };
            const endUserArray = updated["Profile of the End-Users"] || [];

            const jsonKey = endUserTabMapping[tab];
            const updatedArray = endUserArray.map(item => {
                if (item.hasOwnProperty(jsonKey)) {
                    return { [jsonKey]: dataArray };
                }
                return item;
            });

            updated["Profile of the End-Users"] = updatedArray;
            return updated;
        });
    };

    const handleEditChallengeClick = () => {
        const currentData = getChallengeTabData(challengeTab);
        setEditableChallengeText(currentData.join('\n'));
        setIsEditingChallenge(true);
    };

    const handleSaveChallengeClick = () => {
        const updatedArray = editableChallengeText.split('\n').map(line => line.trim()).filter(line => line);
        updateChallengeData(challengeTab, updatedArray);
        setIsEditingChallenge(false);
    };

    const updateChallengeData = (tab, dataArray) => {
        setJsonForDocument(prev => {
            const updated = { ...prev };
            const scenarioArray = updated["Challenge Scenario"] || [{}];
            const firstScenario = scenarioArray[0];

            firstScenario[tab] = dataArray; 

            updated["Challenge Scenario"] = [firstScenario];  
            return updated;
        });
    };


    return (
        <div className='bg-[#F4FCFF] px-4 py-4 flex flex-col gap-4'>
            <div>
                <div className='flex flex-row items-center justify-between px-6 py-4 bg-white rounded-[8px]'>
                    <div className='flex flex-col '>
                        <div className='text-[15px] font-semibold text-[#4A4D4E]'>1. Challenge Scenario</div>
                        <div className='text-[#4A4D4E] text-[12px] italic'>
                            100-120 word description broadly to help understand the use cases, including relevant technical & operational requirements, constraints, and expected benefits
                        </div>
                    </div>
                    <div className='flex flex-row gap-8'>
                        <div className='text-[#2286C0] cursor-pointer' onClick={() => {
                            if (isEditingChallenge) {
                                handleSaveChallengeClick();
                            } else {
                                handleEditChallengeClick();
                            }
                        }}>
                            {isEditingChallenge ? <LuSave /> : <FiEdit2 />}
                        </div>
                        <div className="cursor-pointer" onClick={() => toggleAccordion("challenge")}>
                            <FaChevronDown className={`text-[#2286C0] transition-transform duration-300 ${isChallengeOpen ? "rotate-180" : ""}`} />
                        </div>
                    </div>
                </div>

                {isChallengeOpen && (
                    <div className='flex flex-col gap-4 py-4 px-4 rounded-[8px] bg-white'>
                        <div className='text-[#4A4D4E] text-[14px]'>
                            {jsonForDocument['Challenge Scenario'][0]?.Overview}
                        </div>
                        <div className='flex flex-col justify-center items-center bg-[#F4FCFF] px-4 pb-4 rounded-[8px]'>
                            <div className="flex border-b w-full border-gray-300 justify-center items-center">
                                {["Focus Areas", "Technical Requirements", "Expected Benefits"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => {
                                            if (isEditingChallenge) {
                                                toast.info("Please save your changes before switching tabs.");
                                                return;
                                            }
                                            setChallengeTab(tab);
                                        }}
                                        className={`px-4 pb-3 pt-4 font-semibold text-sm transition duration-200 flex justify-center items-center
                            ${challengeTab === tab ? "border-b-2 border-[#2286C0] text-[#2286C0]" : "text-[#A1AEBE]"}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="text-[#4A4D4E] text-[14px] leading-tight px-4 mt-4 py-4 bg-white rounded-[8px] w-full">
                                {isEditingChallenge ? (
                                    <textarea
                                        value={editableChallengeText}
                                        onChange={(e) => setEditableChallengeText(e.target.value)}
                                        className="w-full h-[150px] text-[14px] border border-gray-300 rounded px-2 py-1"
                                    />
                                ) : (
                                    <ul className="list-disc list-inside space-y-2">
                                        {getChallengeTabData(challengeTab).map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
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
                        <div className='text-[#4A4D4E] text-[12px] italic'>
                            Describe the profile of the end-users who face the challenge, including details of what are the current systems/capabilities available, and the methods employed to overcome the challenge.
                        </div>
                    </div>
                    <div className='flex flex-row gap-8'>
                        <div className='text-[#2286C0] cursor-pointer' onClick={() => {
                            if (isEditingEndUser) {
                                handleSaveEndUserClick();
                            } else {
                                handleEditEndUserClick();
                            }
                        }}>
                            {isEditingEndUser ? <LuSave /> : <FiEdit2 />}
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
                                        onClick={() => {
                                            if (isEditingEndUser) {
                                                toast.info("Please save your changes before switching tabs.");
                                                return;
                                            }
                                            setEndUserTab(tab);
                                        }}
                                        className={`px-4 pb-3 pt-4 font-semibold text-sm transition duration-200 flex justify-center items-center
                            ${endUserTab === tab ? "border-b-2 border-[#2286C0] text-[#2286C0]" : "text-[#A1AEBE]"}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="text-[#4A4D4E] text-[14px] leading-tight px-4 mt-4 py-4 bg-white rounded-[8px] w-full">
                                {isEditingEndUser ? (
                                    <textarea
                                        value={editableEndUserText}
                                        onChange={(e) => setEditableEndUserText(e.target.value)}
                                        className="w-full h-[150px] text-[14px] border border-gray-300 rounded px-2 py-1"
                                    />
                                ) : (
                                    <ul className="list-disc list-inside space-y-2">
                                        {getEndUserTabData(endUserTab).map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div>
                <div className='flex flex-row items-center justify-between px-6 py-4 bg-white rounded-[8px]'>
                    <div className='flex flex-col'>
                        <div className='text-[15px] font-semibold text-[#4A4D4E]'>3. Describe Outcomes (KPI’s & Requirements)</div>
                        <div className='text-[#4A4D4E] text-[12px] italic'>
                            Describe the quantified & qualified outcomes as KPIs and list out the various requirements in terms of jobs to be done, constraints, desired features & functionality the solution must meet.
                        </div>
                    </div>
                    <div className='flex flex-row gap-8'>
                        <div className='text-[#2286C0] cursor-pointer' onClick={() => {
                            if (isEditingOutcome) {
                                handleSaveClick(); // Save when editing
                            } else {
                                handleEditClick(); // Start edit when not editing
                            }
                        }}>
                            {isEditingOutcome ? <LuSave /> : <FiEdit2 />}
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
                                        onClick={() => {
                                            if (isEditingOutcome) {
                                                toast.info("Please save your changes before switching tabs.");
                                                return;
                                            }
                                            setOutcomeTab(tab);
                                        }}
                                        className={`px-4 pb-3 pt-4 font-semibold text-sm transition duration-200 flex justify-center items-center
                            ${outcomeTab === tab ? "border-b-2 border-[#2286C0] text-[#2286C0]" : "text-[#A1AEBE]"}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="text-[#4A4D4E] text-[14px] leading-tight px-4 mt-4 py-4 bg-white rounded-[8px] w-full">
                                {isEditingOutcome ? (
                                    <textarea
                                        value={editableText}
                                        onChange={(e) => setEditableText(e.target.value)}
                                        className="w-full h-[150px] text-[14px] border border-gray-300 rounded px-2 py-1"
                                    />
                                ) : (
                                    <ul className="list-disc list-inside space-y-2">
                                        {getOutcomeTabData(outcomeTab).map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-4 bg-white rounded-[8px] px-4 py-4">
                <div className="flex justify-between items-center">
                    <div className="text-[14px] font-semibold text-[#354052]">Operational KPI Metrics</div>
                    <button
                        onClick={() => {
                            if (isEditingKpiTable) {
                                setIsEditingKpiTable(false);  
                            } else {
                                handleAddKpiRow();         
                                setIsEditingKpiTable(true);
                            }
                        }}
                        className="bg-[#2286C0] text-white text-[12px] px-3 py-1 rounded-md"
                    >
                        {isEditingKpiTable ? "Save" : "+ Add Row"}
                    </button>
                </div>

                <div className='flex flex-col border border-[#E1E1E1] rounded-[8px]'>
                    <div className="grid grid-cols-5 text-[12px] font-semibold text-[#534D59] border-b border-[#E1E1E1] items-center">
                        {metricKeys.map((key, index) => (
                            <div key={index} className="px-4 py-3">
                                {key}
                            </div>
                        ))}
                    </div>

                    {/* Table Rows */}
                    {kpiTable["Operational KPI Metrics"].map((_, rowIndex) => (
                        <div key={rowIndex} className="grid grid-cols-5 border-b border-[#E1E1E1] items-center">
                            {metricKeys.map((key, colIndex) => (
                                <div key={colIndex} className="px-4 py-3">
                                    {isEditingKpiTable ? (
                                        <input
                                            type="text"
                                            value={kpiTable[key][rowIndex] || ""}
                                            onChange={(e) => handleKpiCellChange(rowIndex, key, e.target.value)}
                                            className="w-full text-[12px] text-[#1B2128] border border-[#D1D1D1] rounded px-2 py-1"
                                        />
                                    ) : (
                                        <span className="text-[12px] text-[#1B2128]">
                                            {kpiTable[key][rowIndex] || ""}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className='flex flex-row gap-4 justify-end'>
                {/* <button className='flex flex-row gap-2 bg-[#2286C0] text-white px-4 py-2 rounded-[12px] items-center justify-center shadow-[6px_10px_20px_0px_rgba(7, 7, 7, 0.1)]'>
                    <div>
                        <img src='/coinnovation/savepdd-icon.svg'/>
                    </div>
                    <div className='text-[12px]'>Save</div>
                </button> */}
                <button
                    className='flex flex-row gap-2 bg-[#2286C0] text-white px-4 py-2 rounded-[12px] items-center justify-center shadow-[6px_10px_20px_0px_rgba(7, 7, 7, 0.1)]'
                    onClick={() => callGenerateDocxAPI(jsonForDocument)} 
                >
                    <div>
                        <img src='/coinnovation/pdd-icon.svg' className='' alt="PDD Icon" />
                    </div>
                    <div className='text-[12px]'>PDD Download</div>
                </button>

            </div>
        </div>
    );
};

export default OneTabStepThree;