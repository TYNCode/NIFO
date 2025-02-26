"use client";

import React, { useState } from "react";
import NavbarTrend from "../components/TrendsWeb/NavbarTrend";
import ProgressOne from "./components/ProgressOne";
import NavBarCoin from "./components/NavBar/NavBarCoin";
import Sidebar from "./components/Sidebar/Sidebar";

interface ProcessStep {
  id: number;
  title: string;
}

const coInnovationProcessSteps: ProcessStep[] = [
  { id: 1, title: "Identify and Define Problem" },
  { id: 2, title: "Preliminary Sourcing and Curation" },
  { id: 3, title: "Engagement with Solution Providers" },
  { id: 4, title: "Solution Evaluation" },
  { id: 5, title: "Customization and Finalization of the solution" },
];

const tabContent: Record<number, JSX.Element> = {
  1: <ProgressOne />,
  2: <ProgressOne />,
  3: <ProgressOne />,
  4: <div className="p-4 bg-gray-100">✅ Step 4: Solution Evaluation</div>,
  5: (
    <div className="p-4 bg-gray-100">
      🎯 Step 5: Customization and Finalization
    </div>
  ),
};

const Page: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(1);

  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="flex flex-col">
          <NavBarCoin />
          <div className="bg-[#F4FCFF]">
            <div className="text-[#0071C1] mt-10 mb-5  text-xl uppercase font-bold">
              Create Project
            </div>

            <div className="flex gap-2 mx-2">
              {coInnovationProcessSteps.map((process) => (
                <div
                  key={process.id}
                  className={`relative flex items-center justify-center flex-col w-1/5 h-24
                px-4 py-2 rounded-2xl cursor-pointer transition-all
                ${
                  selectedTab === process.id
                    ? "bg-[#0071C1] text-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
                    : "bg-white text-[#0071C1] shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
                }`}
                  onClick={() => setSelectedTab(process.id)}
                >
                  <div className="h-24 text-[14px] flex items-start gap-2">
                    <div className="text-left font-bold">0{process.id}</div>
                    <div className="font-semibold text-center">
                      {process.title}
                    </div>
                  </div>

                  <div
                    className={`w-[90%] rounded-md h-2 ${
                      selectedTab === process.id
                        ? "bg-[#F7F701]"
                        : "h-[6px] bg-[#E7E7E7]"
                    }`}
                  ></div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              {tabContent[selectedTab] || <div>Select a step to continue.</div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
