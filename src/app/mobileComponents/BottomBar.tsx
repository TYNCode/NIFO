import React from "react";
import { useRouter } from "next/navigation"; 
import { FaRegLightbulb } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { IoMdMore } from "react-icons/io";
import { FaArrowTrendUp } from "react-icons/fa6";

const BottomBar = ({ setActiveTab, activeTab }) => {
  const router = useRouter(); 
  const handleTabClick = (tabName:string, route:string) => {
    console.log("hanndleCLic is pressed")
    setActiveTab(tabName);
    router.push(route); 
  };

  const getTabClass = (tabName) => 
    `flex flex-col items-center justify-center font-medium gap-2 cursor-pointer ${
      activeTab === tabName ? "text-blue-500 border-t-2 border-blue-400 py-2" : "text-gray-700"
    }`;

  return (
    <div>
      <div className="fixed bottom-0 w-full h-20 flex items-center justify-around bg-white z-50">
        {/* Spotlight */}
        <div
          className={getTabClass("Spotlight")}
          onClick={() => handleTabClick("Spotlight", "/")}
        >
          <div>
            <FaRegLightbulb size={24} />
          </div>
          <div className="text-xs">Spotlight</div>
        </div>

        {/* Search */}
        <div
          className={getTabClass("Search")}
          onClick={() => handleTabClick("Search", "/")}
        >
          <div>
            <IoSearch size={24} />
          </div>
          <div className="text-xs">Search</div>
        </div>

        {/* Trends */}
        <div
          className={getTabClass("Trends")}
          onClick={() => handleTabClick("Trends", "/")}
        >
          <div>
            <FaArrowTrendUp size={24} />
          </div>
          <div className="text-xs">Trends</div>
        </div>

        {/* More */}
        <div
          className={getTabClass("More")}
          onClick={() => handleTabClick("More", "/")}
        >
          <div>
            <IoMdMore size={23} />
          </div>
          <div className="text-xs">More</div>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
