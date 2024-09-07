import React, { useState } from "react";
import { LuChevronRight } from "react-icons/lu";
import { useRouter } from "next/navigation";
import RecommendedQueriesMobile from "../RecommendedQueriesMobile";
import ConnectionsMobile from "../ConnectionsMobile";
import { getUserInfo } from "../../utils/localStorageUtils";
import { encryptURL } from "../../utils/shareUtils";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6";

const getInitials = (name) =>
  name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

function MoreMobile({ userInfo }) {
  const userName = userInfo?.first_name;
  const navigate = useRouter();
  const [activeTab, setActiveTab] = useState("MainMore");
  const [isConnectionsOpen, setIsConnectionsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate.push("/login");
  };

  const user = getUserInfo();

  const handleCompanyProfile = () => {
    if (user) {
      let userOrganization = user.organization.toString();
      const encryptedUserOrganization = encryptURL(userOrganization);
      navigate.push(`/companyprofile/${encryptedUserOrganization}`);
    }
  };

  const MenuOption = ({ label, onClick }) => (
    <div
      onClick={onClick}
      className="flex items-center justify-between gap-2 text-lg font-medium bg-gray-100 w-full p-4 cursor-pointer"
    >
      <div>{label}</div>
      <LuChevronRight size={22} />
    </div>
  );

  const renderMainMore = () => (
    <div className="mb-20">
      <div className="flex flex-col gap-10 items-start mt-20 bg-gray-50 p-6 border border-gray-200 m-2 rounded-xl">
        <div className="flex items-center">
          <div className="bg-blue-400 text-white rounded-full h-10 w-10 flex items-center justify-center">
            {getInitials(userName)}
          </div>
          <div className="ml-2">{userName}</div>
        </div>
        <div className="flex flex-col gap-10 w-full">
          <button
            className="bg-blue-400 py-2 text-white w-full rounded mx-auto text-lg flex justify-center items-center"
            onClick={handleLogout}
          >
            Logout
          </button>

          <button
            className="border border-gray-200 bg-white p-2 rounded-md"
            onClick={handleCompanyProfile}
          >
            View company profile
          </button>
        </div>
      </div>

      <div className="mt-4 bg-gray-50 p-6 border border-gray-200 m-2 rounded-xl">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsConnectionsOpen(!isConnectionsOpen)}
        >
          <div>Connections</div>
          <div className="text-gray-600">
            {isConnectionsOpen ? (
              <FaAngleDown size={20} />
            ) : (
              <FaAngleRight size={20} />
            )}
          </div>
        </div>
        {isConnectionsOpen && (
          <div className="mt-4">
            <ConnectionsMobile />
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "MainMore":
        return renderMainMore();
      case "Recommendation":
        return <RecommendedQueriesMobile />;
      case "Connections":
        return <ConnectionsMobile />;
      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
}

export default MoreMobile;
