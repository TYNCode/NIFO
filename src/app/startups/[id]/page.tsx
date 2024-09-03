"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import MobileHeader from "../../mobileComponents/MobileHeader";
import BottomBar from "../../mobileComponents/BottomBar";
import { useParams } from "next/navigation";
import CryptoJS from "crypto-js";
import { IoShareSocialOutline } from "react-icons/io5";

const StartupDetails = () => {
  const [activeSpotlight, setActiveSpotlight] = useState(false);
  const [activeTab, setActiveTab] = useState("Spotlight");
  const [startupData, setStartupData] = useState(null);

  const params = useParams();
  let startupId = params.id;

  // Ensure startupId is a string
  if (Array.isArray(startupId)) {
    startupId = startupId[0];
  }

  if (typeof startupId !== "string") {
    console.error("Invalid ID in URL");
    return null;
  }

  const secretKey = "urlencrypt";
  const decodedEncryptedStartupId = decodeURIComponent(startupId);

  const decryptStartupId = (encryptedId, key) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedId, key);
      const decryptedId = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedId;
    } catch (error) {
      console.error("Error decrypting startup ID:", error);
      return null;
    }
  };

  const decryptedStartupId = decryptStartupId(
    decodedEncryptedStartupId,
    secretKey
  );

  const fetchStartupDetails = async (id) => {
    try {
      const res = await axios.get(
        `https://nifo.theyellow.network/api/prompt/startups/${id}/`
      );
      setStartupData(res.data);
      console.log("Response:", res);
    } catch (error) {
      console.error("Error fetching startup details:", error);
    }
  };

  useEffect(() => {
    if (decryptedStartupId) {
      fetchStartupDetails(decryptedStartupId);
    }
  }, [decryptedStartupId]);

  console.log("Startup Data:", startupData);

  const handleShareClick = async () => {
    const encryptStartupId = (id, key) => {
      try {
        const encryptedId = CryptoJS.AES.encrypt(id.toString(), key).toString();
        return encodeURIComponent(encryptedId);
      } catch (error) {
        console.error("Error encrypting startup ID:", error);
        return null;
      }
    };

    const encryptedStartupId = encryptStartupId(
      startupData?.startup_id,
      secretKey
    );

    if (navigator.share && encryptedStartupId) {
      try {
        await navigator.share({
          title: startupData?.startup_name,
          text: startupData?.startup_description,
          url: `${window.location.origin}/startups/${encryptedStartupId}`,
        });
        console.log("Successfully shared");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Web Share API not supported");
    }
  };

  return (
    <div>
      <div>
        <MobileHeader />
      </div>

      {/* company profile component */}
      <div className="mx-6 my-4 flex flex-col gap-2 pb-32">
        <>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <div className="uppercase font-medium text-blue-500 text-lg">
                {startupData?.startup_name}
              </div>
            </div>

            <div className="flex gap-4 items-center justify-center">
              {/* Share button */}
              <div
                className="text-gray-500 cursor-pointer"
                onClick={handleShareClick}
              >
                <IoShareSocialOutline size={26} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5 leading-7 tracking-wide my-6 mx-3">
            <div>{startupData?.startup_description}</div>
            <div className="flex flex-col gap-4 shadow-inner text-sm bg-blue-100 p-4 rounded-lg">
              <div className="flex justify-between gap-3 w-full">
                <div className="flex flex-col w-1/2 leading-7 tracking-wide">
                  <div className="font-semibold">Industry</div>
                  <div>{startupData?.startup_industry}</div>
                </div>
                <div className="flex flex-col w-1/2 leading-7 tracking-wide">
                  <div className="font-semibold">Technology</div>
                  <div>{startupData?.startup_technology}</div>
                </div>
              </div>
              <div className="flex justify-between gap-3 w-full">
                <div className="flex flex-col w-1/2 leading-7 tracking-wide">
                  <div className="font-semibold">Country</div>
                  <div>{startupData?.startup_country}</div>
                </div>
                <div className="flex flex-col w-1/2 leading-7 tracking-wide">
                  <div className="font-semibold">Funding Stage</div>
                  <div>{startupData?.startup_company_stage}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col leading-7 tracking-wide">
              <div className="font-semibold">Solution</div>
              <div>{startupData?.startup_solutions}</div>
            </div>
            <div className="flex flex-col leading-7 tracking-wide">
              <div className="font-semibold">Usecases</div>
              <div>{startupData?.startup_usecases}</div>
            </div>
          </div>
        </>
      </div>

      <BottomBar setActiveTab={setActiveTab} activeTab={activeTab} />
    </div>
  );
};

export default StartupDetails;
