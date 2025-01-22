import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchPartnerConnectsMade,
  fetchPartnerConnectsReceived,
  updatePartnerConnectStatus,
} from "../redux/features/connection/connectionSlice";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

const ConnectionsMobile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { connectionsMade, connectionsReceived, loading, error } =
    useAppSelector((state) => state.partnerConnect);

  const [selectedStatus, setSelectedStatus] = useState<{
    [key: number]: "connected" | "rejected" | null;
  }>({});

  useEffect(() => {
    dispatch(fetchPartnerConnectsMade());
    dispatch(fetchPartnerConnectsReceived());
  }, [dispatch]);

  const handleUpdateStatus = async (
    id: number,
    status: "connected" | "rejected"
  ) => {
   
    await dispatch(updatePartnerConnectStatus({ id, request_status: status }));

    
    setSelectedStatus((prevStatus) => ({
      ...prevStatus,
      [id]: status,
    }));

  
    dispatch(fetchPartnerConnectsMade());
    dispatch(fetchPartnerConnectsReceived());
  };

  if (loading) {
    return <div>Loading connections...</div>;
  }

  if (error) {
    return <div>Error loading connections: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">My Connections</h2>

      {/* Section for Requests Made */}
      <div className="mb-6">
        <h3 className="text-md font-semibold">Requests Made</h3>
        {connectionsMade && connectionsMade.length === 0 ? (
          <div>No requests made.</div>
        ) : (
          <ul className="space-y-4">
            {connectionsMade?.map((connection: any) => (
              <li
                key={connection.id}
                className="p-4 bg-gray-100 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-base font-medium">
                      Requested:{" "}
                      {connection?.requested_org?.startup_name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      Status: {connection.request_status}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Section for Requests Received */}
      <div>
        <h3 className="text-md font-semibold">Requests Received</h3>
        {connectionsReceived && connectionsReceived.length === 0 ? (
          <div>No requests received.</div>
        ) : (
          <ul className="space-y-4">
            {connectionsReceived?.map((connection: any) => (
              <li
                key={connection.id}
                className="p-4 bg-gray-100 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-center">
                  <div className="">
                    <p className="text-base font-medium">
                      {connection?.user?.organization?.startup_name || "N/A"}
                    </p>
                    {/* <p className="text-sm text-gray-600 capitalize">
                      From: {connection?.user?.first_name || "Requester"}
                    </p> */}
                    <p className="text-sm text-gray-600 capitalize">
                      Status: {connection.request_status}
                    </p>
                  </div>

                  {/* Approve/Reject buttons */}
                  <div className="space-x-4">
                    {connection.request_status === "requested" && (
                      <>
                        <button
                          className={`${
                            selectedStatus[connection.id] === "connected"
                              ? "bg-green-500"
                              : "bg-green-300"
                          } text-white px-1 py-1 rounded hover:bg-green-500 transition-all duration-300`}
                          onClick={() =>
                            handleUpdateStatus(connection.id, "connected")
                          }
                        >
                          <FaCheck size={18} />
                        </button>
                        <button
                          className={`${
                            selectedStatus[connection.id] === "rejected"
                              ? "bg-red-500"
                              : "bg-red-400"
                          } text-white px-1 py-1 rounded transition-all hover:bg-red-500 duration-300`}
                          onClick={() =>
                            handleUpdateStatus(connection.id, "rejected")
                          }
                        >
                          <RxCross2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConnectionsMobile;
