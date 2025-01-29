"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../components/ConsultantScreen/Navbar";
import { IoPerson } from "react-icons/io5";
import { FaUser, FaUsers, FaUserCog } from "react-icons/fa";
import axios from "axios";
import StartupManage from "../components/AdminScreen/StartupManage";
import EnterpriseManage from "../components/AdminScreen/EnterPriseManage";
import ConsultantManage from "../components/AdminScreen/ConsultantManage";

const progress = ["Newly Added", "In Progress", "Completed"];

interface IconData {
  id: string;
  icon: React.ReactNode;
  view: string;
}

const Dashboard: React.FC = () => {
  const [newlyAddedOpen, setNewlyAddedOpen] = useState<boolean>(true);
  const [inProgressOpen, setInProgressOpen] = useState<boolean>(true);
  const [completedOpen, setCompletedOpen] = useState<boolean>(true);
  const [rejectedOpen, setRejectedOpen] = useState<boolean>(true);
  const [view, setView] = useState<string>("StartupManage");
  const [userInfo, setUserInfo] = useState<any>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      setUserInfo(storedUserInfo);
    }
  }, []);
  
  const isSuperUser = userInfo["is_superuser"];

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const toggleNewlyAdded = () => {
    setNewlyAddedOpen(!newlyAddedOpen);
  };

  const toggleInProgress = () => {
    setInProgressOpen(!inProgressOpen);
  };

  const toggleCompleted = () => {
    setCompletedOpen(!completedOpen);
  };

  const toggleRejected = () => {
    setRejectedOpen(!rejectedOpen);
  };

  const iconsData: IconData[] = [
    {
      id: "adminConfig",
      icon: <FaUserCog size={23} />,
      view: "adminConfig",
    },
    {
      id: "StartupManage",
      icon: <FaUsers size={23} />,
      view: "StartupManage",
    },
    {
      id: "EnterpriseManage",
      icon: <FaUser size={23} />,
      view: "EnterpriseManage",
    },
    {
      id: "ConsultantManage",
      icon: <FaUser size={23} />,
      view: "ConsultantManage",
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      <NavBar />

      <div className="flex-grow flex flex-row">
        <div className="flex flex-col gap-8 shadow-md px-6 z-10 items-center">
          {iconsData.map((iconData) => (
            (iconData.view === "adminConfig" && isSuperUser) || iconData.view !== "adminConfig" ? (
              <div
                key={iconData.id}
                id={iconData.id}
                className={`mt-5 cursor-pointer ${view === iconData.view ? "text-yellow-500" : "text-gray-400"}`}
                onClick={() => setView(iconData.view)}
              >
                {iconData.icon}
              </div>
            ) : null
          ))}
        </div>

        <div className="w-full mt-2">
          {view === "StartupManage" ? (
            <StartupManage />
          ) : view === "EnterpriseManage" ? (
            <EnterpriseManage />
          ) : view === "ConsultantManage" ? (
            <ConsultantManage />
          ) : (
            <div>Admin Configuration</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
