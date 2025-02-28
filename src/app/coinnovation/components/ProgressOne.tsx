import React, { useState, useEffect } from "react";
import OneTabStepOne from "./OneTabStepOne";
import OneTabStepTwo from "./OneTabStepTwo";
import OneTabStepThree from "./OneTabStepThree";

const ProgressOne: React.FC = () => {
  const [activeTab, setActiveTab] = useState("01.a");
  const [problemStatement, setProblemStatement] = useState("");
  const [responseData, setResponseData] = useState<string | null>(null);
  const [projectID, setProjectID] = useState<string | null>(null);
  const [questionnaireData, setQuestionnaireData] = useState(null);
  const [jsonForDocument, setJsonForDocument] = useState({})

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveTab(localStorage.getItem("activeTab") || "01.a");
      setProblemStatement(localStorage.getItem("problemStatement") || "");
      setResponseData(localStorage.getItem("responseData") || null);
      setProjectID(localStorage.getItem("projectID") || null);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeTab", activeTab);
      localStorage.setItem("problemStatement", problemStatement);
      responseData
        ? localStorage.setItem("responseData", responseData)
        : localStorage.removeItem("responseData");

      projectID
        ? localStorage.setItem("projectID", projectID)
        : localStorage.removeItem("projectID");
    }
  }, [activeTab, problemStatement, responseData, projectID]);


  // const isTab2Enabled = !!activeTab; 
  // const isTab3Enabled = !!questionnaireData; 

  return (
    <div className="bg-white h-full px-4 py-4 shadow-md rounded-[16px]">
      <div className="flex flex-row gap-1 justify-center items-center w-full shadow-sm">
        {[
          { id: "01.a", label: "Identification of the use case", enabled: true },
          { id: "01.b", label: "Gather and Analyze Problem Details", enabled: true },
          { id: "01.c", label: "Create a Problem Definition Document", enabled: true },
        ].map((tab) => (
          <div
            key={tab.id}
            onClick={() => tab.enabled && setActiveTab(tab.id)}
            className={`flex-1 text-center flex flex-row items-center justify-center gap-2 text-sm font-medium px-4  rounded-t-lg cursor-pointer transition-all duration-200
    ${activeTab === tab.id ? "bg-[#F5FCFF] text-[#0071C1] font-semibold border-t-2 border-t-[#56A8F0] py-3" : "bg-[#B5BBC20D] text-[#848484] border-t-2 border-t-[#B5BBC2] py-2"}
    ${!tab.enabled ? "opacity-50 cursor-not-allowed bg-gray-200 text-gray-500 border-t-2 border-gray-300" : ""}
  `}
          >
            <div>{tab.id}</div>
            <div>{tab.label}</div>
          </div>

        ))}
      </div>

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
        {activeTab === "01.b" && (
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
        {activeTab === "01.c" &&
          <OneTabStepThree
            jsonForDocument={jsonForDocument}
            setJsonForDocument={setJsonForDocument} />}
      </div>
    </div>
  );
};

export default ProgressOne;
