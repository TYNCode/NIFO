"use client";

import React, { useState } from "react";
import ProgressOne from "./components/ProgressOne";
import ProgressTwo from "./components/ProgressTwo";
import ProgressFour from "./components/EvaluateComponents/ProgressFour";
import Sidebar from "./components/Sidebar/Sidebar";
import MobileHeader from "../mobileComponents/MobileHeader";
import WithAuth from "../utils/withAuth";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setSelectedTab } from "../redux/features/coinnovation/projectSlice";

interface ProcessStep {
  id: number;
  title: string;
}

const coInnovationProcessSteps: ProcessStep[] = [
  { id: 1, title: "Define" },
  { id: 2, title: "Source" },
  { id: 3, title: "Engage" },
  { id: 4, title: "Evaluate" },
  { id: 5, title: "Finalize" },
];

const Page: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const selectedTab = useAppSelector((state) => state.projects.selectedTab);
  const enabledSteps = useAppSelector((state) => state.projects.enabledSteps);

  const handleMobileMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const tabContent: Record<number, JSX.Element> = {
    1: <ProgressOne />,
    2: <ProgressTwo />,
    3: <div>Step 3</div>,
    4: <ProgressFour />,
    5: <div>Step 5</div>,
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block w-[3.7rem]">
        <Sidebar />
      </div>

      {/* Sidebar for Mobile */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-30 md:hidden"
          onClick={handleMobileMenuToggle}
        >
          <div
            className="bg-white w-64 h-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar isMobile isOpen onToggle={handleMobileMenuToggle} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Mobile Header */}
        <div className="md:hidden flex-shrink-0">
          <MobileHeader onMenuToggle={handleMobileMenuToggle} showMenuButton />
        </div>

        {/* Content Area */}
        <div className=" w-full flex-1 overflow-y-auto">
          <div className="md:px-6 py-4 h-full">
            {/* Desktop Process Steps */}
            <div className="hidden sm:flex gap-8 justify-between mb-8 md:mx-20">
              {coInnovationProcessSteps.map((process) => {
                const isEnabled = enabledSteps.includes(process.id);
                const isSelected = selectedTab === process.id;

                return (
                  <div
                    key={process.id}
                    className={`relative flex flex-col w-[18%] h-full px-4 pb-4 rounded-2xl transition-all
                      ${isSelected ? "bg-[#0071C1] text-white" : "bg-white text-[#0071C1]"}
                      ${isEnabled ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
                      shadow`}
                    onClick={() => {
                      if (isEnabled) {
                        dispatch(setSelectedTab(process.id));
                      }
                    }}
                  >
                    <div className="h-12 text-[16px] flex items-center gap-2">
                      <div className="font-semibold text-[15px]">
                        0{process.id}
                      </div>
                      <div className="font-semibold text-sm truncate">
                        {process.title}
                      </div>
                    </div>
                    <div
                      className={`w-full rounded-md ${isSelected ? "h-[4px] bg-[#F7F701]" : "h-[2px] bg-[#E7E7E7]"}`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Mobile Horizontal Step Cards - Fixed Scrollable Carousel */}
            <div className="sm:hidden mb-6 px-4 w-full overflow-x-scroll">
              <div className="flex gap-3 scrollbar-styled">
                {coInnovationProcessSteps.map((process, index) => {
                  const isEnabled = enabledSteps.includes(process.id);
                  const isSelected = selectedTab === process.id;

                  return (
                    <div
                      key={process.id}
                      onClick={() => {
                        if (isEnabled) {
                          dispatch(setSelectedTab(process.id));
                        }
                      }}
                      className={`flex-shrink-0 w-[140px] px-3 py-3 rounded-xl transition-all shadow flex flex-col justify-between
            ${isSelected ? "bg-[#0071C1] text-white" : "bg-white text-[#0071C1]"}
            ${isEnabled ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                    >
                      <div className="flex items-center gap-2 font-semibold text-xs mb-2">
                        <span>0{process.id}</span>
                        <span className="truncate">{process.title}</span>
                      </div>
                      <div
                        className={`mt-2 w-full rounded-md ${
                          isSelected
                            ? "h-[4px] bg-[#F7F701]"
                            : "h-[2px] bg-[#E7E7E7]"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Content - Fixed Height for Mobile */}
            <div className="flex-1 min-h-0">
              <div className="h-full w-screen">
                {tabContent[selectedTab] || (
                  <div>Select a step to continue.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithAuth(Page);
