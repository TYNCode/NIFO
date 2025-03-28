"use client";

import React, { useState, useEffect } from "react";
import OneTabStepOne from "./OneTabStepOne";
import OneTabStepTwo from "./OneTabStepTwo";
import OneTabStepThree from "./OneTabStepThree";
import Tabs from "./Tabs";

interface ProgressOneProps {
  projectID: string | null;
  setProjectID: (id: string | null) => void;
  setSelectedTab: (id: number) => void;
}

const ProgressOne: React.FC<ProgressOneProps> = ({ projectID, setProjectID ,setSelectedTab }) => {
  const [activeTab, setActiveTab] = useState<string>("01.a");
  const [problemStatement, setProblemStatement] = useState<string>("");
  const [responseData, setResponseData] = useState<string | null>(null);
  const [questionnaireData, setQuestionnaireData] = useState<any>(null);
  const [jsonForDocument, setJsonForDocument] = useState<Record<string, any> | null>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      const storedActiveTab = localStorage.getItem("activeTab");
      const storedProblemStatement = localStorage.getItem("problemStatement");
      const storedResponseData = localStorage.getItem("responseData");
      const storedProjectID = localStorage.getItem("projectID");

      if (storedActiveTab) setActiveTab(storedActiveTab);
      if (storedProblemStatement) setProblemStatement(storedProblemStatement);
      if (storedResponseData) setResponseData(storedResponseData);
      if (storedProjectID) setProjectID(storedProjectID);
    }
  }, [setProjectID]);

  useEffect(() => {
    if (!isClient) return;

    localStorage.setItem("activeTab", activeTab);
    localStorage.setItem("problemStatement", problemStatement);
    if (responseData) localStorage.setItem("responseData", responseData);
    else localStorage.removeItem("responseData");

    if (projectID) localStorage.setItem("projectID", projectID);
    else localStorage.removeItem("projectID");
  }, [activeTab, problemStatement, responseData, projectID, isClient]);

  const tabs = [
    { id: "01.a", label: "Identification of the use case", enabled: true },
    { id: "01.b", label: "Gather and Analyze Problem Details", enabled: !!questionnaireData },
    { id: "01.c", label: "Create a Problem Definition Document", enabled: !!jsonForDocument },
  ];

  return (
    <div className="bg-white h-full px-4 py-4 shadow-md rounded-[16px]">
       <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div>
        {activeTab === "01.a" && (
          <OneTabStepOne
            problemStatement={problemStatement}
            setProblemStatement={setProblemStatement}
            responseData={responseData}
            setResponseData={setResponseData}
            projectID={projectID}
            setProjectID={setProjectID}
            setQuestionnaireData={setQuestionnaireData}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "01.b" && questionnaireData && (
          <OneTabStepTwo
            projectID={projectID}
            problemStatement={problemStatement}
            projectDescription={responseData}
            questionnaireData={questionnaireData}
            setQuestionnaireData={setQuestionnaireData}
            jsonForDocument={jsonForDocument}
            setJsonForDocument={setJsonForDocument}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "01.c" && jsonForDocument && (
          <OneTabStepThree
            jsonForDocument={jsonForDocument}
            setJsonForDocument={setJsonForDocument}
            projectID={projectID}
            setSelectedTab={setSelectedTab}
          />
        )}
      </div>
    </div>
  );
};

export default ProgressOne;
