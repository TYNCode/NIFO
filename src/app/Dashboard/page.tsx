"use client";
import React, { useEffect, useState } from "react";
import NavBar from "../components/ConsultantScreen/Navbar";
import { IoPerson } from "react-icons/io5";
import { FaUser, FaUsers, FaUserCog } from "react-icons/fa";
import axios from "axios";
import StartupManage from "../components/AdminScreen/StartupManage";
import EnterpriseManage from "../components/AdminScreen/EnterPriseManage";
import ConsultantManage from "../components/AdminScreen/ConsultantManage";
import ManageStartups from "../components/AdminScreen/ManageStartups";

import { FaBuilding } from "react-icons/fa";
import ManageUsers from "../components/UserScreen/ManageUsers";

const progress = ["Newly Added", "In Progress", "Completed"];

const Dashboard: React.FC = () => {
  const [newlyAddedOpen, setNewlyAddedOpen] = useState<boolean>(true);
  const [inProgressOpen, setInProgressOpen] = useState<boolean>(true);
  const [completedOpen, setCompletedOpen] = useState<boolean>(true);
  const [rejectedOpen, setRejectedOpen] = useState<boolean>(true);
  const [view, setView] = useState<string>("");
  const [userInfo, setUserInfo] = useState<any>({});
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStartups, setIsLoadingStartups] = useState(true);
  const [startups, setStartups] = useState([]);
  const [consultantsData, setConsultants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [StartupsCount, setStartupsCount] = useState(0);
  const [ConsultantsCount, setConsultantsCount] = useState(0);
  const [IsLoadingConsultants, setIsLoadingConsultants] = useState(true);

  useEffect(() => {
    fetchStartups(currentPage);
  }, [currentPage]);

  const fetchStartups = async (page) => {
    try {
      setIsLoadingStartups(true);
      const response = await fetch(
        `http://127.0.0.1:8000/adminroutes/api/startups/?page=${page}`
      );
      if (!response.ok) throw new Error("Failed to fetch startups");

      const data = await response.json();
      console.log("Data results=>", data.results);
      setStartups(data.results);
      setStartupsCount(data.count);
    } catch (error) {
      console.error("Error fetching startups:", error);
    } finally {
      setIsLoadingStartups(false);
    }
  };

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        setIsLoadingConsultants(true);
        const response = await fetch(
          "http://127.0.0.1:8000/adminroutes/api/consultants/"
        );
        if (!response.ok) throw new Error("Failed to fetch consultants");

        const data = await response.json();
        setConsultants(data);
        setConsultantsCount(data.length);
      } catch (error) {
        console.error("Error fetching consultants:", error);
      } finally {
        setIsLoadingConsultants(false);
      }
    };

    fetchConsultants();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setIsLoading(true);

  //       const [startupsRes, consultantsRes] = await Promise.all([
  //         fetch("http://127.0.0.1:8000/adminroutes/api/startups/"),
  //         fetch("http://127.0.0.1:8000/adminroutes/api/consultants/"),
  //       ]);

  //       if (!startupsRes.ok || !consultantsRes.ok)
  //         throw new Error("Failed to fetch data");

  //       const [startupsData, consultantsData] = await Promise.all([
  //         startupsRes.json(),
  //         consultantsRes.json(),
  //       ]);

  //       setStartupsCount(startupsData.length);
  //       setConsultantsCount(consultantsData.length);
  //       setStartups(startupsData);
  //       setConsultants(consultantsData);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://tyn-server.azurewebsites.net/adminroutes/api/users/?page=${page}`
      );

      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();

      const formattedData = data.results.map((user) => ({
        id: user.id,
        first_name: user.first_name,
        email: user.email,
        startup_name: user.organization?.startup_name || "N/A",
        is_active: user.is_active,
        is_primary_user: user.is_primary_user,
        date_joined: user.date_joined,
        is_staff: user.is_staff,
      }));

      setUsers(formattedData);
      setTotalCount(data.count);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserInfo = JSON.parse(localStorage.getItem("user") || "{}");
      setUserInfo(storedUserInfo);
    }
  }, []);

  const isSuperUser = userInfo["is_superuser"];
  const userEmail = userInfo["email"];
  const isPrimayUser = userInfo["is_primary_user"];

  useEffect(() => {
    if (isSuperUser === true) {
      setView("StartupManage");
    } else {
      setView("ManageUsers");
    }
  }, [userInfo]);

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
            <div>
              <div
                className={`mt-5 cursor-pointer ${
                  view === "StartupManage" ? "text-yellow-500" : "text-gray-400"
                }`}
                onClick={() => {
                  setView("StartupManage");
                  handlePageChange(1);
                }}
              >
                <FaUsers size={23} />
              </div>
              <div
                className={`mt-5 cursor-pointer ${
                  view === "EnterpriseManage"
                    ? "text-yellow-400"
                    : "text-gray-400"
                }`}
                onClick={() => {
                  setView("EnterpriseManage");
                  handlePageChange(1);
                }}
              >
                <FaUsers size={23} />
              </div>
              <div
                className={`mt-5 cursor-pointer ${
                  view === "ConsultantManage"
                    ? "text-yellow-400"
                    : "text-gray-400"
                }`}
                onClick={() => {
                  setView("ConsultantManage");
                  handlePageChange(1);
                }}
              >
                <FaUsers size={23} />
              </div>
              <div
                className={`mt-5 cursor-pointer ${
                  view === "ManageStartup" ? "text-yellow-400" : "text-gray-400"
                }`}
                onClick={() => setView("ManageStartup")}
              >
                <FaBuilding size={23} />
              </div>
            </div>
          ) : (
            <div
              className={`mt-5 cursor-pointer ${
                view === "ManageUsers" ? "text-yellow-400" : "text-gray-400"
              }`}
              onClick={() => {
                setView("ManageUsers");
                handlePageChange(1);
              }}
            >
              <FaUsers size={23} />
            </div>
          )}
        </div>

        <div className="w-full mt-2">
          {view === "StartupManage" ? (
            <StartupManage
              users={users}
              setUsers={setUsers}
              isLoading={isLoading}
              totalCount={totalCount}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          ) : view === "EnterpriseManage" ? (
            <EnterpriseManage
              users={users}
              setUsers={setUsers}
              isLoading={isLoading}
              totalCount={totalCount}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          ) : view === "ConsultantManage" ? (
            <ConsultantManage
              ConsultantData={consultantsData}
              setUsers={setConsultants}
              isLoading={IsLoadingConsultants}
              totalCount={ConsultantsCount}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          ) : view === "ManageStartup" ? (
            <ManageStartups
              data={startups}
              entityName="Startups"
              setData={setStartups}
              isLoading={isLoadingStartups}
              totalCount={StartupsCount}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          ) : view === "ManageUsers" ? (
            <ManageUsers
              users={users}
              setUsers={setUsers}
              isLoading={isLoading}
              totalCount={totalCount}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              userEmail={userEmail}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
