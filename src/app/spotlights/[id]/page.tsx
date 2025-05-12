'use client'
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { IoShareSocialOutline } from "react-icons/io5";
import { MdOutlineLanguage, MdOutlinePhoneInTalk } from "react-icons/md";
import { FaLinkedinIn } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchSpotlightById } from "../../redux/features/spotlight/spotlightSlice";
import { decryptURL } from "../../utils/shareUtils";
import shareHook from "../../redux/customHooks/shareHook";
import LeftFrame from "../../components/LeftFrame/LeftFrame";

const SpotlightDetail = () => {
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

  const renderField = (field) => {
    if (!field) return null;
    if (typeof field === "object") {
      return (
        <div className="flex flex-col gap-1">
          {field.heading && <div className="text-lg font-semibold text-gray-800">{field.heading}</div>}
          {field.body && <div className="text-gray-600 text-sm">{field.body}</div>}
        </div>
      );
    }
    return <p className="text-gray-600 text-sm">{field}</p>;
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!selectedSpotlight) return <div className="text-center mt-10">No Spotlight Found</div>;

  return (
    <main className="flex flex-row w-full h-screen">
      {/* Left Sidebar */}
      <div className="w-[21%]">
        <LeftFrame />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-[#F4FCFF] px-6 py-10 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Weekly Startup Spotlight</h1>
        </div>

        {/* Spotlight Summary Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <img
              src={selectedSpotlight.logo_url || "/default-image.png"}
              alt="Startup Logo"
              className="w-16 h-16 rounded-xl object-contain border"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{selectedSpotlight.spotlight_title}</h2>
              {selectedSpotlight.spotlight_category && (
                <span className="inline-block bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 mt-2 rounded-full">
                  {selectedSpotlight.spotlight_category}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-2 md:mt-0 flex-wrap">
            <button className="bg-[#0070C0] hover:bg-[#005ea6] text-white px-4 py-2 rounded-xl text-sm font-medium">
              + Connect
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center bg-blue-100 text-blue-600 p-2 rounded-xl hover:bg-blue-200"
            >
              <IoShareSocialOutline size={18} />
            </button>
            <button className="flex items-center justify-center bg-blue-100 text-blue-600 p-2 rounded-xl hover:bg-blue-200">
              <MdOutlineLanguage size={18} />
            </button>
            <button className="flex items-center justify-center bg-blue-100 text-blue-600 p-2 rounded-xl hover:bg-blue-200">
              <MdOutlinePhoneInTalk size={18} />
            </button>
            <button className="flex items-center justify-center bg-blue-100 text-blue-600 p-2 rounded-xl hover:bg-blue-200">
              <FaLinkedinIn size={18} />
            </button>
          </div>
        </div>

        {/* Problem Addressed */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Problem Addressed</h3>
          {renderField(selectedSpotlight.problem_address)}
        </div>

        {/* Technology Leveraged */}
        <div className="mt-6 bg-[#E9F4FB] border border-blue-100 p-4 rounded-2xl">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Technology Leveraged</h4>
          {Array.isArray(selectedSpotlight.technology_leveraged) ? (
            <div className="flex flex-col gap-4">
              {selectedSpotlight.technology_leveraged.map((tech, index) => (
                <div key={index} className="bg-white p-3 rounded-xl border">
                  {renderField(tech)}
                </div>
              ))}
            </div>
          ) : (
            renderField(selectedSpotlight.technology_leveraged)
          )}
        </div>

        {/* Use Case and Impact */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow-md rounded-2xl p-4">
            <h4 className="text-md font-semibold text-gray-700 mb-2">Use Case</h4>
            {renderField(selectedSpotlight.use_case)}
          </div>
          <div className="bg-white shadow-md rounded-2xl p-4">
            <h4 className="text-md font-semibold text-gray-700 mb-2">Impact</h4>
            {renderField(selectedSpotlight.impact)}
          </div>
        </div>
      </div>
    </main>
  );
};

export default SpotlightDetail;
