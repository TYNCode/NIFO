import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

interface Tab {
  id: string;
  label: string;
  enabled: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => {
  const solutionProviderIDs = useAppSelector((state) => state.solutionProvider.solutionProviders)
  console.log("solutionProviderIDs", solutionProviderIDs)
  return (
    <div className="flex flex-row gap-1 justify-center items-center w-full shadow-sm">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => tab.enabled && setActiveTab(tab.id)}
          className={`flex-1 text-center flex flex-row items-center justify-center gap-2 text-sm font-medium px-4 rounded-t-lg cursor-pointer transition-all duration-200
            ${activeTab === tab.id ? "bg-[#F5FCFF] text-[#0071C1] font-semibold border-t-2 border-t-[#56A8F0] py-3" : "bg-[#B5BBC20D] text-[#848484] border-t-2 border-t-[#B5BBC2] py-2"}
            ${!tab.enabled ? "opacity-50 cursor-not-allowed bg-gray-200 text-gray-500 border-t-2 border-gray-300" : ""}`}
        >
          <div>{tab.label}</div>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
