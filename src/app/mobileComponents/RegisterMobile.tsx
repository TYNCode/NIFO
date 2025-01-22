import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormData, StartupType } from "../interfaces";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import RegistrationModel from "../components/RegisterModel/RegisterModel";
import { fetchAllCompanies } from "../redux/features/companyprofile/companyProfileSlice";

interface RegisterMobileProps {
  onSubmit: SubmitHandler<FormData>;
  loading: boolean;
  message?: string;
  error?: string;
}

const RegisterMobile: React.FC<RegisterMobileProps> = ({
  onSubmit,
  loading,
  message,
  error,
}) => {
  const dispatch = useAppDispatch();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    mode: "onChange",
  });

  const [filteredCompanies, setFilteredCompanies] = useState<StartupType[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { companies } = useAppSelector((state) => state.companyProfile);

  useEffect(() => {
    dispatch(fetchAllCompanies());
  }, [dispatch]);

  useEffect(() => {
    if (query && companies.length > 0) {
      const filtered = companies
        .filter((company) =>
          company.startup_name?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 4);
      setFilteredCompanies(filtered);
      setShowDropdown(true);
    } else {
      setFilteredCompanies([]);
      setShowDropdown(false);
    }
  }, [query, companies]);

  const handleCompanySelect = (company: StartupType) => {
    setQuery(company.startup_name); // Set the selected company name
    setSelectedCompanyId(company.startup_id); // Save the selected company ID
    setFilteredCompanies([]); // Clear the filtered companies
    setShowDropdown(false); // Hide the dropdown
    setValue("organization_id", company.startup_id); // Set the form value
  };

  const handleFormSubmit: SubmitHandler<FormData> = (data) => {
    if (selectedCompanyId) {
      data.organization_id = selectedCompanyId;
    }
    onSubmit(data);
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    dispatch(fetchAllCompanies()); // Refresh company list after modal closes
  };

  const showAddOrganizationButton =
    query &&
    !filteredCompanies.some(
      (company) => company.startup_name.toLowerCase() === query.toLowerCase()
    ) &&
    selectedCompanyId === null;

  return (
    <div className="h-screen w-full flex flex-col justify-start pt-10 items-start bg-gradient-to-b from-yellow-300 to-yellow-100">
      <div className="w-full flex justify-center">
        <Image
          src="/tyn-login.png"
          alt="Login Image"
          width={150}
          height={150}
        />
      </div>
      <div className="text-4xl text-white font-semibold px-14 py-4">
        Sign Up
      </div>
      <div className="w-full h-4/5 flex flex-col mt-8 bg-white py-8 rounded-t-3xl shadow-lg">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-6 px-10 mt-4"
        >
          {/* Form fields */}
          <div className="flex flex-col items-start justify-start gap-2 w-full">
            <input
              type="text"
              {...register("first_name", { required: "Full name is required" })}
              id="first_name"
              placeholder="Full Name"
              className="text-base px-5 py-3 outline-none rounded-lg shadow border-none w-full"
            />
            {errors.first_name && (
              <p className="text-red-500">{errors.first_name.message}</p>
            )}
          </div>
          <div className="flex flex-col items-start justify-start gap-2 w-full">
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              id="email"
              placeholder="Email Address"
              className="text-base px-5 py-3 outline-none rounded-lg shadow border-none w-full"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col items-start justify-start gap-2 w-full">
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              id="password"
              placeholder="Password"
              className="text-base px-5 py-3 outline-none rounded-lg shadow border-none w-full"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="flex flex-col items-center justify-start gap-2 w-full">
            <input
              type="text"
              {...register("organization_name", {
                required: "Organization name is required",
              })}
              id="organization_name"
              placeholder="Organization Name"
              className="text-base px-5 py-3 outline-none rounded-lg shadow border-none w-full"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedCompanyId(null);
              }}
            />
            {showDropdown && filteredCompanies.length > 0 && (
              <ul className="border border-gray-300 mt-2 w-full max-h-48 overflow-y-auto">
                {filteredCompanies.map((company) => (
                  <li
                    key={company.startup_id}
                    onClick={() => handleCompanySelect(company)}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                  >
                    {company.startup_name}
                  </li>
                ))}
              </ul>
            )}
            {showAddOrganizationButton && (
              <button
                className="mt-2 bg-blue-500 text-white font-medium uppercase text-sm px-4 py-2 rounded-md"
                onClick={handleOpenModal}
              >
                Company not found? Add it here!
              </button>
            )}
            {errors.organization_name && (
              <p className="text-red-500">{errors.organization_name.message}</p>
            )}
          </div>
          {!loading && (message || error) && (
            <p
              className={`text-base capitalize text-center ${
                error ? "text-red-500" : "text-blue-500"
              }`}
            >
              {message || error}
            </p>
          )}
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`rounded-md ${
              isValid ? "bg-blue-500" : "bg-gray-300 cursor-not-allowed"
            } text-sm px-4 py-2 text-white flex items-center justify-center uppercase font-semibold w-full rounded-lg`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="mt-4 text-center font-medium tracking-wide">
            Already have an account?{" "}
            <Link href="/login">
              <span className="text-blue-400 font-bold underline">Sign-in</span>
            </Link>
          </div>
        </form>
      </div>
      {showModal && <RegistrationModel onClose={handleCloseModal} />}
    </div>
  );
};

export default RegisterMobile;