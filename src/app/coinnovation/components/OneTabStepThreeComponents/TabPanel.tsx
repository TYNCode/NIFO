// src/components/TabPanel.tsx
import React, { ReactNode } from 'react';
import { toast } from 'react-toastify';

interface TabPanelProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isEditing: boolean;
  children: ReactNode;
}

const TabPanel: React.FC<TabPanelProps> = ({ 
  tabs, 
  activeTab, 
  setActiveTab, 
  isEditing, 
  children 
}) => {
  return (
    <div className="flex flex-col justify-center items-center bg-[#F4FCFF] px-4 pb-4 rounded-[8px]">
      <div className="flex border-b w-full border-gray-300 justify-center items-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              if (isEditing) {
                toast.info("Please save your changes before switching tabs.");
                return;
              }
              setActiveTab(tab);
            }}
            className={`px-4 pb-3 pt-4 font-semibold text-sm transition duration-200 flex justify-center items-center
              ${activeTab === tab ? "border-b-2 border-[#2286C0] text-[#2286C0]" : "text-[#A1AEBE]"}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="text-[#4A4D4E] text-[14px] leading-tight px-4 mt-4 py-4 bg-white rounded-[8px] w-full">
        {children}
      </div>
    </div>
  );
};

export default TabPanel;