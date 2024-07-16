import React, { useState } from "react";
import { LuChevronRight } from "react-icons/lu";
import { useRouter } from "next/navigation";
import HistoryMobile from "../HistoryMobile";
import RecommendedQueriesMobile from "../RecommendedQueriesMobile";
import ConnectionsMobile from "../ConnectionsMobile";
import ChatComponentMobile from "../ChatComponentMobile";

// Utility functions
const getInitials = (name) => name.split(" ").map(word => word[0]).join("").toUpperCase();

function MoreMobile() {
  const userName = "Rakesh Mahendran";
  const navigate = useRouter();
  const [activeTab, setActiveTab] = useState("MainMore");

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate.push("/login");
  };

  const MenuOption = ({ label, onClick }) => (
    <div onClick={onClick} className="flex items-center justify-between gap-2 text-lg font-medium bg-gray-100 w-full p-4 cursor-pointer">
      <div>{label}</div>
      <LuChevronRight size={22} />
    </div>
  );

  const renderMainMore = () => (
    <div>
      <div className="flex flex-col gap-10 items-start mt-4 bg-gray-50 p-6 border border-gray-200 m-2 rounded-xl">
        <div className="flex items-center">
          <div className="bg-blue-400 text-white rounded-full h-10 w-10 flex items-center justify-center">
            {getInitials(userName)}
          </div>
          <div className="ml-2">{userName}</div>
        </div>
        <button className="bg-blue-400 text-white py-2 px-4 rounded" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="flex flex-col items-start border border-gray-100 m-2 rounded-xl text-sm">
        <MenuOption label="History" onClick={() => setActiveTab("History")} />
        <hr />
        <MenuOption label="Recommended Queries" onClick={() => setActiveTab("Recommendation")} />
        <hr />
        <MenuOption label="Connections" onClick={() => setActiveTab("Connections")} />
        <hr />
        <MenuOption label="Chat" onClick={() => setActiveTab("Chat")} />
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeTab) {
      case "MainMore": return renderMainMore();
      case "History": return <HistoryMobile />;
      case "Recommendation": return <RecommendedQueriesMobile />;
      case "Connections": return <ConnectionsMobile />;
      case "Chat": return <ChatComponentMobile />;
      default: return null;
    }
  };

  return <div>{renderContent()}</div>;
}

export default MoreMobile;
