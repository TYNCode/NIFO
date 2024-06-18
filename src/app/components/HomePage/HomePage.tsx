"use client";
import React, { useEffect, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import NavBar from "../Navbar";
import Prompt from "../Prompt";
import axios from "axios";
import CompanyProfilePane from "../CompanyProfilePane";
import { QueryResponse, StartupType } from "../../interfaces";
import LeftFrame from "../LeftFrame/LeftFrame";
import api from "../Axios";
import RenderStartup from "./RenderStartup";

export default function HomePage() {
  const [messages, setMessages] = useState([]);
  const [defaultPrompt, setDefaultPrompt] = useState<string>("");
  const [open, setOpen] = useState<boolean>(true);
  const [selectedStartup, setSelectedStartup] = useState<StartupType>();
  const [openCompanyPane, setOpenCompanyPane] = useState<boolean>(true);
  const [inputPrompt, setInputPrompt] = useState(defaultPrompt);
  const [openRightFrame, setOpenRightFrame] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isInputEmpty, setIsInputEmpty] = useState<boolean>(true);
  const [mailMessage, setMailMessage] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("Connect");
  const [queryData, setQueryData] = useState<QueryResponse | null>(null);

  console.log("queryDatainHome", queryData, inputPrompt);

  useEffect(() => {
    const userInfoFromStorage = localStorage.getItem("userInfo");
    if (userInfoFromStorage) {
      const parsedUserInfo = JSON.parse(userInfoFromStorage);
      setUserInfo(parsedUserInfo);
    }
  }, []);

  useEffect(() => {
    const promptStorage = localStorage.setItem("promptStorage", inputPrompt);
  }, []);

  const handleToggleLeftFrameNavbar = () => {
    setOpen(!open);
  };

  console.log("messages", messages);
  const handleToggleLeftFrame = () => {
    if (open) {
      setOpen(!open);
    }
  };

  const toggleWidth = () => {
    setExpanded(!expanded);
  };

  const handleToggleRightFrame = () => {
    if (openRightFrame) {
      setOpenRightFrame(!openRightFrame);
    }
  };

  const handleSaveInput = async (input: string) => {
    let userquery = { userquery: input };

    setMessages((prevMessages) => [
      ...prevMessages,
      { question: input, response: "Loading" },
    ]);
    try {
      const response = await axios.post(
        `https://theyellow.group/api/prompt/ragsearch/`,
        userquery
      );
      setMessages([...messages, { question: input, response: response.data }]);
    } catch (error) {
      console.log("erroringettingstartups", error);
    }
  };

  //save the data queried
  const saveQueryData = async (query: string) => {
    const jwtAccessToken = localStorage.getItem("jwtAccessToken");
    if (jwtAccessToken) {
      const response = await axios.post(
        "https://theyellow.group/api/queryhistory/save/",
        {
          userquery: query,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtAccessToken}`,
          },
        }
      );
      setQueryData(response.data);
    } else {
      console.error("JWT token not found in localStorage");
    }
  };

  let jwtAccessToken = localStorage.getItem("jwtAccessToken");
  const fetchConnectStatus = async (startupId: number) => {
    console.log("Fetching status for startupId:", startupId);
    if (jwtAccessToken && startupId) {
      const url = `https://theyellow.group/apiconnects/${startupId}/`;
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${jwtAccessToken}`,
          },
        });
        console.log("Fetching status response", response.data.status);
        setConnectionStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching connection status:", error);
      }
    } else {
      console.error("Missing JWT token or startup ID");
    }
  };

  const handleSendStartupData = (item: any, message: any) => {
    console.log("itemofhandlem", item);
    setMailMessage(message);
    setSelectedStartup(item?.database_info);
    setOpenRightFrame(true);
    fetchConnectStatus(item?.database_info?.startup_id);
  };

  const renderMessages = () => {
    return messages.map((message: any, index: number) => (
      <div key={index} className="justify-between mb-4 text-[16px] px-6">
        <div className="p-6 text-left border-l-4 border-orange-100">
          <span className="font-semibold text-[17px] text-black block mb-1">
            You:
          </span>
          <span className="text-[17px]">{message?.question}</span>
        </div>
        <div className="p-6 text-left border-l-4 border-blue-100">
          <span className="font-semibold text-black block mb-3">NIFO:</span>
          {message?.response === "Loading" ? (
            <div>Loading..</div>
          ) : (
            <div>
              {message.response.response ==
              "No specific details available." ? null : (
                <div className="mb-2 leading-7">
                  {message.response.response}
                </div>
              )}

              <RenderStartup
                message={message}
                handleSendStartupData={handleSendStartupData}
              ></RenderStartup>
            </div>
          )}
        </div>
      </div>
    ));
  };

  return (
    <main className="">
      <div className="flex flex-row  w-full">
        {open && (
          <div className="w-1/5">
            <LeftFrame
              open={open}
              inputPrompt={inputPrompt}
              setInputPrompt={setInputPrompt}
              isInputEmpty={isInputEmpty}
              setIsInputEmpty={setIsInputEmpty}
              userInfo={userInfo}
              queryData={queryData}
            />
          </div>
        )}
        <div className="relative flex-grow pt-12">
          <Prompt
            onSaveInput={handleSaveInput}
            defaultPrompt={defaultPrompt}
            renderMessages={renderMessages}
            inputPrompt={inputPrompt}
            setInputPrompt={setInputPrompt}
            open={open}
            handleToggleLeftFrame={handleToggleLeftFrame}
            openRightFrame={openRightFrame}
            handleToggleRightFrame={handleToggleRightFrame}
            isInputEmpty={isInputEmpty}
            setIsInputEmpty={setIsInputEmpty}
            saveQueryData={saveQueryData}
          />
          <div className="absolute left-2 top-2">
            <NavBar
              open={open}
              handleToggleLeftFrame={handleToggleLeftFrameNavbar}
            />
          </div>
        </div>
        {openRightFrame && selectedStartup && (
          <div className={`${expanded ? "" : "w-1/4"}`}>
            <CompanyProfilePane
              companyData={selectedStartup}
              setOpenState={setOpenRightFrame}
              openState={openRightFrame}
              userInfo={userInfo}
              expanded={expanded}
              toggleWidth={toggleWidth}
              mailData={mailMessage}
              setMailData={setMailMessage}
              connectionStatus={connectionStatus}
              setConnectionStatus={setConnectionStatus}
              queryData={queryData}
            />
          </div>
        )}
      </div>
    </main>
  );
}
