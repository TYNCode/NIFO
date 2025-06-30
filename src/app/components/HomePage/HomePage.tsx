"use client";

import React, { useEffect } from "react";
import LeftFrame from "../LeftFrame/LeftFrame";
import Prompt from "../Prompt";
import CompanyProfilePane from "../CompanyProfilePane";
import MobileHeader from "../../mobileComponents/MobileHeader";
import { v4 as uuidv4 } from "uuid";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchPartnerConnectsByOrg } from "../../redux/features/connection/connectionSlice";
import {
  setSessionId,
  setUserInfo,
  setSelectedStartup,
  setMailMessage,
  setQueryData,
  clearMessages,
  clearChatState,
  sendPrompt,
  addMessage,
} from "../../redux/features/chat/chatSlice";
import { fetchConversationsBySessionId } from "../../redux/features/chat/sessionMessageSlice";
import { useParams } from "next/navigation";

export default function HomePage() {
  // UI toggles remain local
  const [openLeftFrame, setOpenLeftFrame] = React.useState(true);
  const [openRightFrame, setOpenRightFrame] = React.useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [selectedSessionId, setSelectedSessionId] = React.useState<string | null>(null);

  const dispatch = useAppDispatch();
  const {
    messages,
    sessionId,
    userInfo,
    selectedStartup,
    mailMessage,
    queryData,
    loading,
    error,
  } = useAppSelector((state) => state.chat);
  const sessionMessage = useAppSelector((state) => state.sessionMessage);
  const params = useParams();
  const urlSessionId = params?.id as string | undefined;

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) dispatch(setUserInfo(JSON.parse(user)));
  }, [dispatch]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    // On mount, set a sessionId if not present
    if (!sessionId) {
      dispatch(setSessionId(uuidv4()));
    }
  }, [dispatch, sessionId]);

  const handleSaveInput = async (input: string) => {
    const token = localStorage.getItem("jwtAccessToken");
    dispatch(addMessage({ question: input, response: "Loading" }));
    dispatch(
      sendPrompt({ input, sessionId: selectedSessionId || sessionId, token: token || "" })
    );
  };

  const handleNewChat = () => {
    const newSessionId = uuidv4();
    dispatch(setSessionId(newSessionId));
    setSelectedSessionId(null);
    dispatch(clearMessages());
    dispatch(clearChatState());
  };

  const toggleWidth = () => setExpanded((prev) => !prev);
  const handleSendStartupData = (item: any, msg: any) => {
    dispatch(setMailMessage(msg));
    dispatch(setSelectedStartup(item?.database_info));
    dispatch(fetchPartnerConnectsByOrg(item?.database_info?.startup_id));
    setOpenRightFrame(true);
  };

  const handleSessionSelect = (id: string) => {
    setSelectedSessionId(id);
    dispatch(setSessionId(id));
    dispatch(clearMessages());
    dispatch(fetchConversationsBySessionId(id));
  };

  return (
    <main className="flex flex-col w-full h-full">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-gray-200">
        <MobileHeader onMenuToggle={() => setIsMobileMenuOpen(true)} />
      </div>

      <div className="flex flex-row w-full h-full">
        {/* Left Sidebar - Desktop */}
        <div className="hidden lg:block lg:w-[260px]">
          <LeftFrame onNewChat={handleNewChat} setSessionId={(id: string) => dispatch(setSessionId(id))} onSessionSelect={handleSessionSelect} />
        </div>

        {/* Left Sidebar - Mobile */}
        <LeftFrame
          isMobile
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          onNewChat={handleNewChat}
          setSessionId={(id: string) => dispatch(setSessionId(id))}
          onSessionSelect={handleSessionSelect}
        />

        {/* Center Prompt Area */}
        <div className="relative flex-grow flex flex-col min-h-screen overflow-hidden">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          )}
          <Prompt
            handleToggleLeftFrame={() => setOpenLeftFrame(!openLeftFrame)}
            handleToggleRightFrame={() => setOpenRightFrame(!openRightFrame)}
            onSaveInput={handleSaveInput}
            messages={urlSessionId ? sessionMessage.conversations : selectedSessionId ? sessionMessage.conversations : messages}
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
              setMailData={(msg: any) => dispatch(setMailMessage(msg))}
              queryData={queryData}
            />
          </div>
        )}
      </div>
    </main>
  );
}
