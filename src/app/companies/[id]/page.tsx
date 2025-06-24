"use client";
import React, { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { decryptURL } from "../../utils/shareUtils";
import { useParams, useRouter } from "next/navigation";
import withAuth from "../../utils/withAuth";
import { fetchCompanyById } from "@/app/redux/features/companyprofile/companyProfileSlice";
import type { StartupType } from "@/app/admin/startups/types/company.d.ts";

interface CompanyProfileProps {
  company: {
    startup_name: string;
    startup_analyst_rating: string;
    startup_industry: string;
    startup_technology: string;
    startup_overview: string;
    startup_description: string;
    startup_company_stage: string;
    startup_country: string;
    startup_founders_info: string;
    startup_emails: string;
  };
}

const CompanyProfile: React.FC<any> = () => {
  const dispatch = useAppDispatch();
  const { company, loading, error } = useAppSelector(
    (state) => state.companyProfile
  );
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    let encodedOrganizationId = params.id;
    if (Array.isArray(encodedOrganizationId)) {
      encodedOrganizationId = encodedOrganizationId[0];
    }

    const decodedOrganizationId: any = decryptURL(encodedOrganizationId);
    dispatch(fetchCompanyById({ id: decodedOrganizationId, type: "startup" }));
  }, [dispatch]);

  // Cast company to StartupType for startup-specific fields
  const startup = company as StartupType;

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <ClipLoader color="#3b82f6" size={50} />
      </div>
    );
  }

  return (
    <div>
      <div className="w-[50%] flex items-center mx-auto my-6">
        <button
          onClick={() => router.back()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
        >
          Back
        </button>

        <h1 className="text-3xl font-bold mx-auto my-0 text-gray-900 ">
          {startup.startup_name}
        </h1>
      </div>
      <div className="flex flex-col items-center space-y-6 p-4  min-h-screen">
        <div className="w-full max-w-3xl">
          <div className="relative mb-8">
            <span className="absolute -top-3 left-4 px-2 bg-white text-gray-700 font-semibold">
              Analyst Rating
            </span>
            <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 text-gray-900">
              {startup.startup_analyst_rating || "N/A"}
            </div>
          </div>

          <div className="relative mb-8">
            <span className="absolute -top-3 left-4 px-2 bg-white text-gray-700 font-semibold">
              Industry
            </span>
            <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 text-gray-900">
              {startup.startup_industry || "N/A"}
            </div>
          </div>

          <div className="relative mb-8">
            <span className="absolute -top-3 left-4 px-2 bg-white text-gray-700 font-semibold">
              Technology
            </span>
            <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 text-gray-900">
              {startup.startup_technology || "N/A"}
            </div>
          </div>

          <div className="relative mb-8">
            <span className="absolute -top-3 left-4 px-2 bg-white text-gray-700 font-semibold">
              Overview
            </span>
            <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 text-gray-900">
              {startup.startup_overview || "N/A"}
            </div>
          </div>

          <div className="relative mb-8">
            <span className="absolute -top-3 left-4 px-2 bg-white text-gray-700 font-semibold">
              Description
            </span>
            <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 text-gray-900">
              {startup.startup_description || "N/A"}
            </div>
          </div>

          <div className="relative mb-8">
            <span className="absolute -top-3 left-4 px-2 bg-white text-gray-700 font-semibold">
              Stage
            </span>
            <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 text-gray-900">
              {startup.startup_company_stage || "N/A"}
            </div>
          </div>

          <div className="relative mb-8">
            <span className="absolute -top-3 left-4 px-2 bg-white text-gray-700 font-semibold">
              Country
            </span>
            <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 text-gray-900">
              {startup.startup_country || "N/A"}
            </div>
          </div>

          <div className="relative mb-8">
            <span className="absolute -top-3 left-4 px-2 bg-white text-gray-700 font-semibold">
              Founders Info
            </span>
            <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 text-gray-900">
              {startup.startup_founders_info || "N/A"}
            </div>
          </div>

          <div className="relative mb-8">
            <span className="absolute -top-3 left-4 px-2 bg-white text-gray-700 font-semibold">
              Emails
            </span>
            <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 text-gray-900">
              {startup.startup_emails || "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(CompanyProfile);
