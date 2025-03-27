"use client";
import React, { Suspense, useState } from "react";
import BottomBar from "../mobileComponents/BottomBar";
import MobileHeader from "../mobileComponents/MobileHeader";
import TrendsWeb from "../components/TrendsWeb/TrendsWeb";
import Navbar from "../components/Navbar";
import NavbarTrend from "../components/TrendsWeb/NavbarTrend";
import WithAuth from "../utils/withAuth";

const PageContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Spotlight");

  return (
    <>
      {/* <div className="flex flex-col sm:hidden">
        <MobileHeader />
        <Trends />
        <BottomBar setActiveTab={setActiveTab} activeTab={activeTab} />
      </div> */}
      <div className="hidden sm:flex flex-col h-screen relative overflow-hidden select-none">
        <div className="">
          <NavbarTrend />
          <TrendsWeb />
        </div>
      </div>
    </>
  );
};

const Page: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
};

export default WithAuth(Page);
