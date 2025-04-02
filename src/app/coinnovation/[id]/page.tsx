"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBarCoin from "../components/NavBar/NavBarCoin";
import Sidebar from "../components/Sidebar/Sidebar";
import ProgressOne from "../components/ProgressOne";
import WithAuth from "../../utils/withAuth";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchProjectDetails, setProjectID, setSelectedTab } from "../../redux/features/coinnovation/projectSlice";

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

const ProjectSummaryPage = ({ params }: { params: { id: string } }) => {
  const dispatch = useAppDispatch();
  const { projectID, selectedTab, projectDetails, fetching, error } =
    useAppSelector((state) => state.projects);

  useEffect(() => {
    const storedProjectID = localStorage.getItem("projectID");
    if (params.id) {
      dispatch(setProjectID(params.id));
      // localStorage.setItem("projectID", params.id);
    } else if (storedProjectID) {
      dispatch(setProjectID(storedProjectID));
    }
  }, [params.id, dispatch]);

  useEffect(() => {
    if (projectID) {
      dispatch(fetchProjectDetails(projectID));
    }
  }, [projectID, dispatch]);

  if (fetching) return <p>Loading project details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const tabContent: Record<number, JSX.Element> = {
    1: <ProgressOne />,
    2: <div>Step 2</div>,
    3: <div>Step 3</div>,
    4: <div className="p-4 bg-gray-100">Step 4</div>,
    5: <div className="p-4 bg-gray-100">Step 5</div>,
  };

  return (
    <div className="grid grid-cols-[3.7rem_1fr] h-screen">
      <div>
        <Sidebar />
      </div>
      <div className="flex flex-col relative">
        <NavBarCoin />
        <div className="bg-[#F4FCFF] mt-16 px-4">
          <div className="text-[#0071C1] mt-10 mb-5 text-xl uppercase font-bold">
            Create Project
          </div>

          <div className="flex gap-3 mx-2 justify-between">
            {coInnovationProcessSteps.map((process) => (
              <div
                key={process.id}
                className={`relative flex flex-col w-1/5 h-full px-4 pb-4 rounded-2xl cursor-pointer transition-all ${
                  selectedTab === process.id
                    ? "bg-[#0071C1] text-white shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
                    : "bg-white text-[#0071C1] shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]"
                }`}
                onClick={() => dispatch(setSelectedTab(process.id))}
              >
                <div className="h-12 text-[16px] flex items-center w-full">
                  <div className="font-semibold text-[15px] w-1/4 text-left">
                    0{process.id}
                  </div>
                  <div className="font-semibold text-center w-2/4">
                    {process.title}
                  </div>
                </div>

                <div
                  className={`w-full rounded-md h-[4px] ${
                    selectedTab === process.id
                      ? "bg-[#F7F701]"
                      : "h-[2px] bg-[#E7E7E7]"
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
  );
};

export default WithAuth(ProjectSummaryPage);
