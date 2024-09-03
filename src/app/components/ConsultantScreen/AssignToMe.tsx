import React, { useState } from "react";
import { TiTickOutline } from "react-icons/ti";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { Request } from "../../interfaces";
import { MdAssignmentInd } from "react-icons/md";

interface AssignToMeProps {
  assignToMeOpen: boolean;
  setAssignToMeOpen: React.Dispatch<React.SetStateAction<boolean>>;
  request: Request;
  updateAssignedStatus: (
    id: number,
    status: boolean,
    assignedTo: {
      first_name: string;
      email: string;
      organization_name: string;
    }
  ) => void;
  isSuperUser: boolean;
}

const AssignToMe: React.FC<AssignToMeProps> = ({
  setAssignToMeOpen,
  assignToMeOpen,
  request,
  updateAssignedStatus,
  isSuperUser,
}) => {
  const [loading, setLoading] = useState(false);
  const [assigned, setAssigned] = useState(request.assigned_status);
  const [openAssigneeColumn, setOpenAssigneeColumn] = useState(false);

  // Safely parse userInfo from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const userId = userInfo?.id;
  const userEmail = userInfo?.email || "";
  const userCompany = userInfo?.organization_name || "";
  const userName = userInfo?.first_name || "";

  const assigneeData = [
    { id: 1, name: "Lathiesh", email: "lathiesh@theyellow.network" },
    { id: 2, name: "Rakesh", email: "rakesh@theyellow.network" },
    { id: 3, name: "Anand", email: "anand@theyellow.network" },
    { id: 4, name: "Pavithra", email: "pavithra@theyellow.network" },
  ];

  const assignRequest = async (
    id: number,
    assignee: {
      id?: number;
      first_name: string;
      email: string;
      organization_name: string;
    }
  ) => {
    setLoading(true);
    const jwtAccessToken = localStorage.getItem("jwtAccessToken");

    if (jwtAccessToken) {
      try {
        await axios.put(
          `https://nifo.theyellow.network/api/partnerconnect/${id}`,
          {
            assigned_status: true,
            assigned_to: assignee,
          },
          {
            headers: {
              Authorization: `Bearer ${jwtAccessToken}`,
            },
          }
        );
        setAssigned(true);
        updateAssignedStatus(id, true, assignee);
        setAssignToMeOpen(false);
      } catch (error) {
        console.error(
          "Error in PUT request:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    } else {
      console.error("JWT token not found in localStorage");
      setLoading(false);
    }
  };

  const changeAssignToMe = () => {
    assignRequest(request.id, {
      first_name: userName,
      email: userEmail,
      organization_name: userCompany,
    });
  };

  const assignToMembers = (
    id: number,
    assigneeId: number,
    userName: string,
    userEmail: string
  ) => {
    assignRequest(id, {
      id: assigneeId,
      first_name: userName,
      email: userEmail,
      organization_name: userCompany,
    });
  };

  const toggleAssigneeColumn = () => {
    setOpenAssigneeColumn(!openAssigneeColumn);
  };

  return (
    <div className="flex justify-center items-center fixed inset-0 z-50 outline-none focus:outline-none">
      <div className="max-w-5xl">
        <div className="p-4 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-row justify-between">
              <div className="text-xl font-semibold py-2 pb-4">
                Request Detail
              </div>
              <button
                className="text-gray-300"
                onClick={() => setAssignToMeOpen(false)}
              >
                <span className="text-3xl text-black">x</span>
              </button>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-8">
                <div className="relative">
                  <div className="absolute text-xs transform left-4 -translate-y-1/2 bg-white">
                    Usecase
                  </div>
                  <div className="p-2 shadow-lg rounded-lg border break-words whitespace-normal text-left">
                    {request.user_query?.query || "No Query Available"}
                  </div>
                </div>
                {/* <div className="relative">
                  <div className="absolute text-xs transform left-4 -translate-y-1/2 bg-white">
                    Growth Tech Firm
                  </div>
                  <div className="p-2 shadow-lg rounded-lg border flex items-center gap-x-1">
                    <div>
                      {request.to_growthtechfirm?.startup_name || "N/A"}
                    </div>
                    <div className="text-sm bg-yellow-400 rounded-xl text-white">
                      <TiTickOutline size={14} />
                    </div>
                  </div>
                </div> */}
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-y-4">
                  <div className="text-lg font-semibold text-blue-400">
                    Nifo User
                  </div>
                  {/* <div className="relative">
                    <div className="absolute text-xs transform left-4 -translate-y-1/2 bg-white">
                      User Name
                    </div>
                    <div className="p-2 shadow-lg rounded-lg border">
                      {request.from_user?.first_name || "N/A"}
                    </div>
                  </div> */}
                  <div className="relative">
                    <div className="absolute text-xs transform left-4 -translate-y-1/2 bg-white">
                      User Mail ID
                    </div>
                    <div className="p-2 shadow-lg rounded-lg border">
                      {request.from_user?.email || "N/A"}
                    </div>
                  </div>
                  {/* <div className="relative">
                    <div className="absolute text-xs transform left-4 -translate-y-1/2 bg-white">
                      User Organization
                    </div>
                    <div className="p-2 shadow-lg rounded-lg border">
                      {request.from_user?.organization_name || "N/A"}
                    </div>
                  </div> */}
                </div>

                <div className="flex flex-col gap-y-4">
                  <div className="text-lg font-semibold text-blue-400">
                    GTF User
                  </div>
                  <div className="relative">
                    <div className="absolute text-xs transform left-4 -translate-y-1/2 bg-white">
                      SPOC
                    </div>
                    <div className="p-2 shadow-lg rounded-lg border">Anand</div>
                  </div>
                  <div className="relative">
                    <div className="absolute text-xs transform left-4 -translate-y-1/2 bg-white">
                      Email
                    </div>
                    <div className="p-2 shadow-lg rounded-lg border">
                      {request.to_growthtechfirm?.startup_emails || "N/A"}
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute text-xs transform left-4 -translate-y-1/2 bg-white">
                      Firm's Website
                    </div>
                    <div className="p-2 shadow-lg rounded-lg border break-words whitespace-normal text-left">
                      {request.to_growthtechfirm?.startup_url || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4 gap-4">
              {assigned && !isSuperUser ? (
                <div className="bg-blue-400 rounded-lg text-lg text-white font-semibold px-6 py-1.5 outline-none focus:outline-none ease-linear transition-all duration-150">
                  Assigned
                </div>
              ) : isSuperUser ? (
                <button
                  className="relative bg-gray-300 rounded-lg text-sm text-white font-semibold px-4 py-1.5 outline-none focus:outline-none ease-linear transition-all duration-150"
                  type="button"
                  onClick={toggleAssigneeColumn}
                  disabled={loading}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" size={24} />
                  ) : (
                    <div className="flex flex-row justify-center items-center gap-2">
                      <MdAssignmentInd size={20} />
                      <div>Assign</div>
                    </div>
                  )}
                  {openAssigneeColumn && (
                    <div className="absolute bg-white flex flex-col shadow-customShadow text-black rounded-sm top-full left-0 mt-2">
                      {assigneeData.map((assignee) => (
                        <div
                          key={assignee.id}
                          className="flex flex-row gap-6 items-center border-b-[1px] px-6 py-2 rounded-sm hover:bg-gray-200 cursor-pointer"
                          onClick={() =>
                            assignToMembers(
                              request.id,
                              assignee.id,
                              assignee.name,
                              assignee.email
                            )
                          }
                        >
                          <div>{assignee.name}</div>
                          <div className="text-gray-500 text-xs">
                            {assignee.email}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              ) : (
                <button
                  className="bg-blue-400 rounded-lg text-sm text-white font-semibold px-4 py-1.5 outline-none focus:outline-none ease-linear transition-all duration-150"
                  type="button"
                  onClick={changeAssignToMe}
                  disabled={loading}
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" size={24} />
                  ) : (
                    "Assign self"
                  )}
                </button>
              )}
              <button
                className="bg-white text-blue-400 rounded-lg text-sm border border-blue-400 font-semibold px-4 py-1.5 shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                type="button"
                onClick={() => setAssignToMeOpen(false)}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignToMe;
