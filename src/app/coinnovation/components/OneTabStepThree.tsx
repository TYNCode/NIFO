import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  updatePDD,
  setJsonForDocument,
} from "../../redux/features/coinnovation/challengeSlice";
import {
  enableStep,
  setSelectedTab,
} from "../../redux/features/coinnovation/projectSlice";

import Accordion from "./OneTabStepThreeComponents/Accordian";
import TabPanel from "./OneTabStepThreeComponents/TabPanel";
import EditableContent from "./OneTabStepThreeComponents/EditableContent";
import KpiTable from "./OneTabStepThreeComponents/KpiTable";
import DownloadButton from "./OneTabStepThreeComponents/DownloadButton";
import Button from "./TwoTabStepComponents/Button";

const OneTabStepThree: React.FC = () => {
  const dispatch = useAppDispatch();
  const jsonForDocument = useAppSelector(
    (state) => state.challenge.jsonForDocument
  );
  const projectID = useAppSelector((state) => state.projects.projectID);
  const [editableText, setEditableText] = useState("");
  const [challengeTab, setChallengeTab] = useState("Focus Areas");
  const [endUserTab, setEndUserTab] = useState("Roles");
  const [outcomeTab, setOutcomeTab] = useState("Functional Requirements");
  const [isChallengeOpen, setChallengeOpen] = useState(true);
  const [isEndUserOpen, setEndUserOpen] = useState(false);
  const [isOutcomeOpen, setOutcomeOpen] = useState(false);
  const [isEditingChallenge, setIsEditingChallenge] = useState(false);
  const [isEditingEndUser, setIsEditingEndUser] = useState(false);
  const [isEditingOutcome, setIsEditingOutcome] = useState(false);
  const [isEditingKpiTable, setIsEditingKpiTable] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSourceSolution = () => {
    dispatch(enableStep(2));
    dispatch(setSelectedTab(2));
  };

  const endUserTabMapping = {
    Roles: "Roles",
    "Current Methods Employed": "Current methods to overcome the challenge",
  };

  const outcomeTabMapping = {
    "Functional Requirements": "Functional Requirements",
    Constraints: "Constraints",
    "Key Performance Indicators (KPIs)":
      "Anticipated high-level % improvements & % reduction in KPIs possible through this initiative",
    "List of Features & Functionalities": "List of Features & Functionalities",
  };

  const getTabData = (section: string, tab: string) => {
    if (!jsonForDocument) return [];

    // For 'challenge' section
    if (section === "challenge") {
      const sectionData = jsonForDocument["Challenge Scenario"];

      // Check if the 'Challenge Scenario' is an object, not an array
      if (typeof sectionData !== "object" || Array.isArray(sectionData)) {
        console.error("Challenge Scenario is not an object:", sectionData);
        return [];
      }

      const sectionItem = sectionData[tab];
      if (!sectionItem) return [];

      return typeof sectionItem === "string" ? [sectionItem] : sectionItem;
    }

    // For 'endUser' section
    if (section === "endUser") {
      const jsonKey = endUserTabMapping[tab];

      const profileOfEndUsers = jsonForDocument["Profile of the End-Users"];
      if (profileOfEndUsers && typeof profileOfEndUsers === "object") {
        const data = profileOfEndUsers[jsonKey];
        return data ? (Array.isArray(data) ? data : [data]) : [];
      }

      console.error(
        "'Profile of the End-Users' is not an object:",
        profileOfEndUsers
      );
      return [];
    }

    // For 'outcome' section
    if (section === "outcome") {
      const jsonKey = outcomeTabMapping[tab];
      const data = jsonForDocument["Outcomes (Requirements & KPIs)"]?.[jsonKey];
      return data ? (Array.isArray(data) ? data : [data]) : [];
    }

    return [];
  };

  const saveSection = async (
    section: string,
    tabKey: string,
    mapping: Record<string, string> | undefined,
    setEdit: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!projectID || !jsonForDocument) return;

    const jsonKey = mapping ? mapping[tabKey] : tabKey;
    const sectionKey =
      section === "challenge"
        ? "Challenge Scenario"
        : section === "endUser"
          ? "Profile of the End-Users"
          : "Outcomes (Requirements & KPIs)";

    const lines = editableText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    let valueArray: any = lines;

    // For object-type key-value editing like Focus Areas
    const isKeyValueObject =
      section === "challenge" &&
      ["Focus Areas", "Technical Requirements", "Expected Benefits"].includes(
        tabKey
      );

    const isTitleDescObject =
      section === "outcome" &&
      [
        "Functional Requirements",
        "List of Features & Functionalities",
      ].includes(tabKey);

    if (isKeyValueObject) {
      valueArray = lines
        .map((line) => {
          const splitIndex = line.indexOf(":");
          if (splitIndex === -1) return null;
          const key = line.slice(0, splitIndex).trim();
          const value = line.slice(splitIndex + 1).trim();
          return { [key]: value };
        })
        .filter(Boolean);
    }

    if (isTitleDescObject) {
      valueArray = lines
        .map((line) => {
          const splitIndex = line.indexOf(":");
          if (splitIndex === -1) return null;
          const title = line.slice(0, splitIndex).trim();
          const description = line.slice(splitIndex + 1).trim();
          return { Title: title, Description: description };
        })
        .filter(Boolean);
    }

    const updatedJson = JSON.parse(JSON.stringify(jsonForDocument));

    if (sectionKey === "Challenge Scenario") {
      if (
        typeof updatedJson[sectionKey] === "object" &&
        !Array.isArray(updatedJson[sectionKey])
      ) {
        updatedJson[sectionKey][jsonKey] = valueArray;
      }
    } else {
      updatedJson[sectionKey][jsonKey] = valueArray;
    }

    const result = await dispatch(
      updatePDD({ projectID, jsonForDocument: updatedJson })
    ).unwrap();
    dispatch(setJsonForDocument(result));
    setEdit(false);
  };

  const handleEditClick = (
    section: string,
    tabKey: string,
    mapping: Record<string, string> | undefined,
    setEdit: React.Dispatch<React.SetStateAction<boolean>>,
    setText: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const display = getTabData(section, tabKey);

    const formattedText = display
      .map((item: any) => {
        if (typeof item === "string") return item;
        if (typeof item === "object") {
          if (item.Title && item.Description) {
            return `${item.Title}: ${item.Description}`;
          }

          const entries = Object.entries(item);
          if (entries.length === 1) {
            const [key, value] = entries[0];
            return `${key}: ${value}`;
          }
        }

        return ""; // fallback
      })
      .filter(Boolean)
      .join("\n");

    setText(formattedText);
    setEdit(true);
  };

  const handleKpiCellChange = (
    rowIndex: number,
    columnKey: string,
    value: string
  ) => {};

  if (!jsonForDocument) return <div className="p-4">Loading...</div>;

  const handleDownloadDoc = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch("https://tyn-server.azurewebsites.net/coinnovation/generate-docx/", {
        method: "POST",
        body: JSON.stringify({ project_id: projectID }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to generate document");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "Final_Document.docx";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };


  return (
    <div className="bg-[#F4FCFF] px-4 py-4 flex flex-col gap-4">
      <Accordion
        title="1. Challenge Scenario"
        subtitle="Use cases, requirements, constraints, benefits"
        isOpen={isChallengeOpen}
        isEditing={isEditingChallenge}
        onToggle={() => setChallengeOpen((prev) => !prev)}
        onEditClick={() =>
          isEditingChallenge
            ? saveSection(
                "challenge",
                challengeTab,
                undefined,
                setIsEditingChallenge
              )
            : handleEditClick(
                "challenge",
                challengeTab,
                undefined,
                setIsEditingChallenge,
                setEditableText
              )
        }
      >
        <TabPanel
          tabs={["Focus Areas", "Technical Requirements", "Expected Benefits"]}
          activeTab={challengeTab}
          setActiveTab={setChallengeTab}
          isEditing={isEditingChallenge}
        >
          <EditableContent
            isEditing={isEditingChallenge}
            editableText={editableText}
            setEditableText={setEditableText}
            displayItems={getTabData("challenge", challengeTab)}
          />
        </TabPanel>
      </Accordion>

      <Accordion
        title="2. Describe End Users Profile"
        subtitle="Roles and current methods"
        isOpen={isEndUserOpen}
        isEditing={isEditingEndUser}
        onToggle={() => setEndUserOpen((prev) => !prev)}
        onEditClick={() =>
          isEditingEndUser
            ? saveSection(
                "endUser",
                endUserTab,
                endUserTabMapping,
                setIsEditingEndUser
              )
            : handleEditClick(
                "endUser",
                endUserTab,
                endUserTabMapping,
                setIsEditingEndUser,
                setEditableText
              )
        }
      >
        <TabPanel
          tabs={["Roles", "Current Methods Employed"]}
          activeTab={endUserTab}
          setActiveTab={setEndUserTab}
          isEditing={isEditingEndUser}
        >
          <EditableContent
            isEditing={isEditingEndUser}
            editableText={editableText}
            setEditableText={setEditableText}
            displayItems={getTabData("endUser", endUserTab)}
          />
        </TabPanel>
      </Accordion>

      <Accordion
        title="3. Describe Outcomes (KPI's & Requirements)"
        subtitle="KPIs and feature requirements"
        isOpen={isOutcomeOpen}
        isEditing={isEditingOutcome}
        onToggle={() => setOutcomeOpen((prev) => !prev)}
        onEditClick={() =>
          isEditingOutcome
            ? saveSection(
                "outcome",
                outcomeTab,
                outcomeTabMapping,
                setIsEditingOutcome
              )
            : handleEditClick(
                "outcome",
                outcomeTab,
                outcomeTabMapping,
                setIsEditingOutcome,
                setEditableText
              )
        }
      >
        <TabPanel
          tabs={[
            "Functional Requirements",
            "Constraints",
            "Key Performance Indicators (KPIs)",
            "List of Features & Functionalities",
          ]}
          activeTab={outcomeTab}
          setActiveTab={setOutcomeTab}
          isEditing={isEditingOutcome}
        >
          <EditableContent
            isEditing={isEditingOutcome}
            editableText={editableText}
            setEditableText={setEditableText}
            displayItems={getTabData("outcome", outcomeTab)}
          />
        </TabPanel>
      </Accordion>

      <KpiTable
        kpiTable={jsonForDocument["Operational KPI Metrics Table"] || {}}
        isEditing={isEditingKpiTable}
        onAddRow={() => {}}
        onToggleEdit={() => setIsEditingKpiTable(!isEditingKpiTable)}
        onCellChange={handleKpiCellChange}
      />

      <div className="flex justify-end gap-4">
        <Button
          label="Source solution providers"
          onClick={() => handleSourceSolution()}
        />
        <DownloadButton onClick={handleDownloadDoc} isLoading={false} />
      </div>
    </div>
  );
};

export default OneTabStepThree;
