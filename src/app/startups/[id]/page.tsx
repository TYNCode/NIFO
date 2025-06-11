"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { decryptURL } from "@/app/utils/shareUtils";
import { fetchStartupById } from "@/app/redux/features/companyprofile/companyProfileSlice";
import {
  FaArrowLeft,
  FaEnvelope,
  FaExternalLinkAlt,
  FaBuilding,
  FaGlobe,
  FaUsers,
  FaRocket,
  FaChartLine,
  FaStar,
} from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import LeftFrame from "@/app/components/LeftFrame/LeftFrame";
import Image from "next/image";

const StartupPage: React.FC = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const { company, loading, error } = useAppSelector((state) => state.companyProfile);
  const [decryptedId, setDecryptedId] = useState<string | null>(null);

  useEffect(() => {
    let encodedId = params?.id;
    if (Array.isArray(encodedId)) encodedId = encodedId[0];
    if (typeof encodedId === "string") {
      const id = decryptURL(encodedId);
      setDecryptedId(id ?? null);
    }
  }, [params]);

  useEffect(() => {
    if (decryptedId && !isNaN(Number(decryptedId))) {
      dispatch(fetchStartupById(Number(decryptedId)));
    }
  }, [decryptedId, dispatch]);

  const handleBack = () => window.history.back();
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/startups/${params.id}`;
    navigator.share?.({
      title: company?.startup_name,
      text: company?.startup_description,
      url: shareUrl,
    });
  };
  const handleVisitWebsite = (url: string) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };
  const handleEmailContact = (email: string) => {
    window.open(`mailto:${email}`, "_self");
  };

  if (loading) {
    return (
      <main className="flex w-full min-h-screen bg-gray-50">
        <div className="hidden lg:block lg:fixed lg:w-1/5">
          <LeftFrame />
        </div>
        <div className="w-full lg:pl-[20%] px-4 lg:px-8 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-gray-600 mt-4 text-lg">Loading startup...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !company) return null;

  return (
    <main className="flex w-full min-h-screen bg-gray-50">
      <div className="hidden lg:block lg:fixed lg:w-1/5 xl:w-[21%] h-full">
        <LeftFrame />
      </div>
      <div className="w-full lg:ml-[20%] xl:ml-[21%] px-4 py-6">
        <button onClick={handleBack} className="flex items-center gap-2 text-primary mb-6">
          <FaArrowLeft /> Back
        </button>

        <div className="bg-white rounded-xl shadow-md px-6 py-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div>
              {company.startup_logo ? (
                <Image
                  src={company.startup_logo}
                  alt="logo"
                  width={20}
                  height={20}
                  className="w-20 h-20 object-contain rounded border"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded">
                  <FaBuilding className="text-gray-500 text-2xl" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{company.startup_name}</h1>
              <div className="flex flex-wrap gap-3">
                {company.startup_analyst_rating && (
                  <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <FaStar /> {company.startup_analyst_rating}
                  </span>
                )}
                {company.startup_country && (
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <FaGlobe /> {company.startup_country}
                  </span>
                )}
                {company.startup_company_stage && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <FaChartLine /> {company.startup_company_stage}
                  </span>
                )}
              </div>
              <div className="mt-4 flex gap-3">
                {company.startup_url && (
                  <button
                    onClick={() => handleVisitWebsite(company.startup_url)}
                    className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-[#005a9a]"
                  >
                    <FaExternalLinkAlt className="inline-block mr-2" /> Visit Website
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="p-2 rounded bg-blue-100 hover:bg-blue-200 text-blue-600"
                >
                  <IoShareSocialOutline size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {["Overview", "Solutions & Use Cases", "Technology & Industry", "Contact"].map((section, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-primary mb-4">
              {section === "Overview" && <FaRocket className="inline-block mr-2" />}
              {section === "Solutions & Use Cases" && <FaBuilding className="inline-block mr-2" />}
              {section === "Technology & Industry" && <FaChartLine className="inline-block mr-2" />}
              {section === "Contact" && <FaEnvelope className="inline-block mr-2" />}
              {section}
            </h2>
            {section === "Overview" && (
              <>
                {company.startup_overview && <p className="mb-4 text-gray-700">{company.startup_overview}</p>}
                {company.startup_description && <p className="text-gray-700">{company.startup_description}</p>}
              </>
            )}
            {section === "Solutions & Use Cases" && (
              <>
                {company.startup_solutions && <p className="mb-4 text-gray-700">{company.startup_solutions}</p>}
                {company.startup_usecases && <p className="text-gray-700">{company.startup_usecases}</p>}
              </>
            )}
            {section === "Technology & Industry" && (
              <div className="flex gap-4">
                {company.startup_technology && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {company.startup_technology}
                  </span>
                )}
                {company.startup_industry && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                    {company.startup_industry}
                  </span>
                )}
              </div>
            )}
            {section === "Contact" && company.startup_emails && (
              <div className="space-y-2">
                {company.startup_emails.split(",").map((email: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => handleEmailContact(email.trim())}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    <FaEnvelope className="text-primary" />
                    {email.trim()}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
};

export default StartupPage;
