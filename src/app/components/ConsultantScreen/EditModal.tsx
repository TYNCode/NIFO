import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Request } from "../../interfaces";
import axios from "axios"; // Assuming you're using axios for API calls

interface EditModalProps {
  editModalOpen: boolean;
  setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  request: Request;
  formatDate: (date: string) => string;
}

const EditModal: React.FC<EditModalProps> = ({
  editModalOpen,
  setEditModalOpen,
  request,
  formatDate,
}) => {
  const [currentStatus, setCurrentStatus] = useState(request.query_status);
  console.log(request.id);
  const updateStatus = async (id) => {
    const jwtAccessToken = localStorage.getItem("jwtAccessToken");
    if (jwtAccessToken) {
      try {
        await axios.put(
          `https://theyellow.group/api/partnerconnect/${id}/update-query-status/`,
          {
            query_status: currentStatus,
          },
          {
            headers: {
              Authorization: `Bearer ${jwtAccessToken}`,
            },
          }
        );
        setCurrentStatus(request.query_status);
        setEditModalOpen(false);
      } catch (error) {
        console.error("Failed to update status", error);
      }
    } else {
      console.error("JWT token not found in localStorage");
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentStatus(event.target.value);
  };

  return (
    <div className="flex justify-center items-center fixed inset-0 z-50 outline-none focus:outline-none">
      <div className="max-w-5xl">
        <div className="p-4 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-row justify-between">
              <div className="flex text-xl font-semibold py-2 pb-4 ">
                View Request
              </div>
              <button
                className="flex text-gray-300"
                onClick={() => setEditModalOpen(false)}
              >
                <IoMdClose size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-12">
              <div className="flex flex-col gap-y-8">
                {/* <div className="relative">
                  <div className="absolute text-xs transform left-4 -translate-y-1/2 bg-white">
                    Request Id
                  </div>
                  <div className="p-2 shadow-lg rounded-lg border">
                    {request.id}
                  </div>
                </div> */}
                {/* <div className="relative">
                  <div className="absolute text-xs transform left-4 -translate-y-1/2 bg-white">
                    Connected Firm
                  </div>
                  <div className="p-2 shadow-lg rounded-lg border">
                    {request.to_growthtechfirm.startup_name}
                  </div>
                </div> */}
                {/* <div className="relative">
                  <div className="absolute text-xs transform left-4 -translate-y-1/2 bg-white">
                    Created At
                  </div>
                  <div className="p-2 shadow-lg rounded-lg border">
                    {formatDate(request.created_at)}
                  </div>
                </div> */}
                <div className="relative">
                  <div className="absolute text-xs transform left-4 -translate-y-1/2 bg-white">
                    Use Cases
                  </div>
                  <div className="p-2 shadow-lg rounded-lg border break-words whitespace-normal text-left">
                    {request.user_query.query}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-y-8">
                {/* <div className="relative">
                  <div className="absolute text-xs transform left-4 -translate-y-1/2 bg-white">
                    User Name
                  </div>
                  <div className="p-2 shadow-lg rounded-lg border">
                    {request.from_user.first_name}
                  </div>
                </div> */}
                {/* <div className="relative">
                  <div className="absolute text-xs transform left-4 -translate-y-1/2 bg-white">
                    Org Name
                  </div>
                  <div className="p-2 shadow-lg rounded-lg border">
                    {request.from_user.organization_name}
                  </div>
                </div> */}
                <div className="relative">
                  <div className="absolute text-xs transform left-4 -translate-y-1/2 bg-white">
                    Current Status
                  </div>
                  <div className="p-2 shadow-lg rounded-lg border cursor-pointer">
                    <select
                      className="flex focus:outline-none justify-between w-full"
                      value={currentStatus}
                      onChange={handleStatusChange}
                    >
                      <option value="in_progress">Requested</option>
                      <option value="gtf_pending">GTF Pending</option>
                      <option value="convo_started">Convo Started</option>
                      <option value="pitch">Pitch</option>
                      <option value="rejected">Rejected</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded shadow"
                onClick={() => updateStatus(request.id)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
