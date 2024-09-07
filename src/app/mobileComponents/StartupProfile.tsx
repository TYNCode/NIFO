import React, { useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa";
import CryptoJS from "crypto-js";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  setConnectionStatus,
  createPartnerConnect,
  ConnectionStatus,
} from "../redux/features/connection/connectionSlice";
import { IoShareSocialOutline } from "react-icons/io5";
import { fetchPartnerConnectsByOrg } from "../redux/features/connection/connectionSlice";

const StartupProfile = ({ selectedStartup, onBackClick, queryForConnect }) => {
  console.log("queryForConnect", queryForConnect);
  const [loading, setLoading] = useState(false);
  const { connectionStatuses } = useAppSelector(
    (state) => state.partnerConnect
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selectedStartup) {
      dispatch(
        fetchPartnerConnectsByOrg(selectedStartup?.database_info?.startup_id)
      )
        .unwrap()
        .then((response) => {
          if (response.length > 0) {
            dispatch(
              setConnectionStatus({
                startupId: selectedStartup?.database_info?.startup_id,
                status: response[0].request_status as ConnectionStatus,
              })
            );
          } else {
            dispatch(
              setConnectionStatus({
                startupId: selectedStartup.database_info.startup_id,
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

  if (!selectedStartup) {
    return null;
  }

  const connectionStatus =
    connectionStatuses[selectedStartup.database_info.startup_id] || "Connect";

  const handleButtonClick = () => {
    if (connectionStatus === "Connect") {
      setLoading(true);
      const payload = {
        consultant_email: "consultant@example.com",
        query: queryForConnect,
        request_status: "requested",
        requested_org: selectedStartup.database_info.startup_id,
      };

      dispatch(createPartnerConnect(payload))
        .unwrap()
        .then(() => {
          dispatch(
            setConnectionStatus({
              startupId: selectedStartup.database_info.startup_id,
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

  const handleShareClick = async (startupId: number) => {
    const secretKey: string = "secret-key";
    const startupIdStr: string = startupId.toString();
    let encryptedStartupId: any;

    encryptedStartupId = CryptoJS.AES.encrypt(
      startupIdStr,
      secretKey
    ).toString();
    const encodedEncryptedStartupId = encodeURIComponent(encryptedStartupId);

    const shareUrl: string = `${window.location.href}/startups/${encodedEncryptedStartupId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedStartup?.name,
          url: shareUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Web Share API not supported");
    }
  };

  const renderIfAvailable = (label: string, value: any) => {
    if (!value) return null;
    return (
      <div className="flex flex-col leading-7 tracking-wide">
        <div className="font-semibold">{label}</div>
        <div>{value}</div>
      </div>
    );
  };

  return (
    <div className="mx-6 my-4 flex flex-col gap-2 pb-32">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <div onClick={onBackClick}>
            <FaAngleLeft size={24} />
          </div>
          <div className="uppercase font-medium text-blue-500 text-lg">
            {selectedStartup.name}
          </div>
        </div>

        <div className="flex gap-4 items-center justify-center">
          <div
            className="text-gray-500"
            onClick={() =>
              handleShareClick(selectedStartup?.database_info?.startup_id)
            }
          >
            <IoShareSocialOutline size={26} />
          </div>

          <div>
            <button
              className={`flex justify-center items-center px-4 py-1.5 capitalize ${
                connectionStatus === "Connect"
                  ? "bg-yellow-400 hover:bg-yellow-500 cursor-pointer"
                  : "bg-red-400 cursor-default"
              } rounded-md text-white font-semibold lg:w-5/12 xl:text-xl xl:w-5/12`}
              onClick={handleButtonClick}
              disabled={connectionStatus !== "Connect" || loading}
            >
              {loading ? "Processing..." : connectionStatus}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 leading-7 tracking-wide my-6 mx-3">
        {renderIfAvailable(
          "Description",
          selectedStartup?.database_info?.startup_description
        )}

        <div className="flex flex-col gap-4 shadow-inner text-sm bg-blue-100 p-4 rounded-lg">
          <div className="flex justify-between gap-3 w-full">
            {renderIfAvailable(
              "Industry",
              selectedStartup?.database_info?.startup_industry
            )}
            {renderIfAvailable(
              "Technology",
              selectedStartup?.database_info?.startup_technology
            )}
          </div>
          <div className="flex justify-between gap-3 w-full">
            {renderIfAvailable(
              "Country",
              selectedStartup?.database_info?.startup_country
            )}
            {renderIfAvailable(
              "Funding Stage",
              selectedStartup?.database_info?.startup_company_stage
            )}
          </div>
        </div>

        {renderIfAvailable(
          "Solution",
          selectedStartup?.database_info?.startup_solutions
        )}
        {renderIfAvailable(
          "Usecases",
          selectedStartup?.database_info?.startup_usecases
        )}
      </div>
    </div>
  );
};

export default StartupProfile;
