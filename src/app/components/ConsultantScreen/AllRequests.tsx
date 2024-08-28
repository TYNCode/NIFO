import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { VscTriangleRight, VscTriangleDown } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import AssignToMe from "./AssignToMe";
import axios from "axios";
import { MdAssignmentInd } from "react-icons/md";
import { BiSortAlt2 } from "react-icons/bi";
import { CiEdit } from "react-icons/ci";

const AllRequests = ({
  toggleNewlyAdded,
  newlyAddedOpen,
  toggleInProgress,
  inProgressOpen,
  toggleCompleted,
  completedOpen,
  isSuperUser,
}) => {
  const [assignToMeOpen, setAssignToMeOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [sortOrderRequestId, setSortOrderRequestId] = useState("ascending");
  const [sortOrderDate, setSortOrderDate] = useState("ascending");
  const [activeSort, setActiveSort] = useState("id");
  const router = useRouter();

  useEffect(() => {
    axios
      .get("https://nifo.theyellow.network/api/partnerconnect/")
      .then((response) => {
        setRequests(response.data);
        console.log("Fetched requests:", response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const updateAssignedStatus = (id, status, assignedTo) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id
          ? { ...request, assigned_status: status, assigned_to: assignedTo }
          : request
      )
    );
  };

  const handleBackButton = () => {
    router.push("/");
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

  const getSortedRequests = () => {
    if (activeSort === "date") {
      return sortRequestsByDate(requests);
    } else {
      return sortRequestsById(requests);
    }
  };

  const sortedRequests = getSortedRequests();

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  const handleAssignToMe = (request) => {
    setCurrentRequest(request);
    setAssignToMeOpen(true);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center text-2xl text-blue-400 gap-4 mb-4">
        <IoIosArrowBack
          size={23}
          onClick={handleBackButton}
          className="cursor-pointer"
        />
        <div>User Request Management - All Request</div>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-10 gap-4 py-2.5 px-2 text-center uppercase text-sm text-gray-400 font-bold my-2 bg-gray-100">
          <div className="flex flex-row justify-center items-center">
            <div>Request ID</div>
            <div className="cursor-pointer" onClick={toggleSortOrderRequestId}>
              <BiSortAlt2 size={20} />
            </div>
          </div>
          <div className="flex flex-row justify-center items-center">
            <div>From</div>
          </div>
          <div>Organization</div>
          <div className="flex flex-row justify-center items-center">
            <div>To</div>
          </div>
          <div className="flex flex-row justify-center items-center">
            <div>When</div>
            <div onClick={toggleSortOrderDate} className="cursor-pointer">
              <BiSortAlt2 size={20} />
            </div>
          </div>
          <div className="col-span-3">Use Case</div>
          <div>Status</div>
          <div>Assign</div>
        </div>

        <div>
          <div className="flex flex-row items-center text-sm mb-2">
            <div onClick={toggleNewlyAdded} className="cursor-pointer">
              {newlyAddedOpen ? <VscTriangleDown /> : <VscTriangleRight />}
            </div>
            <div className="ml-2 font-semibold">Newly Added</div>
          </div>
          {newlyAddedOpen &&
            sortedRequests
              .filter((request) => request.query_status === "requested")
              .map((request, index) => (
                <div
                  key={index}
                  className="grid grid-cols-10 gap-4 py-2.5 px-2 text-center text-xs whitespace-nowrap bg-white rounded-lg shadow-md border-gray-100 border-[1px] my-2"
                >
                  <div>{request?.id}</div>
                  <div>{request?.from_user?.first_name}</div>
                  <div>{request?.from_user?.organization_name}</div>
                  <div>{request?.to_growthtechfirm?.startup_name}</div>
                  <div>{formatDate(request?.created_at)}</div>
                  <div className="col-span-3">
                    {truncateText(request?.user_query?.query, 60)}
                  </div>
                  <div className="bg-zinc-300 text-gray-800 py-1 rounded capitalize">
                    {request?.query_status}
                  </div>
                  <div>
                    {request?.assigned_status === false ? (
                      isSuperUser ? (
                        <button
                          className="flex items-center justify-center bg-blue-500 text-white py-1 px-4 rounded w-full"
                          onClick={() => handleAssignToMe(request)}
                        >
                          <MdAssignmentInd className="mr-1" size={16} /> Assign
                        </button>
                      ) : (
                        <button
                          className="bg-blue-500 text-white py-1 px-4 rounded"
                          onClick={() => handleAssignToMe(request)}
                        >
                          Assign Self
                        </button>
                      )
                    ) : isSuperUser ? (
                      <div className="bg-yellow-400 text-white py-1 px-4 rounded flex flex-row justify-between items-center">
                        <div>{request?.assigned_to?.first_name}</div>
                        <div
                          className="cursor-pointer"
                          onClick={() => handleAssignToMe(request)}
                        >
                          <CiEdit size={23} />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-400 text-white py-1 px-4 rounded">
                        {request?.assigned_to?.first_name}
                      </div>
                    )}

                    {assignToMeOpen && currentRequest?.id === request.id ? (
                      <AssignToMe
                        assignToMeOpen={assignToMeOpen}
                        setAssignToMeOpen={setAssignToMeOpen}
                        request={currentRequest}
                        updateAssignedStatus={updateAssignedStatus}
                        isSuperUser={isSuperUser}
                      />
                    ) : null}
                  </div>
                </div>
              ))}
        </div>

        <div>
          {requests.filter((request) => request.query_status === "in_progress")
            .length > 0 && (
            <div className="flex flex-row items-center text-sm mb-2">
              <div onClick={toggleInProgress} className="cursor-pointer">
                {inProgressOpen ? <VscTriangleDown /> : <VscTriangleRight />}
              </div>
              <div className="ml-2 font-semibold">In Progress</div>
            </div>
          )}
          {inProgressOpen &&
            sortedRequests
              .filter((request) => request.query_status === "in_progress")
              .map((request, index) => (
                <div
                  key={index}
                  className="grid grid-cols-10 gap-4 py-2.5 px-2 text-center text-xs whitespace-nowrap bg-white rounded-lg shadow-md border-gray-100 border-[1px] my-2"
                >
                  <div>{request?.id}</div>
                  <div>{request?.from_user?.first_name}</div>
                  <div>{request?.to_growthtechfirm?.startup_name}</div>
                  <div>{formatDate(request?.created_at)}</div>
                  <div className="col-span-4">
                    {truncateText(request?.user_query?.query, 60)}
                  </div>
                  <div className="bg-zinc-300 text-gray-800 py-1 rounded capitalize">
                    {request?.query_status}
                  </div>
                  <div className="bg-yellow-400 text-white py-1 px-4 rounded">
                    {request?.assigned_to?.first_name}
                  </div>
                </div>
              ))}
        </div>

        <div>
          {requests.filter(
            (request) =>
              request.query_status === "completed" ||
              request.query_status === "rejected"
          ).length > 0 && (
            <div className="flex flex-row items-center text-sm mb-2">
              <div onClick={toggleCompleted} className="cursor-pointer">
                {completedOpen ? <VscTriangleDown /> : <VscTriangleRight />}
              </div>
              <div className="ml-2 font-semibold">Completed</div>
            </div>
          )}

          {completedOpen &&
            sortedRequests
              .filter(
                (request) =>
                  request.query_status === "completed" ||
                  request.query_status === "rejected"
              )
              .map((request, index) => (
                <div
                  key={index}
                  className="grid grid-cols-10 gap-4 py-2.5 px-2 text-center text-xs whitespace-nowrap bg-white rounded-lg shadow-md border-gray-100 border-[1px] my-2"
                >
                  <div>{request?.id}</div>
                  <div>{request?.from_user?.first_name}</div>
                  <div>{request?.to_growthtechfirm?.startup_name}</div>
                  <div>{formatDate(request?.created_at)}</div>
                  <div className="col-span-4">
                    {truncateText(request?.user_query?.query, 60)}
                  </div>
                  <div className="bg-zinc-300 text-gray-800 py-1 rounded capitalize">
                    {request?.query_status}
                  </div>
                  <div className="bg-yellow-400 text-white py-1 px-4 rounded">
                    {request?.assigned_to?.first_name}
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default AllRequests;
