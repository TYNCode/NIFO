"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../components/ConsultantScreen/Navbar";
import { IoPerson } from "react-icons/io5";
import { FaUser, FaUsers, FaUserCog } from "react-icons/fa";
import axios from "axios";
import MyRequests from "../components/ConsultantScreen/MyRequests";
import AllRequests from "../components/ConsultantScreen/AllRequests";

const progress = ["Newly Added", "In Progress", "Completed"];

const TotalRequests: React.FC = () => {
  const [newlyAddedOpen, setNewlyAddedOpen] = useState<boolean>(true);
  const [inProgressOpen, setInProgressOpen] = useState<boolean>(true);
  const [completedOpen, setCompletedOpen] = useState<boolean>(true);
  const [rejectedOpen, setRejectedOpen] = useState<boolean>(true);
  const [view, setView] = useState<string>("allRequests");

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
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

  return (
    <div className="flex flex-col h-screen">
      <NavBar />

      <div className="flex-grow flex flex-row">
        <div className="flex flex-col gap-8  shadow-md px-6 z-10 items-center">
          {isSuperUser ? (
            <div
              className={`mt-5 cursor-pointer ${
                view === "adminConfig" ? "text-yellow-500" : "text-gray-400"
              }`}
              onClick={() => setView("adminConfig")}
            >
              <FaUserCog size={23} />
            </div>
          ) : null}
          <div
            className={`mt-5 cursor-pointer ${
              view === "allRequests" ? "text-yellow-500" : "text-gray-400"
            }`}
            onClick={() => setView("allRequests")}
          >
            <FaUsers size={23} />
          </div>
          <div
            className={`mt-5 cursor-pointer ${
              view === "myRequests" ? "text-yellow-400" : "text-gray-400"
            }`}
            onClick={() => setView("myRequests")}
          >
            <FaUser size={23} />
          </div>
        </div>

        <div>
          {view === "allRequests" ? (
            <AllRequests
              newlyAddedOpen={newlyAddedOpen}
              toggleNewlyAdded={toggleNewlyAdded}
              toggleInProgress={toggleInProgress}
              completedOpen={completedOpen}
              inProgressOpen={inProgressOpen}
              toggleCompleted={toggleCompleted}
              isSuperUser={isSuperUser}
            />
          ) : view === "myRequests" ? (
            <MyRequests
              newlyAddedOpen={newlyAddedOpen}
              toggleNewlyAdded={toggleNewlyAdded}
              toggleInProgress={toggleInProgress}
              completedOpen={completedOpen}
              inProgressOpen={inProgressOpen}
              toggleCompleted={toggleCompleted}
              rejectedOpen={rejectedOpen}
              toggleRejected={toggleRejected}
            />
          ) : (
            <div>Admin Configuration</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TotalRequests;
