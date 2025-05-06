import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormData, StartupNameType } from "../../interfaces";
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import RegistrationModel from "../RegisterModel/RegisterModel";
import { fetchAllCompanies } from "../../redux/features/companyprofile/companyProfileSlice";

interface RegisterLapProps {
  onSubmit: SubmitHandler<FormData>;
  loading: boolean;
  message?: string;
  error?: string;
}

const RegisterLap: React.FC<RegisterLapProps> = ({
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
    clearErrors,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({ mode: "onChange" });

  const [filteredCompanies, setFilteredCompanies] = useState<StartupNameType[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { companies } = useAppSelector((state) => state.companyProfile);

  useEffect(() => {
    dispatch(fetchAllCompanies());
  }, [dispatch]);

  useEffect(() => {
    const selectedCompanyName = companies.find(
      (c) => c.startup_id === selectedCompanyId
    )?.startup_name;

    const isExactMatch = selectedCompanyName?.toLowerCase() === query.toLowerCase();

    if (query && companies.length > 0 && !isExactMatch) {
      const filtered = companies
        .filter((company) =>
          company.startup_name?.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 4);
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies([]);
    }
  }, [query, companies, selectedCompanyId]);

  const handleCompanySelect = (company: StartupNameType) => {
    setQuery(company.startup_name);
    setSelectedCompanyId(company.startup_id);
    setValue("organization_id", company.startup_id);
    setValue("organization_name", company.startup_name);
    clearErrors("organization_name");
    setTimeout(() => setFilteredCompanies([]), 0);
  };

  const handleFormSubmit: SubmitHandler<FormData> = (data) => {
    if (selectedCompanyId) {
      data.organization_id = selectedCompanyId;
      data.organization_name = query;
    }
    onSubmit(data);
  };

  const handleOpenModal = (event: React.MouseEvent) => {
    event.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    dispatch(fetchAllCompanies());
  };

  const showAddOrganizationButton =
    query &&
    !filteredCompanies.some(
      (company) => company.startup_name.toLowerCase() === query.toLowerCase()
    ) &&
    selectedCompanyId === null;

  return (
    <div className="flex justify-evenly items-center bg-gradient-to-b from-yellow-100 via-yellow-200 to-yellow-300">
      <div className="w-7/12 h-screen flex items-center justify-center">
        <Image src="/tyn-login.png" alt="tyn-login" width={400} height={400} />
      </div>

      <div className="w-5/12 bg-white h-screen overflow-y-auto flex flex-col gap-2">
        <div className="flex items-start flex-col gap-y-2 xl:gap-4 px-8 pt-8">
          <h2 className="font-bold text-3xl xl:text-5xl">Get Started</h2>
          <p className="font-light text-base xl:text-xl text-[#0070C0]">
            Start your journey by creating an account
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-4 xl:gap-6 px-10 justify-center items-center xl:pt-8"
        >
          <div className="flex flex-col items-start gap-2">
            <label htmlFor="first_name">Full Name</label>
            <input
              type="text"
              {...register("first_name", { required: "Name is required" })}
              id="first_name"
              placeholder="Enter your Name"
              className="text-base px-5 py-3 h-10 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder:text-gray-300 border-none w-80"
            />
            {errors.first_name && (
              <p className="text-red-500 capitalize">{errors.first_name.message}</p>
            )}
          </div>

          <div className="flex flex-col items-start gap-2">
            <label htmlFor="email">Organization Email</label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="Enter your email"
              className="text-base px-5 py-3 h-10 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder:text-gray-300 border-none w-80"
            />
            {errors.email && <p className="text-red-500 capitalize">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col items-start gap-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              autoComplete="off"
              id="password"
              placeholder="Enter your password"
              className="text-base px-5 py-3 h-10 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder:text-gray-300 border-none w-80"
            />
            {errors.password && (
              <p className="text-red-500 capitalize">{errors.password.message}</p>
            )}
          </div>

          <div className="flex flex-col items-start gap-2">
            <label htmlFor="organization">Organization Name</label>
            <input
              type="text"
              id="organization"
              value={query}
              onChange={(e) => {
                const value = e.target.value;
                setQuery(value);
                setSelectedCompanyId(null);
                setValue("organization_name", value);
              }}
              placeholder="Enter your organization"
              className="text-base px-5 py-3 h-10 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder:text-gray-300 border-none w-80"
            />
            {filteredCompanies.length > 0 && (
              <ul className="border border-gray-300 mt-2 w-full max-h-48 overflow-y-auto bg-white z-10">
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
                className="mt-2 bg-[#0070C0] text-white px-5 h-10 w-80 py-2 rounded-lg"
                onClick={handleOpenModal}
              >
                Company not found? Add it here!
              </button>
            )}
            {errors.organization_name && (
              <p className="text-red-500 capitalize">{errors.organization_name.message}</p>
            )}
          </div>

          {!loading && (message || error) && (
            <p
              className={`text-base capitalize ${
                error ? "text-red-500" : "text-[#0070C0]"
              }`}
            >
              {message || error}
            </p>
          )}

          <div className="my-2">
          <button
            type="submit"
            disabled={!isValid || isSubmitting || loading}
                 className={`rounded-md ${
                isValid && !loading ? "bg-[#0070C0]" : "bg-gray-300 cursor-not-allowed"
              } text-sm px-4 py-2 text-white flex items-center justify-center font-semibold`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          </div>
        </form>

        <div className="flex justify-center items-center mt-4 my-10">
          <span className="text-sm xl:text-base text-black font-semibold">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#0070C0]">
              Sign in
            </Link>
          </span>
        </div>
      </div>

      {showModal && <RegistrationModel onClose={handleCloseModal} />}
    </div>
  );
};

export default RegisterLap;
