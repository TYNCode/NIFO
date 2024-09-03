"use client";
import React, { Suspense, useState } from "react";
import Trends from "../components/Trends/Trends";
import BottomBar from "../mobileComponents/BottomBar";
import MobileHeader from "../mobileComponents/MobileHeader";

const PageContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Spotlight");

  return (
    <div>
      <MobileHeader />
      <Trends />
      <BottomBar setActiveTab={setActiveTab} activeTab={activeTab} />
    </div>
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
