"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import LeftFrame from "../LeftFrame/LeftFrame";
import Prompt from "../Prompt";
import CompanyProfilePane from "../CompanyProfilePane";
import MobileHeader from "../../mobileComponents/MobileHeader";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch } from "../../redux/hooks";
import { fetchPartnerConnectsByOrg } from "../../redux/features/connection/connectionSlice";

export default function HomePage() {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(() => uuidv4());
  const [openLeftFrame, setOpenLeftFrame] = useState(true);
  const [openRightFrame, setOpenRightFrame] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [mailMessage, setMailMessage] = useState(null);
  const [queryData, setQueryData] = useState(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setUserInfo(JSON.parse(user));
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleSaveInput = async (input) => {
    const token = localStorage.getItem("jwtAccessToken");
    setMessages((prev) => [...prev, { question: input, response: "Loading" }]);

    try {
      const res = await axios.post(
        "https://tyn-server.azurewebsites.net/prompt/chat/",
        { input, session_id: sessionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) =>
        prev.map((msg) =>
          msg.question === input ? { question: input, response: res.data } : msg
        )
      );
    } catch (error) {
      const message =
        error.code === "ECONNREFUSED"
          ? "Connection error"
          : error.response?.status === 500
          ? "Internal Server Error"
          : error.message || "Error fetching response";

      setMessages((prev) =>
        prev.map((msg) =>
          msg.question === input ? { question: input, response: message } : msg
        )
      );
    }
  };

  const handleNewChat = () => {
    setSessionId(uuidv4());
    setMessages([]);
  };

  const toggleWidth = () => setExpanded((prev) => !prev);
  const handleSendStartupData = (item, msg) => {
    setMailMessage(msg);
    setSelectedStartup(item?.database_info);
    dispatch(fetchPartnerConnectsByOrg(item?.database_info?.startup_id));
    setOpenRightFrame(true);
  };

  return (
    <main className="flex flex-col w-full h-full">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-200">
        <MobileHeader onMenuToggle={() => setIsMobileMenuOpen(true)} />
      </div>

      <div className="flex flex-row w-full h-full">
        {/* Left Sidebar - Desktop */}
        <div className="hidden lg:block lg:w-[21%]">
          <LeftFrame onNewChat={handleNewChat} setSessionId={setSessionId} />
        </div>

        {/* Left Sidebar - Mobile */}
        <LeftFrame
          isMobile
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          onNewChat={handleNewChat}
          setSessionId={setSessionId}
        />

        {/* Center Prompt Area */}
       <div className="relative flex-grow flex flex-col min-h-screen overflow-hidden">
          <Prompt
            handleToggleLeftFrame={() => setOpenLeftFrame(!openLeftFrame)}
            handleToggleRightFrame={() => setOpenRightFrame(!openRightFrame)}
            onSaveInput={handleSaveInput}
            messages={messages}
          />
        </div>

        {/* Right Company Profile Pane */}
        {openRightFrame && selectedStartup && (
          <div className={`hidden lg:block ${expanded ? "" : "w-1/4"}`}>
            <CompanyProfilePane
              companyData={selectedStartup}
              setOpenState={setOpenRightFrame}
              openState={openRightFrame}
              userInfo={userInfo}
              expanded={expanded}
              toggleWidth={toggleWidth}
              mailData={mailMessage}
              setMailData={setMailMessage}
              queryData={queryData}
            />
          </div>
        )}
      </div>
    </main>
  );
}
