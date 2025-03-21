"use client";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { VscTriangleRight, VscTriangleDown } from "react-icons/vsc";
import { CiEdit } from "react-icons/ci";
import { useRouter } from "next/navigation";
import EditModal from "./EditModal";
import axios from "axios";
import { BiSortAlt2 } from "react-icons/bi";

interface MyRequestsProps {
  toggleNewlyAdded: () => void;
  newlyAddedOpen: boolean;
  toggleInProgress: () => void;
  inProgressOpen: boolean;
  toggleCompleted: () => void;
  completedOpen: boolean;
  toggleRejected: () => void;
  rejectedOpen: boolean;
}

const MyRequests: React.FC<MyRequestsProps> = ({
  toggleInProgress,
  inProgressOpen,
  toggleCompleted,
  completedOpen,
  rejectedOpen,
  toggleRejected,
}) => {
  const router = useRouter();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [sortOrderRequestId, setSortOrderRequestId] = useState("ascending");
  const [sortOrderDate, setSortOrderDate] = useState("ascending");
  const [activeSort, setActiveSort] = useState("id");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const truncateText = (text: string, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  const handleBackButton = () => {
    router.push("/");
  };

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const userEmail = userInfo["email"];

  useEffect(() => {
    axios
      .get(`${process.env.PUBLIC_NIFO_BASE_URL_PROD}partnerconnect/`, {
        params: {
          "assigned_to.email": userEmail,
        },
      })
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [userEmail]);

  const handleEditClick = (request) => {
    setCurrentRequest(request);
    setEditModalOpen(true);
  };

  const toggleSortOrderRequestId = () => {
    setSortOrderRequestId((prevOrder) =>
      prevOrder === "ascending" ? "descending" : "ascending"
    );
    setActiveSort("id");
  };

  const toggleSortOrderDate = () => {
    setSortOrderDate((prevOrder) =>
      prevOrder === "ascending" ? "descending" : "ascending"
    );
    setActiveSort("date");
  };

  // Sorting functions
  const sortRequestsById = (requests) => {
    return requests.slice().sort((a, b) => {
      if (sortOrderRequestId === "ascending") {
        return a.id - b.id;
      } else {
        return b.id - a.id;
      }
    });
  };

  const sortRequestsByDate = (requests) => {
    return requests.slice().sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      if (sortOrderDate === "ascending") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  };

  // Get sorted requests based on active sort
  const getSortedRequests = () => {
    if (activeSort === "date") {
      return sortRequestsByDate(requests);
    } else {
      return sortRequestsById(requests);
    }
  };

  const sortedRequests = getSortedRequests();

  return (
    <div className="p-4 flex flex-col w-full">
      <div className="flex flex-row items-center text-2xl text-blue-400 gap-4 mb-4">
        <IoIosArrowBack
          size={23}
          onClick={handleBackButton}
          className="cursor-pointer"
        />
        <div>User Request Management - My Request</div>
      </div>

      <div className="grid grid-cols-12 py-2.5 px-2 text-center uppercase text-sm text-gray-400 font-bold my-2">
        <div className="col-span-1">
          <div className="flex flex-row justify-center items-center">
            <div>Request ID</div>
            <div className="cursor-pointer" onClick={toggleSortOrderRequestId}>
              <BiSortAlt2 size={20} />
            </div>
          </div>
        </div>
        <div className="col-span-1">From</div>
        <div className="col-span-1">To</div>
        <div className="col-span-1">
          <div className="flex flex-row justify-center items-center">
            <div>When</div>
            <div onClick={toggleSortOrderDate} className="cursor-pointer">
              <BiSortAlt2 size={20} />
            </div>
          </div>
        </div>
        <div className="col-span-6">Use Case</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Edit</div>
      </div>

      <div className="flex-grow overflow-auto">
        <div>
          <div className="flex flex-row items-center text-sm mb-2">
            <div onClick={toggleInProgress} className="cursor-pointer">
              {inProgressOpen ? <VscTriangleDown /> : <VscTriangleRight />}
            </div>
            <div className="ml-2 font-semibold">In Progress</div>
          </div>
          {inProgressOpen &&
            sortedRequests
              .filter(
                (request) =>
                  request.query_status === "requested" ||
                  request.query_status === "in_progress" ||
                  request.query_status === "convo_started" ||
                  request.query_status === "pitch" ||
                  request.query_status === "gtf_pending"
              )
              .map((request, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 py-2.5 px-2 text-center text-xs whitespace-nowrap bg-white rounded-lg shadow-md border-gray-100 border-[1px] my-2"
                >
                  <div className="col-span-1">{request?.id}</div>
                  <div className="col-span-1">
                    {request?.from_user.first_name}
                  </div>
                  <div className="col-span-1">
                    {request?.to_growthtechfirm.startup_name}
                  </div>
                  <div className="col-span-1">
                    {formatDate(request?.created_at)}
                  </div>
                  <div className="col-span-6">
                    {truncateText(request?.user_query.query, 60)}
                  </div>
                  <div className="col-span-1 bg-zinc-300 text-gray-800 py-1 rounded capitalize">
                    {request?.query_status}
                  </div>
                  <div
                    className="col-span-1 text-blue-500 flex items-center justify-center cursor-pointer"
                    onClick={() => handleEditClick(request)}
                  >
                    <CiEdit size={28} />
                  </div>
                  {editModalOpen && currentRequest && (
                    <EditModal
                      editModalOpen={editModalOpen}
                      setEditModalOpen={setEditModalOpen}
                      request={currentRequest}
                      formatDate={formatDate}
                    />
                  )}
                </div>
              ))}
        </div>

        {/* Rejected Requests */}
        <div>
          {requests.filter((request) => request.query_status === "rejected")
            .length > 0 && (
            <div className="flex flex-row items-center text-sm mb-2">
              <div onClick={toggleRejected} className="cursor-pointer">
                {rejectedOpen ? <VscTriangleDown /> : <VscTriangleRight />}
              </div>
              <div className="ml-2 font-semibold">Rejected</div>
            </div>
          )}
          {rejectedOpen &&
            sortedRequests
              .filter((request) => request.query_status === "rejected")
              .map((request, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 py-2.5 px-2 text-center text-xs whitespace-nowrap bg-white rounded-lg shadow-md border-gray-100 border-[1px] my-2"
                >
                  <div className="col-span-1">{request?.id}</div>
                  <div className="col-span-1">
                    {request?.from_user.first_name}
                  </div>
                  <div className="col-span-1">
                    {request?.to_growthtechfirm.startup_name}
                  </div>
                  <div className="col-span-1">
                    {formatDate(request?.created_at)}
                  </div>
                  <div className="col-span-6">
                    {truncateText(request?.user_query.query, 60)}
                  </div>
                  <div className="col-span-1 bg-red-400 text-gray-800 py-1 rounded capitalize">
                    {request?.query_status}
                  </div>
                  <div
                    className="col-span-1 text-blue-500 flex items-center justify-center cursor-pointer"
                    onClick={() => handleEditClick(request)}
                  >
                    <CiEdit size={28} />
                  </div>
                </div>
              ))}
        </div>

        {/* Completed Requests */}
        <div>
          {requests.filter((request) => request.query_status === "completed")
            .length > 0 && (
            <div className="flex flex-row items-center text-sm mb-2">
              <div onClick={toggleCompleted} className="cursor-pointer">
                {completedOpen ? <VscTriangleDown /> : <VscTriangleRight />}
              </div>
              <div className="ml-2 font-semibold">Completed</div>
            </div>
          )}
          {completedOpen &&
            sortedRequests
              .filter((request) => request.query_status === "completed")
              .map((request, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 py-2.5 px-2 text-center text-xs whitespace-nowrap bg-white rounded-lg shadow-md border-gray-100 border-[1px] my-2"
                >
                  <div className="col-span-1">{request?.id}</div>
                  <div className="col-span-1">
                    {request?.from_user.first_name}
                  </div>
                  <div className="col-span-1">
                    {request?.to_growthtechfirm.startup_name}
                  </div>
                  <div className="col-span-1">
                    {formatDate(request?.created_at)}
                  </div>
                  <div className="col-span-6">{request?.user_query.query}</div>
                  <div className="col-span-1  text-gray-800 py-1 rounded capitalize bg-green-400">
                    {request?.query_status}
                  </div>
                  <div
                    className="col-span-1 text-blue-500 flex items-center justify-center cursor-pointer"
                    onClick={() => handleEditClick(request)}
                  >
                    <CiEdit size={28} />
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default MyRequests;
