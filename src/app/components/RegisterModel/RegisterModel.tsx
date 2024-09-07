import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch } from "../../redux/hooks";
import {
  postCompany,
  fetchAllCompanies,
} from "../../redux/features/companyprofile/companyProfileSlice";

interface RegistrationModelProps {
  onClose: () => void;
}

interface FormData {
  organization_name: string;
  website: string;
  description: string;
}

const RegistrationModel: React.FC<RegistrationModelProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("Registration of company is started", data);
    try {
      await dispatch(postCompany(data)).unwrap();

      dispatch(fetchAllCompanies());
      onClose();
      reset();
    } catch (error) {
      console.error("Error submitting organization:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-96">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          X
        </button>

        <h2 className="text-lg font-bold mb-4">Add Organization</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Organization Name
            </label>
            <input
              type="text"
              placeholder="Organization Name"
              {...register("organization_name", {
                required: "Organization name is required",
              })}
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
            {errors.organization_name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.organization_name.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <input
              type="url"
              placeholder="Ex :  https://nifo.theyellow.network/"
              {...register("website", {
                required: "Website is required",
                pattern: {
                  value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
                  message: "Please enter a valid URL",
                },
              })}
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
            {errors.website && (
              <p className="text-red-500 text-sm mt-1">
                {errors.website.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              placeholder="Description"
              {...register("description", {
                required: "Description is required",
              })}
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModel;
