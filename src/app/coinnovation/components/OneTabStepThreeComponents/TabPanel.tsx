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
    <div className="flex flex-col justify-center items-center bg-[#F4FCFF] px-2 sm:px-4 pb-4 rounded-[8px]">
      {/* Mobile Dropdown for Tabs */}
      <div className="block sm:hidden w-full mb-4">
        <select
          value={activeTab}
          onChange={(e) => {
            if (isEditing) {
              toast.info("Please save your changes before switching tabs.");
              return;
            }
            setActiveTab(e.target.value);
          }}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-[#2286C0] focus:outline-none focus:ring-2 focus:ring-[#2286C0] focus:border-transparent"
        >
          {tabs.map((tab) => (
            <option key={tab} value={tab}>
              {tab}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden sm:flex border-b w-full border-gray-300 justify-center items-center overflow-x-auto">
        <div className="flex min-w-max">
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
              className={`px-2 md:px-4 pb-3 pt-4 font-semibold text-xs md:text-sm transition duration-200 flex justify-center items-center whitespace-nowrap
                ${activeTab === tab ? "border-b-2 border-[#2286C0] text-[#2286C0]" : "text-[#A1AEBE]"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="text-[#4A4D4E] text-[14px] leading-tight px-2 sm:px-4 mt-4 py-4 bg-white rounded-[8px] w-full">
        {children}
      </div>
    </div>
  );
};

export default TabPanel;