"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IoShareSocialOutline } from "react-icons/io5";
import { MdOutlineLanguage, MdOutlinePhoneInTalk } from "react-icons/md";
import { FaLinkedinIn, FaArrowLeft, FaExternalLinkAlt, FaEnvelope, FaStar, FaGlobe, FaUsers, FaRocket, FaBuilding, FaChartLine } from "react-icons/fa";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { decryptURL } from "../../utils/shareUtils";
import shareHook from "../../redux/customHooks/shareHook";
import LeftFrame from "../../components/LeftFrame/LeftFrame";
import { fetchStartupById } from "@/app/redux/features/companyprofile/companyProfileSlice";


const SpotlightDetail: React.FC = () => {
  const params = useParams();
  const dispatch = useAppDispatch();

  // Fix: Use the correct selector path for startup slice
  const { company, loading, error } = useAppSelector((state) => state.companyProfile);

  const [decryptedId, setDecryptedId] = useState<string | null>(null);

  useEffect(() => {
    let encodedId = params?.id;
    if (Array.isArray(encodedId)) encodedId = encodedId[0];

    if (typeof encodedId === "string") {
      const id = decryptURL(encodedId);
      console.log("Decrypted ID:", id);
      setDecryptedId(id ?? null);
    }
  }, [params]);

  useEffect(() => {
    if (decryptedId && !isNaN(Number(decryptedId))) {
      dispatch(fetchStartupById(Number(decryptedId)));
    }
  }, [decryptedId, dispatch]);

  const handleBackClick = () => {
    window.history.back();
  };

  const handleShare = () => {
    const encodedId = params?.id;
    const idToShare = Array.isArray(encodedId) ? encodedId[0] : encodedId;
    const shareUrl = `${window.location.origin}/startups/${idToShare}`;
    shareHook(shareUrl);
  };

  const handleVisitWebsite = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleEmailContact = (email: string) => {
    window.open(`mailto:${email}`, '_self');
  };

  // Loading state
  if (loading) {
    return (
      <main className="flex w-full min-h-screen bg-gray-50">
        <div className="hidden lg:block lg:fixed lg:w-1/5">
          <LeftFrame />
        </div>
        <div className="w-full lg:ml-[20%] xl:ml-[21%] px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-gray-600 mt-4 text-lg">Loading startup details...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="flex w-full min-h-screen bg-gray-50">
        <div className="hidden lg:block lg:fixed lg:w-1/5">
          <LeftFrame />
        </div>
        <div className="w-full lg:ml-[20%] xl:ml-[21%] px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error Loading Startup</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={handleBackClick}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-[#005a9a] transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // No data state
  if (!decryptedId || !company) {
    return (
      <main className="flex w-full min-h-screen bg-gray-50">
        <div className="hidden lg:block lg:fixed lg:w-1/5">
          <LeftFrame />
        </div>
        <div className="w-full lg:ml-[20%] xl:ml-[21%] px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Startup Not Found</h2>
              <p className="text-gray-600 mb-4">The startup you're looking for doesn't exist.</p>
              <button
                onClick={handleBackClick}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-[#005a9a] transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex w-full min-h-screen bg-gray-50">
      {/* Left Sidebar - Hidden on mobile/tablet, fixed on desktop */}
      <div className="hidden lg:block lg:fixed lg:w-1/5 xl:w-[21%] h-full">
        <LeftFrame />
      </div>

      {/* Main Content */}
      <div className="w-full lg:ml-[20%] xl:ml-[21%] px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        {/* Back Button */}
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-primary hover:text-[#005a9a] font-medium mb-4 sm:mb-6 transition-colors"
        >
          <FaArrowLeft className="text-sm" />
          <span className="text-sm sm:text-base">Back to Spotlights</span>
        </button>

        {/* Startup Header Card */}
        <div className="bg-white rounded-xl shadow-md px-4 sm:px-6 py-6 sm:py-8 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              {company.startup_logo ? (
                <img
                  src={company.startup_logo}
                  alt={`${company.startup_name} logo`}
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain rounded-lg border border-gray-200"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' fill='%236b7280' text-anchor='middle' dy='.3em'%3ELogo%3C/text%3E%3C/svg%3E";
                  }}
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                  <FaBuilding className="text-gray-400 text-2xl sm:text-3xl" />
                </div>
              )}
            </div>

            {/* Company Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {company.startup_name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
                {company.startup_analyst_rating && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-white text-xs sm:text-sm rounded-full">
                    <FaStar className="text-xs" />
                    {company.startup_analyst_rating}
                  </span>
                )}
                
                {company.startup_country && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-full">
                    <FaGlobe className="text-xs" />
                    {company.startup_country}
                  </span>
                )}
                
                {company.startup_company_stage && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs sm:text-sm rounded-full">
                    <FaChartLine className="text-xs" />
                    {company.startup_company_stage}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {company.startup_url && (
                  <button
                    onClick={() => handleVisitWebsite(company.startup_url)}
                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#005a9a] transition-colors text-xs sm:text-sm"
                  >
                    <FaExternalLinkAlt className="text-xs" />
                    Visit Website
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center bg-blue-100 text-blue-600 p-2 rounded-lg sm:rounded-xl hover:bg-blue-200 transition-colors"
                  aria-label="Share Startup"
                >
                  <IoShareSocialOutline size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                {/* <button className="flex items-center justify-center bg-blue-100 text-blue-600 p-2 rounded-lg sm:rounded-xl hover:bg-blue-200 transition-colors">
                  <MdOutlineLanguage size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <button className="flex items-center justify-center bg-blue-100 text-blue-600 p-2 rounded-lg sm:rounded-xl hover:bg-blue-200 transition-colors">
                  <MdOutlinePhoneInTalk size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <button className="flex items-center justify-center bg-blue-100 text-blue-600 p-2 rounded-lg sm:rounded-xl hover:bg-blue-200 transition-colors">
                  <FaLinkedinIn size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Company Overview */}
        {(company.startup_overview || company.startup_description) && (
          <div className="bg-white rounded-xl shadow-md px-4 sm:px-6 py-4 sm:py-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <FaRocket className="text-base sm:text-lg" />
              Overview
            </h2>
            {company.startup_overview && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Platform Overview</h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{company.startup_overview}</p>
              </div>
            )}
            {company.startup_description && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{company.startup_description}</p>
              </div>
            )}
          </div>
        )}

        {/* Solutions & Use Cases */}
        {(company.startup_solutions || company.startup_usecases) && (
          <div className="bg-white rounded-xl shadow-md px-4 sm:px-6 py-4 sm:py-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <FaBuilding className="text-base sm:text-lg" />
              Solutions & Use Cases
            </h2>
            {company.startup_solutions && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Solutions</h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{company.startup_solutions}</p>
              </div>
            )}
            {company.startup_usecases && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Use Cases</h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{company.startup_usecases}</p>
              </div>
            )}
          </div>
        )}

        {/* Strategic Positioning */}
        {(company.startup_gsi || company.startup_partners || company.startup_customers) && (
          <div className="bg-white rounded-xl shadow-md px-4 sm:px-6 py-4 sm:py-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <FaUsers className="text-base sm:text-lg" />
              Strategic Positioning
            </h2>
            
            {company.startup_gsi && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">GSI Partners</h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{company.startup_gsi}</p>
              </div>
            )}
            
            {company.startup_partners && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Partners</h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{company.startup_partners}</p>
              </div>
            )}
            
            {company.startup_customers && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Customers</h3>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{company.startup_customers}</p>
              </div>
            )}
          </div>
        )}

        {/* Technology & Industry */}
        {(company.startup_technology || company.startup_industry) && (
          <div className="bg-white rounded-xl shadow-md px-4 sm:px-6 py-4 sm:py-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <FaChartLine className="text-base sm:text-lg" />
              Technology & Industry
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.startup_technology && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Technology</h3>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {company.startup_technology}
                  </span>
                </div>
              )}
              
              {company.startup_industry && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Industry</h3>
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                    {company.startup_industry}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Founders */}
        {company.startup_founders_info && (
          <div className="bg-white rounded-xl shadow-md px-4 sm:px-6 py-4 sm:py-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <FaUsers className="text-base sm:text-lg" />
              Founders
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{company.startup_founders_info}</p>
          </div>
        )}

        {/* Contact */}
        {company.startup_emails && (
          <div className="bg-white rounded-xl shadow-md px-4 sm:px-6 py-4 sm:py-6 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-primary mb-3 sm:mb-4 flex items-center gap-2">
              <FaEnvelope className="text-base sm:text-lg" />
              Contact
            </h2>
            <div className="space-y-2">
              {company.startup_emails.split(',').map((email, index) => {
                const cleanEmail = email.trim();
                const emailMatch = cleanEmail.match(/<(.+)>/);
                const actualEmail = emailMatch ? emailMatch[1] : cleanEmail;
                const displayName = emailMatch ? cleanEmail.replace(/<.+>/, '').trim() : cleanEmail;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleEmailContact(actualEmail)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left w-full text-sm sm:text-base"
                  >
                    <FaEnvelope className="text-primary text-sm" />
                    <span className="text-gray-700">{displayName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default SpotlightDetail;