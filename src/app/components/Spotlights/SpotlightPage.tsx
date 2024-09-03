import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoShareSocialOutline } from "react-icons/io5";
import MobileHeader from "../../mobileComponents/MobileHeader";
import {
  createPartnerConnect,
  fetchPartnerConnectsByOrg,
  setConnectionStatus,
} from "../../redux/features/connection/connectionSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { ConnectionStatus } from "../../redux/features/connection/connectionSlice";

const SpotlightPage = ({ selectedSpotlight, handleSpotlightShare }) => {
  console.log("selectedSpotlight", selectedSpotlight);

  const dispatch = useAppDispatch();
  const connectionStatuses = useAppSelector(
    (state) => state.partnerConnect.connectionStatuses
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedSpotlight?.spotlight_startup_id) {
      dispatch(
        fetchPartnerConnectsByOrg(selectedSpotlight.spotlight_startup_id)
      ).then((action) => {
        if (fetchPartnerConnectsByOrg.fulfilled.match(action)) {
          const connections = action.payload;
          const status: ConnectionStatus =
            connections.length > 0
              ? (connections[0].request_status as ConnectionStatus)
              : "Connect";

          dispatch(
            setConnectionStatus({
              startupId: selectedSpotlight.spotlight_startup_id,
              status: status,
            })
          );
        }
      });
    }
  }, [dispatch, selectedSpotlight?.spotlight_startup_id]);

  const handleConnectOfSpotlight = async () => {
    const connectionStatus =
      connectionStatuses[selectedSpotlight?.spotlight_startup_id];

    if (connectionStatus === null || connectionStatus === "Connect") {
      setIsLoading(true); 
      try {
        await dispatch(
          createPartnerConnect({
            consultant_email: "consultant@example.com",
            query: "Spotlight connect: From the spotlight connect", 
            request_status: "requested", 
            requested_org: selectedSpotlight?.spotlight_startup_id,
          })
        );
        dispatch(
          setConnectionStatus({
            startupId: selectedSpotlight.spotlight_startup_id,
            status: "requested",
          })
        );
      } catch (error) {
        console.error("Spotlight Connection Error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <div>
        <MobileHeader />
      </div>

      <div>
        <Image
          src="/thirdai-mobile.png"
          width={540}
          height={200}
          alt="spotlight"
        />
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2 px-6 py-4 bg-gray-100">
        <div className="leading-9 tracking-wide line-clamp-4 font-medium">
          {selectedSpotlight.spotlight_title}
        </div>
        <div className="font-light text-sm">{selectedSpotlight.created_at}</div>
      </div>

      {/* Export Icons */}
      <div className="flex justify-between px-6 py-4">
        <div className="flex gap-8">
          {/* Share button */}
          <div
            className="flex flex-col gap-1 text-xs items-center cursor-pointer"
            onClick={handleSpotlightShare}
          >
            <div>
              <IoShareSocialOutline size={24} />
            </div>
            <div>Share</div>
          </div>
        </div>

        {/* Connect button */}
        <div
          className="bg-blue-400 rounded text-sm uppercase font-medium p-2 text-white flex items-center cursor-pointer"
          onClick={handleConnectOfSpotlight}
        >
          {isLoading
            ? "Connecting..."
            : connectionStatuses[selectedSpotlight?.spotlight_startup_id] ||
              "Connect"}
        </div>
      </div>

      {/* Content */}
      <div className="mx-10 flex flex-col gap-6 leading-8 py-4">
        {selectedSpotlight.spotlight_content.map((content, index) => (
          <div key={index}>
            <span className="font-semibold">{content.heading}</span>{" "}
            {content.body}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpotlightPage;
