"use client";
import React, { Suspense, useState } from "react";
import LeftFrame from "../components/LeftFrame/LeftFrame";
import TrendsWeb from "../components/TrendsWeb/TrendsWeb";
import NavbarTrend from "../components/TrendsWeb/NavbarTrend";
import WithAuth from "../utils/withAuth";

const PageContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Spotlight");

  return (
    <main className="flex w-full min-h-screen bg-gray-50">
      {/* <div className="hidden lg:block lg:fixed lg:w-1/5 h-full">
        <LeftFrame />
      </div> */}
      <div className="flex flex-col flex-1">
        <NavbarTrend />
        <TrendsWeb />
      </div>
    </main>
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
