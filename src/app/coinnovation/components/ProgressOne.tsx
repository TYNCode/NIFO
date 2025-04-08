"use client";

import React, { useEffect } from "react";
import OneTabStepOne from "./OneTabStepOne";
import OneTabStepTwo from "./OneTabStepTwo";
import OneTabStepThree from "./OneTabStepThree";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setProjectID } from "../../redux/features/coinnovation/projectSlice";
import { setActiveDefineStepTab } from "../../redux/features/coinnovation/challengeSlice";

const ProgressOne: React.FC = () => {
  const dispatch = useAppDispatch();
  const projectID = useAppSelector((state) => state.projects.projectID);
  const questionnaireData = useAppSelector(
    (state) => state.challenge?.questionnaireData
  );
  const jsonForDocument = useAppSelector(
    (state) => state.challenge?.jsonForDocument
  );
  const activeTab = useAppSelector(
    (state) => state.challenge?.activeDefineStepTab || "01.a"
  );
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTab = localStorage.getItem("activeTab");
      const storedProjectID = localStorage.getItem("projectID");
      if (storedTab) dispatch(setActiveDefineStepTab(storedTab));
      if (storedProjectID) dispatch(setProjectID(storedProjectID));
    }
  }, [dispatch]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("activeTab", activeTab);
    if (projectID) {
      localStorage.setItem("projectID", projectID);
    } else {
      localStorage.removeItem("projectID");
    }
  }, [activeTab, projectID]);

  const tabs = [
    { id: "01.a", label: "Identification of the use case", enabled: true },
    {
      id: "01.b",
      label: "Gather and Analyze Problem Details",
      enabled: !!questionnaireData,
    },
    {
      id: "01.c",
      label: "Create a Problem Definition Document",
      enabled: !!jsonForDocument,
    },
  ];

  return (
    <div className="bg-white h-full px-4 py-4 shadow-md rounded-[16px]">
      {/* Tabs Navigation */}
      <div className="flex flex-row gap-1 justify-center items-center w-full shadow-sm">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() =>
              tab.enabled && dispatch(setActiveDefineStepTab(tab.id))
            }
            className={`flex-1 text-center flex flex-row items-center justify-center gap-2 text-sm font-medium px-4 rounded-t-lg cursor-pointer transition-all duration-200
              ${
                activeTab === tab.id
                  ? "bg-[#F5FCFF] text-[#0071C1] font-semibold border-t-2 border-t-[#56A8F0] py-3"
                  : "bg-[#B5BBC20D] text-[#848484] border-t-2 border-t-[#B5BBC2] py-2"
              }
              ${
                !tab.enabled
                  ? "opacity-50 cursor-not-allowed bg-gray-200 text-gray-500 border-t-2 border-gray-300"
                  : ""
              }`}
          >
            <div>{tab.id}</div>
            <div>{tab.label}</div>
          </div>
        ))}
      </div>

      <div>
        {activeTab === "01.a" && <OneTabStepOne />}

        {activeTab === "01.b" && questionnaireData && <OneTabStepTwo />}

        {activeTab === "01.c" && jsonForDocument && <OneTabStepThree />}
      </div>
    </div>
  );
};

export default ProgressOne;
