"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../../redux/hooks";
import useUserInfo from "../../redux/features/customHooks/userHook";
import LeftFrame from "../../components/LeftFrame/LeftFrame";
import StartupDashboard from "../../components/StartupDashboard/StartupDashboard";
import { checkAuthAndRole } from "../../utils/roleBasedRouting";

const StartupDashboardPage: React.FC = () => {
  const router = useRouter();
  const userInfo = useUserInfo();
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in and has startup role
    const user = checkAuthAndRole("startup");
    if (!user) {
      return; // checkAuthAndRole handles the redirect
    }

    // Handle mobile responsiveness
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleCloseMobile = () => {
    setIsMobileOpen(false);
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Frame */}
      <LeftFrame
        mode="startup"
        isMobile={isMobile}
        isMobileOpen={isMobileOpen}
        onCloseMobile={handleCloseMobile}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <button
              onClick={handleMobileToggle}
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            <div className="w-6"></div>
          </div>
        )}

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto">
          <StartupDashboard />
        </div>
      </div>
    </div>
  );
};

export default StartupDashboardPage; 