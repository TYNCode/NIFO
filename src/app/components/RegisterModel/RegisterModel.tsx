import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch } from "../../redux/hooks";
import {
  createStartup,
  fetchCompaniesByPagination,
} from "../../redux/features/companyprofile/companyProfileSlice";

interface RegistrationModelProps {
  onClose: () => void;
}

interface FormData {
  startup_name: string;
  startup_url: string;
  startup_description: string;
}

const RegistrationModel: React.FC<RegistrationModelProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({ mode: "onChange" });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      await dispatch(createStartup(data)).unwrap();
      dispatch(fetchCompaniesByPagination({ page: 1, page_size: 10 }));
      reset();
      onClose();
    } catch (error: any) {
      console.error("Error submitting organization:", error);
      setServerError(error?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startupName = watch("startup_name") || "";
  const startupUrl = watch("startup_url") || "";
  const startupDescription = watch("startup_description") || "";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg p-8 shadow-xl w-[90%] max-w-md">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-2xl text-gray-400 hover:text-gray-600"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-black">Add Organization</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Startup Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Startup Name</label>
            <input
              type="text"
              maxLength={30}
              placeholder="Enter startup name"
              {...register("startup_name", {
                required: "Startup name is required",
                maxLength: {
                  value: 30,
                  message: "Max 30 characters allowed",
                },
              })}
              className="text-base placeholder:text-base px-5 py-3 h-10 outline-none rounded-lg shadow-[0_3px_10px_rgba(0,0,0,0.2)] border border-gray-300 w-full"
            />
            <div className="text-right text-xs text-gray-400">{startupName.length}/30</div>
            {errors.startup_name && (
              <p className="text-red-500 text-sm">{errors.startup_name.message}</p>
            )}
          </div>

          {/* Website */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Website</label>
            <input
              type="url"
              maxLength={50}
              placeholder="Ex: https://yourstartup.com/"
              {...register("startup_url", {
                required: "Website is required",
                pattern: {
                  value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
                  message: "Please enter a valid URL",
                },
                maxLength: {
                  value: 50,
                  message: "Max 50 characters allowed",
                },
              })}
              className="text-base placeholder:text-base px-5 py-3 h-10 outline-none rounded-lg shadow-[0_3px_10px_rgba(0,0,0,0.2)] border border-gray-300 w-full"
            />
            <div className="text-right text-xs text-gray-400">{startupUrl.length}/50</div>
            {errors.startup_url && (
              <p className="text-red-500 text-sm">{errors.startup_url.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              placeholder="Describe the organization"
              maxLength={200}
              {...register("startup_description", {
                required: "Description is required",
                maxLength: {
                  value: 200,
                  message: "Max 200 characters allowed",
                },
              })}
              rows={3}
              className="text-base placeholder:text-base px-5 py-3 outline-none rounded-lg shadow-[0_3px_10px_rgba(0,0,0,0.2)] border border-gray-300 w-full resize-none"
            />
            <div className="text-right text-xs text-gray-400">
              {startupDescription.length}/200
            </div>
            {errors.startup_description && (
              <p className="text-red-500 text-sm">{errors.startup_description.message}</p>
            )}
          </div>

          {/* Server Error */}
          {serverError && (
            <p className="text-red-500 text-sm text-center -mt-2">{serverError}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex justify-center items-center bg-[#0070C0] text-white py-3 rounded-lg font-semibold transition w-full mt-2 ${
              isSubmitting ? "cursor-not-allowed opacity-70" : "hover:bg-[#005fa3]"
            }`}
          >
            {isSubmitting && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
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
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            )}
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModel;
