"use client";

import NavBarCoin from "../coinnovation/components/NavBar/NavBarCoin";
import Sidebar from "../coinnovation/components/Sidebar/Sidebar";
import WithAuth from "../utils/withAuth";
import ProjectLists from "./ProjectLists";

const SummaryCoinnovation = () => {
  return (
    <>
      <div className="grid grid-cols-[3.7rem_1fr] h-screen">
        <div>
          <Sidebar />
        </div>
        <div className="flex flex-col relative">
          <NavBarCoin />
          <div className="container mx-auto p-4 mt-16 bg-[#F5FCFF]">
            <ProjectLists />
          </div>
        </div>
      </div>
    </>
  );
};

export default WithAuth(SummaryCoinnovation);
