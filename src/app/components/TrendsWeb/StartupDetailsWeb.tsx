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
    if (!value || value === "None") return null;
    return (
      <div className="flex flex-col leading-7 tracking-wide">
        <div className="font-semibold">{label}</div>
        <div>{value}</div>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-start mt-10">
      <div className="bg-white flex flex-col shadow-lg w-[400px] xl:w-[600px] h-[75vh] rounded overflow-hidden">
        {/* Header with Connect Button */}
        <div className="bg-blue-800 text-white flex flex-col gap-3 sticky top-0 z-50">
          <div className="flex justify-between items-center px-4 py-2">
            <div className="font-semibold text-xl">{startupDetails?.startup_name}</div>
            <div className="flex gap-4 justify-center items-center">
            <div
              className="bg-blue-500 text-white flex gap-2 px-3 py-1 rounded-md cursor-pointer"
              onClick={handleButtonClick}
            >
              <div>{loading ? "Loading.." : connectionStatus}</div>
            </div>
            <div className="cursor-pointer" onClick={handleClose}>
              <IoClose size={23} />
            </div>
            </div>
          </div>
          <div className="text-base px-4 pb-2 leading-5">
            {selectedStartup?.description || "No description available"}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex flex-col gap-4 px-5 pb-6 overflow-y-auto scrollbar-thin scrollbar-track-indigo-50 scrollbar-thumb-blue-400 text-sm xl:text-base">
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
                {renderIfAvailable("Usecases", startupDetails?.startup_usecases)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartupDetailsWeb;
