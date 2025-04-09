"use client";

import React, { useEffect, useState } from "react";
import OneTabStepOne from "./OneTabStepOne";
import OneTabStepTwo from "./OneTabStepTwo";
import OneTabStepThree from "./OneTabStepThree";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setProjectID } from "../../redux/features/coinnovation/projectSlice";
import { setActiveDefineStepTab } from "../../redux/features/coinnovation/challengeSlice";

type DefineStepTab = "01.a" | "01.b" | "01.c";

const ProgressOne: React.FC = () => {
  const dispatch = useAppDispatch();

  const projectID = useAppSelector((state) => state.projects.projectID);
  const questionnaireData = useAppSelector(
    (state) => state.challenge.questionnaireData
  );
  const jsonForDocument = useAppSelector(
    (state) => state.challenge.jsonForDocument
  );
  const activeTab = useAppSelector(
    (state) => (state.challenge.activeDefineStepTab || "01.a") as DefineStepTab
  );

  console.log("activeTab in activeDefineStepTasb", activeTab)

  const [initialLoading, setInitialLoading] = useState(true);

  // Restore from localStorage on mount
  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab") as DefineStepTab | null;
    const storedProjectID = localStorage.getItem("projectID");

    if (storedProjectID) {
      dispatch(setProjectID(storedProjectID));
    }
    if (storedTab) {
      dispatch(setActiveDefineStepTab(storedTab));
    }

    setInitialLoading(false);
  }, [dispatch]);

  // Save to localStorage when things change
  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem("activeTab", activeTab);
    if (projectID) {
      localStorage.setItem("projectID", projectID);
    } else {
      localStorage.removeItem("projectID");
    }
  }, [activeTab, projectID]);

  // Auto scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

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

  const shouldWaitForData =
    initialLoading ||
    (activeTab === "01.b" && !questionnaireData) ||
    (activeTab === "01.c" && !jsonForDocument);

  console.log("shouldWaitForData",shouldWaitForData)
  console.log("initalLoading", initialLoading)
  
  if (shouldWaitForData) {
    return (
      <div className="flex justify-center items-center py-12 text-gray-500">
        Loading step data...
      </div>
    );
  }

  return (
    <div className="bg-white h-full px-4 py-4 shadow-md rounded-[16px]">
      {/* Tabs Navigation */}
      <div className="flex flex-row gap-1 justify-center items-center w-full shadow-sm">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() =>
              tab.enabled &&
              dispatch(setActiveDefineStepTab(tab.id as DefineStepTab))
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

      {/* Tab Content */}
      <div>
        {activeTab === "01.a" && <OneTabStepOne />}
        {activeTab === "01.b" && <OneTabStepTwo />}
        {activeTab === "01.c" && <OneTabStepThree />}
      </div>
    </div>
  );
};

export default ProgressOne;
