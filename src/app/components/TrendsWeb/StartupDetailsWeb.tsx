import React, { useEffect, useState } from "react";
import { BiLink, BiSend } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  setConnectionStatus,
  createPartnerConnect,
  ConnectionStatus,
  fetchPartnerConnectsByOrg,
} from "../../redux/features/connection/connectionSlice";

const StartupDetailsWeb = ({ selectedStartup, handleClose }) => {
  const [startupDetails, setStartupDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const { connectionStatuses } = useAppSelector((state) => state.partnerConnect);
  const dispatch = useAppDispatch();

  // Fetch partner connection status when component mounts or selectedStartup changes
  useEffect(() => {
    if (selectedStartup) {
      dispatch(fetchPartnerConnectsByOrg(selectedStartup?.startup_id))
        .unwrap()
        .then((response) => {
          if (response.length > 0) {
            dispatch(
              setConnectionStatus({
                startupId: selectedStartup?.startup_id,
                status: response[0].request_status as ConnectionStatus,
              })
            );
          } else {
            dispatch(
              setConnectionStatus({
                startupId: selectedStartup?.startup_id,
                status: "Connect",
              })
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching connections:", error);
        });
    }
  }, [selectedStartup, dispatch]);

  // Fetch the startup details from the API
  useEffect(() => {
    if (selectedStartup?.startup_id) {
      const fetchStartupDetails = async () => {
        try {
          const response = await fetch(
            `https://tyn-server.azurewebsites.net/directorysearch/companyview/${selectedStartup.startup_id}`
          );
          const data = await response.json();
          setStartupDetails(data);
        } catch (error) {
          console.error("Error fetching startup details:", error);
        }
      };
      fetchStartupDetails();
    }
  }, [selectedStartup]);

  const connectionStatus =
    connectionStatuses[selectedStartup?.startup_id] || "Connect";

  const handleButtonClick = () => {
    if (connectionStatus === "Connect") {
      setLoading(true);
      const payload = {
        consultant_email: "consultant@example.com",
        query: "From trends of Laptop",
        request_status: "requested",
        requested_org: selectedStartup?.startup_id,
      };

      dispatch(createPartnerConnect(payload))
        .unwrap()
        .then(() => {
          dispatch(
            setConnectionStatus({
              startupId: selectedStartup?.startup_id,
              status: "requested",
            })
          );
        })
        .catch((error) => {
          console.error("Error creating partner connect:", error);
        })
        .finally(() => setLoading(false));
    }
  };

  const renderIfAvailable = (label, value) => {
    if (!value || value === "None") return null; // Ensure we don't display empty or 'None' values
    return (
      <div className="flex flex-col leading-7 tracking-wide">
        <div className="font-semibold">{label}</div>
        <div>{value}</div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex justify-center items-start mt-3">
    <div className="bg-white flex flex-col shadow-lg w-[450px] xl:w-[650px] 2xl:w-[850px] h-[85vh] max-h-[85vh]">
      {/* Header with Connect Button */}
      <div className="bg-white p-2">
      <div className="bg-blue-800 text-white flex flex-col gap-3 w-full sticky top-0 z-50">
        <div className="flex justify-between px-4 py-2">
          <div className="font-semibold text-xl">{startupDetails?.startup_name}</div>
          <div
            className="bg-blue-500 text-white flex gap-4 mx-6 px-3 capitalize py-1 rounded-md justify-center items-center w-max cursor-pointer"
            onClick={handleButtonClick}
          >
            <div>{loading ? "Loading.." : connectionStatus}</div>
          </div>
          <div className="absolute right-2 top-2 cursor-pointer" onClick={handleClose}>
            <IoClose size={23} />
          </div>
        </div>
        <div className="text-base px-4 pb-2 leading-5">
          {selectedStartup?.description || "No description available"}
        </div>
      </div>
      </div>
  
      {/* Scrollable Content */}
      <div className="flex flex-col gap-4 px-4 pb-6 h-full text-sm tracking-tighter xl:tracking-normal xl:text-base overflow-y-scroll  scrollbar-thin scrollbar-track-indigo-50 scrollbar-thumb-blue-400">
        {startupDetails && (
          <>
            <div className="grid grid-cols-2 gap-4 mt-5">
              {renderIfAvailable("Analyst Rated", startupDetails?.startup_analyst_rating)}
              {renderIfAvailable("Industry", startupDetails?.startup_industry)}
              {renderIfAvailable("Customers", startupDetails?.startup_customers)}
              {renderIfAvailable("Technology", startupDetails?.startup_technology)}
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              {renderIfAvailable("Country", startupDetails?.startup_country)}
              {renderIfAvailable("Company Stage", startupDetails?.startup_company_stage)}
              {renderIfAvailable("Solutions", startupDetails?.startup_solutions)}
            </div>
          </>
        )}
      </div>
    </div>
  </div>
  
  
  );
};

export default StartupDetailsWeb;
