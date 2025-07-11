"use client";

import React, { useEffect, useState } from "react";
import OneTabStepOne from "./OneTabStepOne";
import OneTabStepTwo from "./OneTabStepTwo";
import OneTabStepThree from "./OneTabStepThree";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setProjectID } from "../../redux/features/coinnovation/projectSlice";
import { setActiveDefineStepTab } from "../../redux/features/coinnovation/challengeSlice";
import axios from "axios";

type DefineStepTab = "01.a" | "01.b" | "01.c";

const ProgressOne: React.FC = () => {
  const dispatch = useAppDispatch();

  const projectID = useAppSelector((state) => state.projects.projectID);
  const questionnaireData = useAppSelector((state) => state.challenge.questionnaireData);
  const jsonForDocument = useAppSelector((state) => state.challenge.jsonForDocument);
  const activeTab = useAppSelector((state) =>
    (state.challenge.activeDefineStepTab || "01.a") as DefineStepTab
  );
  const projectDetails = useAppSelector((state) => state.projects.projectDetails);

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined") return;
    
    const storedTab = localStorage.getItem("activeTab") as DefineStepTab | null;
    const storedProjectID = localStorage.getItem("projectID");

    if (storedProjectID) {
      dispatch(setProjectID(storedProjectID));
    }
    if (storedTab) {
      dispatch(setActiveDefineStepTab(storedTab));
    } else if (projectDetails?.last_active_define_step_tab) {
      dispatch(setActiveDefineStepTab(projectDetails.last_active_define_step_tab as DefineStepTab));
    }

    setInitialLoading(false);
  }, [dispatch, projectDetails?.last_active_define_step_tab]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem("activeTab", activeTab);
    if (projectID) {
      localStorage.setItem("projectID", projectID);
    } else {
      localStorage.removeItem("projectID");
    }
  }, [activeTab, projectID]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const handleTabChange = (tabId: DefineStepTab) => {
    dispatch(setActiveDefineStepTab(tabId));
    // Save to backend
    if (projectID) {
      axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/coinnovation/create-project/`,
        {
          project_id: projectID,
          last_active_define_step_tab: tabId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtAccessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
    }
  };

  const tabs = [
    {
      id: "01.a",
      label: "Identification of the use case",
      shortLabel: "Identify",
      enabled: true,
    },
    {
      id: "01.b",
      label: "Gather and Analyze Problem Details",
      shortLabel: "Gather",
      enabled: !!questionnaireData,
    },
    {
      id: "01.c",
      label: "Create a Problem Definition Document",
      shortLabel: "Create",
      enabled: !!jsonForDocument,
    },
  ];

  const shouldWaitForData =
    initialLoading ||
    (activeTab === "01.b" && !questionnaireData) ||
    (activeTab === "01.c" && !jsonForDocument);

  if (shouldWaitForData) {
    return (
      <div className="flex justify-center items-center py-12 text-gray-500 h-full">
        Loading step data...
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col shadow-md rounded-[16px] mx-auto w-11/12 lg:w-11/12  overflow-hidden">
      {/* Tabs Navigation - Responsive Design */}
      <div className="flex-shrink-0 border-b border-gray-100">
        {/* Desktop Tabs */}
        <div className="hidden sm:flex flex-row gap-1 justify-center items-center shadow-sm">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() =>
                tab.enabled && handleTabChange(tab.id as DefineStepTab)
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
              <div className="truncate">{tab.label}</div>
            </div>
          ))}
        </div>

        {/* Mobile Tabs - Horizontal Scroll */}
        <div className="sm:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 px-4 py-2 min-w-max">
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                onClick={() =>
                  tab.enabled && handleTabChange(tab.id as DefineStepTab)
                }
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? "bg-[#0071C1] text-white"
                      : "bg-gray-100 text-[#848484]"
                  }
                  ${
                    !tab.enabled
                      ? "opacity-50 cursor-not-allowed bg-gray-200 text-gray-500"
                      : ""
                  }`}
                style={{
                  minWidth: 'fit-content'
                }}
              >
                <span className="font-semibold">{tab.id}</span>
                <span>{tab.shortLabel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content - Flexible Height */}
      <div className="flex-1">
        <div className="h-full overflow-y-auto w-full scrollbar-hide">
          <div className="">
            {activeTab === "01.a" && <OneTabStepOne />}
            {activeTab === "01.b" && <OneTabStepTwo />}
            {activeTab === "01.c" && <OneTabStepThree />}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ProgressOne;