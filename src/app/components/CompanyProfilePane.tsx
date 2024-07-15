import React, { useState } from "react";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { GrFormClose } from "react-icons/gr";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import Image from 'next/image'; // Assuming you are using Next.js for the Image component
import ConnectModal from "./CompanyProfile/ConnectModal";
import { QueryResponse, StartupType } from "../interfaces";

interface UserInfo {
  email: string;
  first_name: string;
}

interface CompanyProfilePaneProps {
  companyData: StartupType;
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
  openState: boolean;
  userInfo: UserInfo;
  expanded: boolean;
  toggleWidth: () => void;
  mailData: any;
  setMailData: React.Dispatch<React.SetStateAction<any>>;
  connectionStatus: string;
  setConnectionStatus: React.Dispatch<React.SetStateAction<string>>;
  queryData: QueryResponse;
}

const CompanyProfilePane: React.FC<CompanyProfilePaneProps> = ({
  companyData,
  setOpenState,
  openState,
  userInfo,
  expanded,
  toggleWidth,
  mailData,
  connectionStatus,
  setConnectionStatus,
  queryData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  console.log('conectionStatusLaptop',connectionStatus, companyData.startup_name)
  const openPane = () => setOpenState(false);

  const handleConnect = async () => {
    setIsModalOpen(true);
    if (connectionStatus === "Connect") {
      setIsLoading(true);
      try {
        await sendEmail();
        await connectStatusChange();
        await createPartnerConnect();
        setConnectionStatus("Requested");
      } catch (error) {
        console.error("Connection Error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const sendEmail = async () => {
    await axios.post("https://theyellow.group/api/email/send-email/", {
      subject: "Demo",
      template_name: "email_template.html",
      context: { userInfo, mailData, companyData },
      recipient_list: "lathiesh@theyellow.network",
    });
  };

  const connectStatusChange = async () => {
    const jwtAccessToken = localStorage.getItem("jwtAccessToken");
    if (!jwtAccessToken) {
      throw new Error("JWT token not found in localStorage");
    }
    await axios.post(
      "https://theyellow.group/api/connects/",
      { startup_id: companyData?.startup_id },
      { headers: { Authorization: `Bearer ${jwtAccessToken}` } }
    );
  };

  const createPartnerConnect = async () => {
    const jwtAccessToken = localStorage.getItem("jwtAccessToken");
    if (!jwtAccessToken) {
      throw new Error("JWT token not found in localStorage");
    }
    await axios.post(
      "https://theyellow.group/api/partnerconnect/",
      {
        to_growthtechfirm: companyData?.startup_id,
        query_status: "requested",
        user_query: queryData?.id,
      },
      { headers: { Authorization: `Bearer ${jwtAccessToken}` } }
    );
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {openState && (
        <div
          className={`h-screen bg-white shadow-md flex flex-col gap-y-4 py-8 overflow-auto ${
            expanded ? "absolute right-0 lg:w-[500px] xl:w-[900px]" : ""
          }`}
        >
          <div className="mx-6 flex flex-col -mt-5 gap-6">
            <div className="flex justify-between">
              <div className="cursor-pointer" onClick={toggleWidth}>
                {expanded ? (
                  <MdOutlineKeyboardDoubleArrowRight size={23} />
                ) : (
                  <MdOutlineKeyboardDoubleArrowLeft size={23} />
                )}
              </div>
              <div className="mx-4 cursor-pointer" onClick={openPane}>
                <GrFormClose size={23} />
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between items-center text-blue-400 font-semibold text-xl">
                <div>{companyData?.startup_name}</div>
                <div
                  className={`flex justify-center items-center px-4 py-1.5 rounded-md text-white font-semibold ${
                    connectionStatus === "Connect"
                      ? "bg-gray-400 hover:bg-yellow-400 cursor-pointer"
                      : "bg-red-400 cursor-default"
                  }`}
                  onClick={handleConnect}
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    connectionStatus
                  )}
                </div>
                {isModalOpen && <ConnectModal closeModal={closeModal} />}
              </div>
              <div className="border bg-white rounded-md px-4 py-4 shadow-sm">
                {companyData?.startup_overview}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 px-8">
            {companyData?.startup_industry && (
              <div className="flex flex-col">
                <div className="font-semibold">Industry:</div>
                <div className="pl-4">{companyData?.startup_industry}</div>
              </div>
            )}
            {companyData?.startup_technology && (
              <div className="flex flex-col">
                <div className="font-semibold">Technology:</div>
                <div className="pl-4">{companyData?.startup_technology}</div>
              </div>
            )}
            {companyData?.startup_country && (
              <div className="flex">
                <div className="font-semibold">Country:</div>
                <div className="pl-2">{companyData?.startup_country}</div>
              </div>
            )}
            {companyData?.startup_company_stage && (
              <div className="flex">
                <div className="font-semibold">Company Stage:</div>
                <div className="pl-2">{companyData?.startup_company_stage}</div>
              </div>
            )}
            {companyData?.startup_url && (
              <div className="flex flex-col">
                <div className="font-semibold">Website:</div>
                <a
                  href={companyData?.startup_url}
                  target="_blank"
                  className="pl-4 underline text-blue-500"
                >
                  {companyData?.startup_url}
                </a>
              </div>
            )}
            {companyData?.startup_description && (
              <div className="flex flex-col">
                <div className="font-semibold">Description:</div>
                <div className="pl-4">{companyData?.startup_description}</div>
              </div>
            )}
            {companyData?.startup_solutions && (
              <div className="flex flex-col">
                <div className="font-semibold">Solutions:</div>
                <div className="pl-4">{companyData?.startup_solutions}</div>
              </div>
            )}
            {companyData?.startup_usecases && (
              <div className="flex flex-col">
                <div className="font-semibold">Usecases:</div>
                <div className="pl-4">{companyData?.startup_usecases}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyProfilePane;
