import React, { useState } from "react";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { GrFormClose } from "react-icons/gr";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import Image from "next/image";
import ConnectModal from "./CompanyProfile/ConnectModal";
import { ChatHistoryResponse, StartupType } from "../interfaces";
import { useAppDispatch } from "../redux/hooks";
import {
  createPartnerConnect,
  setConnectionStatus,
} from "../redux/features/connection/connectionSlice";

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
  queryData: ChatHistoryResponse;
  requestQuery: string;
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
  queryData,
  requestQuery,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  console.log("companyDataa-->", companyData);
  const dispatch = useAppDispatch();
  console.log(
    "conectionStatusLaptop",
    connectionStatus,
    companyData.startup_name
  );
  const openPane = () => setOpenState(false);
  const handleConnect = async () => {
    if (connectionStatus === null || connectionStatus === "Connect") {
      setIsLoading(true);
      try {
        await sendEmail();

        
        // Dispatch the action to create a partner connect
        await dispatch(
          createPartnerConnect({
            consultant_email: "consultant@example.com",
            query: requestQuery,
            request_status: "requested",
            requested_org: companyData?.startup_id,
          })
        );

        // Open a modal if the operations were successful
        setIsModalOpen(true);
      } catch (error) {
        console.error("Connection Error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const sendEmail = async () => {
    await axios.post("http://127.0.0.1:8000/email/send-email/", {
      subject: "This is a test email",
      template_name: "email_template.html",
      context: { userInfo, mailData, companyData },
      recipient_list: ["lathiesh@theyellow.network"],
    });
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
                  className={`flex justify-center items-center px-4 py-1.5 rounded-md text-white font-semibold cursor-pointer capitalize ${
                    connectionStatus === "requested"
                      ? "bg-gray-400 hover:bg-yellow-400 cursor-pointer"
                      : "bg-blue-400 cursor-default"
                  }`}
                  onClick={handleConnect}
                >
                  {isLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : connectionStatus == null ? (
                    "Connect"
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
