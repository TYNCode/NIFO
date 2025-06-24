import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CompanyType } from "@/app/redux/features/companyprofile/companyProfileSlice";
import {
  clearCompanyState,
  createCompany,
  setCompanyModalOpen,
  updateCompany,
  fetchCompanyById,
} from "@/app/redux/features/companyprofile/companyProfileSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";

interface StartupFormFields {
  startup_id?: number;
  startup_name?: string;
  startup_url?: string;
  startup_description?: string;
  startup_industry?: string;
  startup_technology?: string;
  startup_country?: string;
  startup_overview?: string;
  startup_company_stage?: string;
  startup_founders_info?: string;
  startup_emails?: string;
  startup_analyst_rating?: string;
  startup_gsi?: string;
  startup_partners?: string;
  startup_customers?: string;
  startup_usecases?: string;
  startup_solutions?: string;
}

const StartupFormDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isModalOpen, mode, selectedCompany, company, loading } =
    useAppSelector((state) => state.companyProfile);

  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<StartupFormFields>>();

  useEffect(() => {
    if (isEdit && selectedCompany?.id) {
      dispatch(fetchCompanyById({ id: selectedCompany.id, type: selectedCompany.type }));
    }
  }, [isEdit, selectedCompany?.id, selectedCompany?.type, dispatch]);

  useEffect(() => {
    if (isEdit && company) {
      if ('startup_id' in company) {
        const c = company as any;
        reset({
          startup_name: c.startup_name,
          startup_url: c.startup_url,
          startup_description: c.startup_description,
          startup_industry: c.startup_industry,
          startup_technology: c.startup_technology,
          startup_country: c.startup_country,
          startup_overview: c.startup_overview,
          startup_company_stage: c.startup_company_stage,
          startup_founders_info: c.startup_founders_info,
          startup_emails: c.startup_emails,
          startup_analyst_rating: c.startup_analyst_rating,
          startup_gsi: c.startup_gsi,
          startup_partners: c.startup_partners,
          startup_customers: c.startup_customers,
          startup_usecases: c.startup_usecases,
          startup_solutions: c.startup_solutions,
        } as any);
      } else {
        reset({});
      }
    } else if (!isEdit) {
      reset({
        startup_name: "",
        startup_url: "",
        startup_description: "",
        startup_industry: "",
        startup_technology: "",
        startup_country: "",
        startup_overview: "",
        startup_company_stage: "",
        startup_founders_info: "",
        startup_emails: "",
        startup_analyst_rating: "",
        startup_gsi: "",
        startup_partners: "",
        startup_customers: "",
        startup_usecases: "",
        startup_solutions: "",
      } as any);
    }
  }, [isEdit, company, reset]);

  const onClose = () => {
    dispatch(setCompanyModalOpen(false));
    dispatch(clearCompanyState());
    reset();
  };

  // Transform form data to match API expectations
  const transformFormData = (data: Partial<CompanyType>) => {
    return {
      organization_name: (data as any).startup_name,
      website: (data as any).startup_url,
      description: (data as any).startup_description,
      startup_industry: (data as any).startup_industry,
      startup_technology: (data as any).startup_technology,
      startup_country: (data as any).startup_country,
      startup_overview: (data as any).startup_overview,
      startup_company_stage: (data as any).startup_company_stage,
      startup_founders_info: (data as any).startup_founders_info,
      startup_emails: (data as any).startup_emails,
      startup_analyst_rating: (data as any).startup_analyst_rating,
      startup_gsi: (data as any).startup_gsi,
      startup_partners: (data as any).startup_partners,
      startup_customers: (data as any).startup_customers,
      startup_usecases: (data as any).startup_usecases,
      startup_solutions: (data as any).startup_solutions,
      type: "startup" as const
    };
  };

  const onSubmit = (data: Partial<CompanyType>) => {
    const transformedData = transformFormData(data);
    
    if (isEdit && selectedCompany?.id) {
      dispatch(
        updateCompany({ id: selectedCompany.id, payload: transformedData, type: "startup" })
      ).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          onClose();
        }
      });
    } else {
      dispatch(createCompany(transformedData)).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          onClose();
        }
      });
    }
  };

  return (
    <>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[480px] bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          isModalOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-bgBlue">
          {isEdit ? (
            <div className="flex items-center space-x-3">
              {'startup_id' in (company || {}) && (company as any).startup_logo && (
                <img
                  src={(company as any).startup_logo}
                  alt="Startup Logo"
                  className="w-8 h-8 rounded object-cover"
                />
              )}
              <h2 className="text-lg font-semibold text-customBlack">
                {'startup_id' in (company || {}) ? (company as any).startup_name : "Startup"}
              </h2>
            </div>
          ) : (
            <h2 className="text-lg font-semibold text-customBlack">
              Add New Startup
            </h2>
          )}
          <button
            className="text-2xl font-semibold text-customGreyishBlack transition-colors duration-200"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="h-full overflow-y-auto pb-20">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <h3 className="text-xs text-gray-700 uppercase font-medium text-customBlack">
              Basic Information
            </h3>
            <div className="space-y-4 shadow-sm border border-gray-200 p-5 rounded-md">
              {!isEdit && (
                <div>
                  <label className="block text-sm font-medium text-customBlack mb-2">
                    Startup Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("startup_name" as any, {
                      required: "Startup name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent transition-all duration-200"
                    placeholder="Enter startup name"
                  />
                  {(errors as any)["startup_name"] && (
                    <p className="text-red-500 text-xs mt-1">
                      {(errors as any)["startup_name"].message}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-customBlack mb-2">
                  Website URL <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("startup_url", {
                    required: "Website URL is required",
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message:
                        "Please enter a valid URL starting with http:// or https://",
                    },
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent transition-all duration-200"
                  placeholder="https://example.com"
                />
                {(errors as any)["startup_url"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {(errors as any)["startup_url"].message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-customBlack mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("startup_description", {
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message: "Description must be at least 10 characters",
                    },
                  })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Describe what this startup does..."
                />
                {(errors as any)["startup_description"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {(errors as any)["startup_description"].message}
                  </p>
                )}
              </div>
            </div>

            <h3 className="text-xs text-gray-700 uppercase font-medium text-customBlack">
              Business Details
            </h3>
            <div className="space-y-4 shadow-sm border border-gray-200 p-5 rounded-md">
              <div>
                <label className="block text-sm font-medium text-customBlack mb-2">
                  Analyst Rating
                </label>
                <input
                  {...register("startup_analyst_rating")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent transition-all duration-200"
                  placeholder="Enter analyst rating"
                />
                {(errors as any)["startup_analyst_rating"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {(errors as any)["startup_analyst_rating"].message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-customBlack mb-2">
                  GSI
                </label>
                <input
                  {...register("startup_gsi")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent transition-all duration-200"
                  placeholder="Enter GSI"
                />
                {(errors as any)["startup_gsi"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {(errors as any)["startup_gsi"].message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-customBlack mb-2">
                  Partners
                </label>
                <input
                  {...register("startup_partners")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent transition-all duration-200"
                  placeholder="Enter partners"
                />
                {(errors as any)["startup_partners"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {(errors as any)["startup_partners"].message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-customBlack mb-2">
                  Customers
                </label>
                <input
                  {...register("startup_customers")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent transition-all duration-200"
                  placeholder="Enter customers"
                />
                {(errors as any)["startup_customers"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {(errors as any)["startup_customers"].message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-customBlack mb-2">
                  Use Cases
                </label>
                <input
                  {...register("startup_usecases")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent transition-all duration-200"
                  placeholder="Enter use cases"
                />
                {(errors as any)["startup_usecases"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {(errors as any)["startup_usecases"].message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-customBlack mb-2">
                  Solutions
                </label>
                <input
                  {...register("startup_solutions")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent transition-all duration-200"
                  placeholder="Enter solutions"
                />
                {(errors as any)["startup_solutions"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {(errors as any)["startup_solutions"].message}
                  </p>
                )}
              </div>
            </div>

            <h3 className="text-xs text-gray-700 uppercase font-medium text-customBlack">
              Company Information
            </h3>
            <div className="space-y-4 shadow-sm border border-gray-200 p-5 rounded-md">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-customBlack mb-2">
                    Industry
                  </label>
                  <input
                    {...register("startup_industry")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent transition-all duration-200"
                    placeholder="e.g., FinTech, Healthcare, SaaS"
                  />
                  {(errors as any)["startup_industry"] && (
                    <p className="text-red-500 text-xs mt-1">
                      {(errors as any)["startup_industry"].message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-customBlack mb-2">
                    Technology Stack
                  </label>
                  <input
                    {...register("startup_technology")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent transition-all duration-200"
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                  {(errors as any)["startup_technology"] && (
                    <p className="text-red-500 text-xs mt-1">
                      {(errors as any)["startup_technology"].message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-customBlack mb-2">
                    Country
                  </label>
                  <input
                    {...register("startup_country")}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent transition-all duration-200"
                    placeholder="e.g., United States, India, Germany"
                  />
                  {(errors as any)["startup_country"] && (
                    <p className="text-red-500 text-xs mt-1">
                      {(errors as any)["startup_country"].message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <h3 className="text-xs text-gray-700 uppercase font-medium text-customBlack">
              Funding Information
            </h3>
            <div className="space-y-4 shadow-sm border border-gray-200 p-5 rounded-md mb-6">
              <div>
                <label className="block text-sm font-medium text-customBlack mb-2">
                  Funding Stage
                </label>
                <select
                  {...register("startup_company_stage")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select funding stage</option>
                  <option value="Pre-Seed">Pre-Seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Series B">Series B</option>
                  <option value="Series C">Series C</option>
                  <option value="Series D+">Series D+</option>
                  <option value="IPO">IPO</option>
                  <option value="Acquired">Acquired</option>
                </select>
                {(errors as any)["startup_company_stage"] && (
                  <p className="text-red-500 text-xs mt-1">
                    {(errors as any)["startup_company_stage"].message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-customBlack mb-2">
                  Overview
                </label>
                <textarea
                  {...register("startup_overview")}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Detailed overview of the startup..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-customBlack mb-2">
                  Founders Information
                </label>
                <textarea
                  {...register("startup_founders_info")}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Information about founders..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-customBlack mb-2">
                  Contact Emails
                </label>
                <input
                  {...register("startup_emails")}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent transition-all duration-200"
                  placeholder="contact@startup.com, founder@startup.com"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
          <div className="flex items-center justify-end">
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${
                isEdit
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-customBlue hover:bg-blue-700"
              }`}
            >
              {loading && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              <span>{isEdit ? "Update Startup" : "Create Startup"}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StartupFormDrawer;