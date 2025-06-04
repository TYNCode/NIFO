import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Agreement } from "../types/agreements";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchStartupSearchSuggestions } from "@/app/redux/features/companyprofile/companyProfileSlice";

interface AgreementModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Agreement>) => void;
  defaultValues?: Partial<Agreement>;
}

const AgreementModal: React.FC<AgreementModalProps> = ({
  open,
  onClose,
  onSubmit,
  defaultValues,
}) => {
  const dispatch = useAppDispatch();
  const { searchResults } = useAppSelector((state) => state.companyProfile);
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Partial<Agreement>>({
    defaultValues: defaultValues || {},
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStartupName, setSelectedStartupName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Watch the startup field to manage display
  const watchedStartup = watch("startup");

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
      
      // If editing and startup is provided, fetch the startup name for display
      if (defaultValues.startup) {
        setValue("startup", defaultValues.startup);
        // You might need to fetch the startup name from your API here
        // For now, we'll use a placeholder or the startup ID
        setSelectedStartupName(defaultValues.startup?.toString() || "");
        setSearchQuery(defaultValues.startup?.toString() || "");
      }
    } else {
      reset({});
      setSelectedStartupName("");
      setSearchQuery("");
    }
  }, [defaultValues, reset, setValue]);

  useEffect(() => {
    if (searchQuery.length > 1) {
      dispatch(fetchStartupSearchSuggestions(searchQuery));
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [searchQuery, dispatch]);

  const handleStartupSelect = (startupId: number, startupName: string) => {
    setValue("startup", startupId);
    setSelectedStartupName(startupName);
    setSearchQuery(startupName);
    setShowDropdown(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear startup value if user is typing new search
    if (value !== selectedStartupName) {
      setValue("startup", undefined);
      setSelectedStartupName("");
    }
  };

  const handleFormSubmit = (data: Partial<Agreement>) => {
    onSubmit(data);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md h-full shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">
            {defaultValues?.id ? "Edit Agreement" : "Add Agreement"}
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
            {/* Startup Selection with Search Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Startup <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search startup..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                onFocus={() => {
                  if (searchQuery.length > 1) setShowDropdown(true);
                }}
              />
              
              {/* Search Results Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result.startup_id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleStartupSelect(result.startup_id, result.startup_name)}
                    >
                      <div className="font-medium text-gray-900">{result.startup_name}</div>
                      <div className="text-sm text-gray-500">ID: {result.startup_id}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Hidden input for form submission */}
              <input
                type="hidden"
                {...register("startup", { required: "Startup selection is required" })}
              />
              
              {errors.startup && (
                <p className="mt-1 text-sm text-red-600">{errors.startup.message}</p>
              )}
            </div>

            {/* Agreement Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agreement Type <span className="text-red-500">*</span>
              </label>
              <select 
                {...register("agreement_type", { required: "Agreement type is required" })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Agreement Type</option>
                <option value="NDA">NDA</option>
                <option value="RA">RA</option>
              </select>
              {errors.agreement_type && (
                <p className="mt-1 text-sm text-red-600">{errors.agreement_type.message}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select 
                {...register("status")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Status</option>
                <option value="draft">Draft</option>
                <option value="discussion">In Discussion</option>
                <option value="pending_sp">Pending</option>
                <option value="signed">Signed</option>
              </select>
            </div>

            {/* Date Fields Grid */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input 
                  type="date" 
                  {...register("start_date")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input 
                  type="date" 
                  {...register("end_date")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sent On</label>
                <input 
                  type="date" 
                  {...register("sent_on")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Received On</label>
                <input 
                  type="date" 
                  {...register("received_on")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Completed On</label>
                <input 
                  type="date" 
                  {...register("completed_on")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Renewal Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Renewal Number</label>
              <input 
                type="number" 
                {...register("renewal_number", { 
                  valueAsNumber: true,
                  min: { value: 0, message: "Renewal number must be positive" }
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter renewal number"
              />
              {errors.renewal_number && (
                <p className="mt-1 text-sm text-red-600">{errors.renewal_number.message}</p>
              )}
            </div>

            {/* Clause Summary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Clause Summary</label>
              <textarea 
                {...register("clause_summary")}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter clause summary..."
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea 
                {...register("notes")}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter additional notes..."
              />
            </div>
          </form>
        </div>

        {/* Fixed Footer with Action Buttons */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit(handleFormSubmit)}
              className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-[#005fa3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {defaultValues?.id ? "Update Agreement" : "Create Agreement"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementModal;