import React, { useState } from "react";
import Tabs from "./Tabs";
import TwoTabStepOne from "./TwoTabStepComponents/TwoTabStepOne";
import TwoTabStepTwo from "./TwoTabStepComponents/TwoTabStepTwo";

interface Tab {
  id: string;
  label: string;
  enabled: boolean;
}

const ProgressTwo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("02.b");

  const tabs: Tab[] = [
    { id: "02.a", label: "Shortlisting of Solution Providers", enabled: true },
    { id: "02.b", label: "Solution Providers Comparison", enabled: false },
  ];

  return (
    <div className=" h-full px-4 py-4 shadow-md rounded-[16px]">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div>
        {activeTab === "02.a" && (
          <div>
            <TwoTabStepOne />
          </div>
        )}
        {activeTab === "02.b" && (
          <div>
            <TwoTabStepTwo />
          </div>
        )}
        {activeTab === "02.c" && <div>{/* <TwoTabStepThree /> */}</div>}
      </div>
    </div>
  );
};

export default ProgressTwo;
