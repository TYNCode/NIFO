"use client";
import React, { Suspense, useState } from "react";
import Trends from "../components/Trends/Trends";
import BottomBar from "../mobileComponents/BottomBar";
import MobileHeader from "../mobileComponents/MobileHeader";
import TrendsWeb from "../components/TrendsWeb/TrendsWeb";

const PageContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Spotlight");

  return (
    <>
      <div className="flex flex-col sm:hidden">
        <MobileHeader />
        <Trends />
        <BottomBar setActiveTab={setActiveTab} activeTab={activeTab} />
      </div>
      <div className="hidden sm:flex flex-col h-screen relative overflow-hidden select-none">
        <div className="flex-1">
          <TrendsWeb/>
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

export default Page;
