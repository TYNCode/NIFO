import React, { useState, useEffect } from "react";
import OneTabStepOne from "./OneTabStepOne";
import OneTabStepTwo from "./OneTabStepTwo";
import OneTabStepThree from "./OneTabStepThree";

const ProgressOne: React.FC = () => {
  const [activeTab, setActiveTab] = useState("01.a");
  const [problemStatement, setProblemStatement] = useState("");
  const [responseData, setResponseData] = useState<string | null>(null);
  const [projectID, setProjectID] = useState<string | null>(null);
  const [questionnaireData, setQuestionnaireData] = useState(null)


  console.log("questionairreDataaa===>",questionnaireData)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveTab(localStorage.getItem("activeTab") || "01.a");
      setProblemStatement(localStorage.getItem("problemStatement") || "");
      const storedResponseData = localStorage.getItem("responseData");
      if (storedResponseData) setResponseData(storedResponseData);
      else setResponseData(null);

      const storedProjectID = localStorage.getItem("projectID");
      if (storedProjectID) setProjectID(storedProjectID);
      else setProjectID(null);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("activeTab", activeTab);
      localStorage.setItem("problemStatement", problemStatement);
      if (responseData) localStorage.setItem("responseData", responseData);
      else localStorage.removeItem("responseData");

      if (projectID) localStorage.setItem("projectID", projectID);
      else localStorage.removeItem("projectID");
    }
  }, [activeTab, problemStatement, responseData, projectID]);

  return (
    <div className="bg-white h-full px-4 py-4 shadow-[0px_8px_20px_0px_rgba(34,134,192,0.15)] rounded-[16px]">
      <div className="flex flex-row gap-4 justify-center items-center w-full shadow-sm">
        {[
          { id: "01.a", label: "Identification of the use case" },
          { id: "01.b", label: "Gather and Analyze Problem Details" },
          { id: "01.c", label: "Create a Problem Definition Document" },
        ].map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 text-center flex flex-row items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-t-lg cursor-pointer transition-all duration-200
                              ${
                                activeTab === tab.id
                                  ? "bg-[#F5FCFF] text-[#0071C1] font-semibold border-t-2 border-t-[#56A8F0]"
                                  : "bg-[#B5BBC20D] text-[#848484] border-t-2 border-t-[#B5BBC2]"
                              }`}
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
          />
        )}
        {activeTab === "01.b" && (
          <OneTabStepTwo
            projectID={projectID}
            projectDescription={responseData}
            questionnaireData = {questionnaireData}
            setQuestionnaireData={setQuestionnaireData}
          />
        )}
        {activeTab === "01.c" && <OneTabStepThree />}
      </div>
    </div>
  );
};

export default ProgressOne;
