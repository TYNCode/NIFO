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
    <div className="w-[800px] min-h-[600px] flex justify-center items-center ">
      <div className="bg-white flex flex-col gap-4 justify-center items-center shadow-lg overflow-auto w-full p-4">
        <div className="bg-blue-800 flex flex-col gap-3 w-full">
          <div className="absolute right-2 text-white flex justify-end cursor-pointer mt-3 mr-3" onClick={handleClose}>
            <IoClose size={23} />
          </div>
        <div className="flex justify-between mx-2 mt-12">
           
          <div className="text-white font-semibold text-xl mt-2">
            {startupDetails?.startup_name}
          </div>

          <div className="bg-blue-500 text-white flex gap-4 px-3 py-1 rounded-md justify-center items-center w-max mt-2">
            <div onClick={handleButtonClick}>Connect</div>
            <BiSend />
          </div>
        </div>



          <div className="text-base text-white px-2 pb-2">
            {selectedStartup?.description || "No description available"}
          </div>
        </div>

        <div className="flex flex-col gap-4 px-2 pb-6 overflow-y-auto w-full">
          {startupDetails && (
            <>
              <div className="grid grid-cols-2 gap-4">
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
