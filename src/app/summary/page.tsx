"use client";
import { useState } from "react";
import Sidebar from "../coinnovation/components/Sidebar/Sidebar";
import MobileHeader from "../mobileComponents/MobileHeader";
import WithAuth from "../utils/withAuth";
import ProjectLists from "./ProjectLists";

const SummaryCoinnovation = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar for desktop */}
      <aside className="hidden sm:block w-[3.7rem] bg-white border-r shadow-md">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <div className="sm:hidden">
        <Sidebar 
          isOpen={isMobileSidebarOpen}
          onToggle={handleMobileMenuToggle}
          isMobile={true}
        />
      </div>

      {/* Main content for both desktop and mobile */}
      <main className="flex-1 flex flex-col bg-white">
        {/* Mobile Header */}
        <div className="sm:hidden block">
          <MobileHeader 
            onMenuToggle={handleMobileMenuToggle}
            showMenuButton={true}
          />
        </div>

        {/* Actual Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <ProjectLists />
        </div>
      </main>
    </div>
  );
};

export default WithAuth(SummaryCoinnovation);