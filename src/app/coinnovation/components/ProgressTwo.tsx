import React from "react";
import Tabs from "./Tabs";
import TwoTabStepOne from "./TwoTabStepComponents/TwoTabStepOne";
import TwoTabStepTwo from "./TwoTabStepComponents/TwoTabStepTwo";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setActiveTabSource } from "../../redux/features/source/solutionProviderSlice";

interface Tab {
  id: string;
  label: string;
  enabled: boolean;
}

const ProgressTwo: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeTabSource = useAppSelector((state) => state.solutionProvider.activeTabSource);
  const solutionProviders = useAppSelector((state) => state.solutionProvider.solutionProviders);
  const tabs: Tab[] = [
    { id: "02.a", label: "Shortlisting of Solution Providers", enabled: true },
    {
      id: "02.b",
      label: "Solution Providers Comparison",
      enabled: solutionProviders.length > 0,
    },
  ];

  const handleTabChange = (tabId: string) => {
    dispatch(setActiveTabSource(tabId));
  };

  return (
    <div className="h-full px-4 py-4 shadow-md rounded-[16px]">
      <Tabs tabs={tabs} activeTab={activeTabSource} setActiveTab={handleTabChange} />

      <div>
        {activeTabSource === "02.a" && <TwoTabStepOne />}
        {activeTabSource === "02.b" && <TwoTabStepTwo />}
      </div>
    </div>
  );
};

export default ProgressTwo;
