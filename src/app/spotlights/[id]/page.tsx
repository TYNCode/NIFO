"use client";

import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { IoShareSocialOutline } from "react-icons/io5";
import { MdOutlineLanguage, MdOutlinePhoneInTalk } from "react-icons/md";
import { FaLinkedinIn } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchSpotlightById } from "../../redux/features/spotlight/spotlightSlice";
import { decryptURL } from "../../utils/shareUtils";
import shareHook from "../../redux/customHooks/shareHook";
import LeftFrame from "../../components/LeftFrame/LeftFrame"; // Update your path if needed

const SelectSpotlight = () => {
  const params = useParams();
  const dispatch = useAppDispatch();

  let encodedId = params.id;
  if (Array.isArray(encodedId)) encodedId = encodedId[0];
  if (typeof encodedId !== "string") return <div>Invalid ID</div>;

  const decryptedId = decryptURL(encodedId);
  const { selectedSpotlight, loading, error } = useAppSelector((state) => state.spotlight);

  useEffect(() => {
    if (decryptedId) {
      dispatch(fetchSpotlightById(Number(decryptedId)));
    }
  }, [decryptedId, dispatch]);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/spotlights/${encodedId}`;
    shareHook(shareUrl);
  };

  const renderField = (field: any) => {
    if (!field) return null;
    if (typeof field === "object") {
      return (
        <div className="flex flex-col gap-1">
          {field.heading && <div className="text-lg font-semibold text-gray-800">{field.heading}</div>}
          {field.body && <div className="text-gray-600">{field.body}</div>}
        </div>
      );
    }
    return <p className="text-gray-600">{field}</p>;
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!selectedSpotlight) return <div className="text-center mt-10">No Spotlight Found</div>;

  return (
    <main className="flex flex-row w-full h-screen">
      {/* Left Sidebar */}
      <div className="">
        <LeftFrame currentRoute="/spotlights" />
      </div>

      {/* Main Spotlight Details Content */}
      <div className="flex-1 flex flex-col w-full h-full p-6 bg-[#F8FBFF] overflow-y-auto">
        <h1 className="text-2xl font-semibold text-gray-700 mb-6">Weekly Startup Spotlight</h1>

        <div className="flex flex-col bg-white rounded-md shadow-md p-6">

          {/* Top Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <img
                src={selectedSpotlight.logo_url || "/default-image.png"}
                alt="logo"
                className="h-16 w-16 object-contain rounded-md border"
              />
              <div>
                <div className="text-2xl font-semibold">{selectedSpotlight.spotlight_title}</div>
                {selectedSpotlight.spotlight_category && (
                  <span className="inline-block text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full mt-2">
                    {selectedSpotlight.spotlight_category}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button className="flex items-center gap-2 bg-[#0070C0] text-white px-4 py-2 rounded-md text-sm">
                + Connect
              </button>
              <button
                className="flex items-center gap-2 bg-blue-100 text-blue-500 px-3 py-2 rounded-md text-sm"
                onClick={handleShare}
              >
                <IoShareSocialOutline size={18} />
              </button>
              <button className="flex items-center gap-2 bg-blue-100 text-blue-500 px-3 py-2 rounded-md text-sm">
                <MdOutlineLanguage size={18} />
              </button>
              <button className="flex items-center gap-2 bg-blue-100 text-blue-500 px-3 py-2 rounded-md text-sm">
                <MdOutlinePhoneInTalk size={18} />
              </button>
              <button className="flex items-center gap-2 bg-blue-100 text-blue-500 px-3 py-2 rounded-md text-sm">
                <FaLinkedinIn size={18} />
              </button>
            </div>
          </div>

          {/* Problem Address */}
          <div className="mb-6">
            <h2 className="font-bold text-gray-700 mb-2">Problem Address</h2>
            {renderField(selectedSpotlight.problem_address)}
          </div>

          {/* Technology Leveraged */}
          <div className="mb-6">
            <h2 className="font-bold text-gray-700 mb-2">Technology Leveraged</h2>
            {Array.isArray(selectedSpotlight.technology_leveraged) ? (
              <div className="flex flex-col gap-4">
                {selectedSpotlight.technology_leveraged.map((tech: any, index: number) => (
                  <div key={index} className="border p-3 rounded-md bg-[#F0F6FF]">
                    {renderField(tech)}
                  </div>
                ))}
              </div>
            ) : (
              renderField(selectedSpotlight.technology_leveraged)
            )}
          </div>

          {/* Use Case and Impact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-bold text-gray-700 mb-2">Use Case</h2>
              {renderField(selectedSpotlight.use_case)}
            </div>
            <div>
              <h2 className="font-bold text-gray-700 mb-2">Impact</h2>
              {renderField(selectedSpotlight.impact)}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default SelectSpotlight;
