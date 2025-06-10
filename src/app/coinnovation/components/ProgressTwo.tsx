"use client";

import React from "react";
import TwoTabStepOne from "./TwoTabStepComponents/TwoTabStepOne";
import TwoTabStepTwo from "./TwoTabStepComponents/TwoTabStepTwo";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setActiveTabSource } from "../../redux/features/source/solutionProviderSlice";

type SourceStepTab = "02.a" | "02.b";

const ProgressTwo: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.solutionProvider.activeTabSource);
  const solutionProviders = useAppSelector((state) => state.solutionProvider.solutionProviders);

  const tabs = [
    {
      id: "02.a",
      label: "Shortlisting of Solution Providers",
      shortLabel: "Shortlist",
      enabled: true,
    },
    {
      id: "02.b",
      label: "Solution Providers Comparison",
      shortLabel: "Compare",
      enabled: solutionProviders.length > 0,
    },
  ];

  return (
    <div className="h-full flex flex-col shadow-md rounded-[16px] mx-auto w-11/12 lg:w-11/12 overflow-hidden">
      {/* Tabs Navigation - Responsive Design */}
      <div className="flex-shrink-0 border-b border-gray-100">
        {/* Desktop Tabs */}
        <div className="hidden sm:flex flex-row gap-1 justify-center items-center shadow-sm">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => tab.enabled && dispatch(setActiveTabSource(tab.id as SourceStepTab))}
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
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => tab.enabled && dispatch(setActiveTabSource(tab.id as SourceStepTab))}
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
                  minWidth: 'fit-content',
                }}
              >
                <span className="font-semibold">{tab.id}</span>
                <span>{tab.shortLabel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        <div className="h-full overflow-y-auto w-full scrollbar-hide">
          {activeTab === "02.a" && <TwoTabStepOne />}
          {activeTab === "02.b" && <TwoTabStepTwo />}
        </div>
      </div>

      {/* Hide Scrollbar */}
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

export default ProgressTwo;
