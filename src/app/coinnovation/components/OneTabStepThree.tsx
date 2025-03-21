
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Accordion from './OneTabStepThreeComponents/Accordian';
import TabPanel from './OneTabStepThreeComponents/TabPanel';
import EditableContent from './OneTabStepThreeComponents/EditableContent';
import KpiTable from './OneTabStepThreeComponents/KpiTable';
import DownloadButton from './OneTabStepThreeComponents/DownloadButton';
import { useDocumentData } from './OneTabStepThreeComponents/useDocumentData';


interface OneTabStepThreeProps {
  jsonForDocument: Record<string, any> | null;
  setJsonForDocument: React.Dispatch<React.SetStateAction<Record<string, any> | null>>;
  projectID: string;
  setSelectedTab: (id:number) => void;
}

const OneTabStepThree: React.FC<OneTabStepThreeProps> = ({
  jsonForDocument,
  setJsonForDocument,
  projectID,
  setSelectedTab
}) => {
  // Tab states
  const [challengeTab, setChallengeTab] = useState("Focus Areas");
  const [endUserTab, setEndUserTab] = useState("Roles");
  const [outcomeTab, setOutcomeTab] = useState("Functional Requirements");
  
  // Accordion states
  const [isChallengeOpen, setChallengeOpen] = useState(true);
  const [isEndUserOpen, setEndUserOpen] = useState(false);
  const [isOutcomeOpen, setOutcomeOpen] = useState(false);
  
  // Editing states
  const [isEditingKpiTable, setIsEditingKpiTable] = useState(false);
  const [isEditingOutcome, setIsEditingOutcome] = useState(false);
  const [isEditingEndUser, setIsEditingEndUser] = useState(false);
  const [isEditingChallenge, setIsEditingChallenge] = useState(false);
  
  // Editable text states
  const [editableText, setEditableText] = useState('');
  const [editableEndUserText, setEditableEndUserText] = useState('');
  const [editableChallengeText, setEditableChallengeText] = useState('');
  
  const {
    projectDetails,
    isGeneratingDocx,
    isSaving,
    saveDocument,
    handleGenerateDocx
  } = useDocumentData(projectID, jsonForDocument);

  // Toggle functions
  const toggleAccordion = (section: string) => {
    if (section === "challenge") setChallengeOpen(!isChallengeOpen);
    if (section === "endUser") setEndUserOpen(!isEndUserOpen);
    if (section === "outcome") setOutcomeOpen(!isOutcomeOpen);
  };

  // Data accessor functions
  const getChallengeTabData = (key: string) => {
    if (!jsonForDocument) return [];
    const scenarioArray = jsonForDocument["Challenge Scenario"] || [];
    const foundObject = scenarioArray.find((item: any) => item[key]);
    return foundObject ? foundObject[key] : [];
  };

  const endUserTabMapping: Record<string, string> = {
    "Roles": "Roles",
    "Current Methods Employed": "Current methods to overcome the challenge"
  };

  const getEndUserTabData = (tabKey: string) => {
    if (!jsonForDocument) return ["No data available"];
    const jsonKey = endUserTabMapping[tabKey];
    if (!jsonKey) return ["No data available"];
    
    const endUserArray = jsonForDocument["Profile of the End-Users"] || [];
    for (const obj of endUserArray) {
      const objKey = Object.keys(obj)[0];
      if (objKey === jsonKey) {
        return Array.isArray(obj[objKey]) ? obj[objKey] : [obj[objKey]];
      }
    }
    return ["No data available"];
  };

  const outcomeTabMapping: Record<string, string> = {
    "Functional Requirements": "Functional Requirements",
    "Constraints": "Constraints",
    "Key Performance Indicators (KPIs)": "Anticipated high-level % improvements & % reduction in KPIs possible through this initiative",
    "List of Features & Functionalities": "List of Features & Functionalities"
  };

  const getOutcomeTabData = (tabKey: string) => {
    if (!jsonForDocument) return ["No data available"];
    const jsonKey = outcomeTabMapping[tabKey];
    if (!jsonKey) return ["No data available"];

    const outcomeData = jsonForDocument["Outcomes (Requirements & KPIs)"] || {};
    return outcomeData[jsonKey] ? outcomeData[jsonKey] : ["No data available"];
  };

  // KPI Table handlers
  const handleKpiCellChange = (rowIndex: number, columnKey: string, value: string) => {
    setJsonForDocument(prev => {
      if (!prev) return prev;
      const updated = { ...prev };
      const updatedColumn = [...updated["Operational KPI Metrics Table"][columnKey]];
      updatedColumn[rowIndex] = value;
      updated["Operational KPI Metrics Table"][columnKey] = updatedColumn;
      return updated;
    });
  };

  const handleAddKpiRow = () => {
    setJsonForDocument(prev => {
      if (!prev) return prev;
      const updated = { ...prev };
      const table = updated["Operational KPI Metrics Table"];
      const metricKeys = Object.keys(table);
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

  // Edit/Save handlers
  const handleEditClick = () => {
    const currentData = getOutcomeTabData(outcomeTab);
    setEditableText(currentData.join('\n'));
    setIsEditingOutcome(true);
  };

  const handleSaveClick = async () => {
    const updatedArray = editableText.split('\n').map(line => line.trim()).filter(line => line);
    updateOutcomeData(outcomeTab, updatedArray);
    setIsEditingOutcome(false);
    await saveDocument();
  };

  const handleEditEndUserClick = () => {
    const currentData = getEndUserTabData(endUserTab);
    setEditableEndUserText(currentData.join('\n'));
    setIsEditingEndUser(true);
  };

  const handleSaveEndUserClick = async () => {
    const updatedArray = editableEndUserText.split('\n').map(line => line.trim()).filter(line => line);
    updateEndUserData(endUserTab, updatedArray);
    setIsEditingEndUser(false);
    await saveDocument();
  };

  const handleEditChallengeClick = () => {
    const currentData = getChallengeTabData(challengeTab);
    setEditableChallengeText(currentData.join('\n'));
    setIsEditingChallenge(true);
  };

  const handleSaveChallengeClick = async () => {
    const updatedArray = editableChallengeText.split('\n').map(line => line.trim()).filter(line => line);
    updateChallengeData(challengeTab, updatedArray);
    setIsEditingChallenge(false);
    await saveDocument();
  };

  // Data update functions
  const updateOutcomeData = (tab: string, dataArray: string[]) => {
    setJsonForDocument(prev => {
      if (!prev) return prev;
      const updated = { ...prev };
      const outcomeData = updated["Outcomes (Requirements & KPIs)"] || {};
      const jsonKey = outcomeTabMapping[tab];
      outcomeData[jsonKey] = dataArray;
      updated["Outcomes (Requirements & KPIs)"] = outcomeData;
      return updated;
    });
  };

  const updateEndUserData = (tab: string, dataArray: string[]) => {
    setJsonForDocument(prev => {
      if (!prev) return prev;
      const updated = { ...prev };
      const endUserArray = updated["Profile of the End-Users"] || [];
      const jsonKey = endUserTabMapping[tab];
      
      const updatedArray = endUserArray.map((item: any) => {
        if (item.hasOwnProperty(jsonKey)) {
          return { [jsonKey]: dataArray };
        }
        return item;
      });

      updated["Profile of the End-Users"] = updatedArray;
      return updated;
    });
  };

  const updateChallengeData = (tab: string, dataArray: string[]) => {
    setJsonForDocument(prev => {
      if (!prev) return prev;
      const updated = { ...prev };
      const scenarioArray = updated["Challenge Scenario"] || [{}];
      const firstScenario = scenarioArray[0];
      firstScenario[tab] = dataArray;
      updated["Challenge Scenario"] = [firstScenario];
      return updated;
    });
  };

  if (!jsonForDocument) {
    return <div className="p-4 text-center">Loading document data...</div>;
  }

  return (
    <div className='bg-[#F4FCFF] px-4 py-4 flex flex-col gap-4'>
      {/* Challenge Scenario Section */}
      <Accordion
        title="1. Challenge Scenario"
        subtitle="100-120 word description broadly to help understand the use cases, including relevant technical & operational requirements, constraints, and expected benefits"
        isOpen={isChallengeOpen}
        isEditing={isEditingChallenge}
        onToggle={() => toggleAccordion("challenge")}
        onEditClick={() => {
          if (isEditingChallenge) {
            handleSaveChallengeClick();
          } else {
            handleEditChallengeClick();
          }
        }}
      >
        <div className='text-[#4A4D4E] text-[14px]'>
          {jsonForDocument['Challenge Scenario'][0]?.Overview}
        </div>
        <TabPanel
          tabs={["Focus Areas", "Technical Requirements", "Expected Benefits"]}
          activeTab={challengeTab}
          setActiveTab={setChallengeTab}
          isEditing={isEditingChallenge}
        >
          <EditableContent
            isEditing={isEditingChallenge}
            editableText={editableChallengeText}
            setEditableText={setEditableChallengeText}
            displayItems={getChallengeTabData(challengeTab)}
          />
        </TabPanel>
      </Accordion>

      {/* End User Profile Section */}
      <Accordion
        title="2. Describe End Users Profile"
        subtitle="Describe the profile of the end-users who face the challenge, including details of what are the current systems/capabilities available, and the methods employed to overcome the challenge."
        isOpen={isEndUserOpen}
        isEditing={isEditingEndUser}
        onToggle={() => toggleAccordion("endUser")}
        onEditClick={() => {
          if (isEditingEndUser) {
            handleSaveEndUserClick();
          } else {
            handleEditEndUserClick();
          }
        }}
      >
        <TabPanel
          tabs={["Roles", "Current Methods Employed"]}
          activeTab={endUserTab}
          setActiveTab={setEndUserTab}
          isEditing={isEditingEndUser}
        >
          <EditableContent
            isEditing={isEditingEndUser}
            editableText={editableEndUserText}
            setEditableText={setEditableEndUserText}
            displayItems={getEndUserTabData(endUserTab)}
          />
        </TabPanel>
      </Accordion>

      {/* Outcomes Section */}
      <Accordion
        title="3. Describe Outcomes (KPI's & Requirements)"
        subtitle="Describe the quantified & qualified outcomes as KPIs and list out the various requirements in terms of jobs to be done, constraints, desired features & functionality the solution must meet."
        isOpen={isOutcomeOpen}
        isEditing={isEditingOutcome}
        onToggle={() => toggleAccordion("outcome")}
        onEditClick={() => {
          if (isEditingOutcome) {
            handleSaveClick();
          } else {
            handleEditClick();
          }
        }}
      >
        <TabPanel
          tabs={[
            "Functional Requirements",
            "Constraints",
            "Key Performance Indicators (KPIs)",
            "List of Features & Functionalities"
          ]}
          activeTab={outcomeTab}
          setActiveTab={setOutcomeTab}
          isEditing={isEditingOutcome}
        >
          <EditableContent
            isEditing={isEditingOutcome}
            editableText={editableText}
            setEditableText={setEditableText}
            displayItems={getOutcomeTabData(outcomeTab)}
          />
        </TabPanel>
      </Accordion>

      {/* KPI Metrics Table */}
      <KpiTable
        kpiTable={jsonForDocument["Operational KPI Metrics Table"] || {}}
        isEditing={isEditingKpiTable}
        onAddRow={handleAddKpiRow}
        onToggleEdit={() => setIsEditingKpiTable(!isEditingKpiTable)}
        onCellChange={handleKpiCellChange}
      />

      {/* Action Buttons */}
      <div className='flex flex-row gap-4 justify-end'>
        <div className='flex flex-row gap-2 text-[12px] cursor-pointer bg-[#2286C0] text-white px-4 py-2 rounded-[12px] items-center justify-center shadow-[6px_10px_20px_0px_rgba(7, 7, 7, 0.1)]"' onClick={()=>setSelectedTab(2)}>
          Continue to source solution providers
        </div>
        <DownloadButton
          onClick={handleGenerateDocx}
          isLoading={isGeneratingDocx}
        />
      </div>
    </div>
  );
};

export default OneTabStepThree;