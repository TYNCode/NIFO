"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchCompaniesByPagination,
} from "../redux/features/companyprofile/companyProfileSlice";
import {
  clearRegisterState,
  registerUser,
} from "../redux/features/auth/registerSlice";
import RegistrationModel from "../components/RegisterModel/RegisterModel";
import { FormData } from "../interfaces";
import { StartupNameType } from "../admin/startups/types/company";

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, message } = useAppSelector((state) => state.register);
  const { companies } = useAppSelector((state) => state.companyProfile);

  const [filteredCompanies, setFilteredCompanies] = useState<StartupNameType[]>([]);
  const [query, setQuery] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<FormData>({ mode: "onChange" });

  useEffect(() => {
    dispatch(fetchCompaniesByPagination({ page: 1, page_size: 100 }));
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

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (selectedCompanyId) {
      data.organization_id = selectedCompanyId;
      data.organization_name = query;
    }
    dispatch(registerUser(data));
  };

  const handleOpenModal = (event: React.MouseEvent) => {
    event.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    dispatch(fetchCompaniesByPagination({ page: 1, page_size: 100 }));
  };

  const showAddOrganizationButton =
    query &&
    !filteredCompanies.some(
      (company) => company.startup_name.toLowerCase() === query.toLowerCase()
    ) &&
    selectedCompanyId === null;

  useEffect(() => {
    if (message && !loading) {
      if (!error) {
        router.push("/");
      }
      dispatch(clearRegisterState());
    }
  }, [message, error, loading, router, dispatch]);


  // Shared components for form fields to reduce duplication
  const renderNameField = (isMobile: boolean) => (
    <>
      {!isMobile && <label htmlFor="first_name">Full Name</label>}
      <input
        type="text"
        {...register("first_name", { required: "Name is required" })}
        id="first_name"
        placeholder={isMobile ? "Full Name" : "Enter your Name"}
        className={`text-base px-5 py-3 ${
          isMobile ? "outline-none shadow border-none w-full" : "h-10 shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder:text-gray-300 border-none w-80"
        } rounded-lg`}
      />
      {errors.first_name && (
        <p className={`text-red-500 ${!isMobile && "capitalize"}`}>
          {errors.first_name.message}
        </p>
      )}
    </>
  );

  const renderEmailField = (isMobile: boolean) => (
    <>
      {!isMobile && <label htmlFor="email">Organization Email</label>}
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
        placeholder={isMobile ? "Organization Email" : "Enter your email"}
        className={`text-base px-5 py-3 ${
          isMobile ? "outline-none shadow border-none w-full" : "h-10 shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder:text-gray-300 border-none w-80"
        } rounded-lg`}
      />
      {errors.email && (
        <p className={`text-red-500 ${!isMobile && "capitalize"}`}>
          {errors.email.message}
        </p>
      )}
    </>
  );

  const renderPasswordField = (isMobile: boolean) => (
    <>
      {!isMobile && <label htmlFor="password">Password</label>}
      <input
        type="password"
        {...register("password", { required: "Password is required" })}
        autoComplete="off"
        id="password"
        placeholder={isMobile ? "Password" : "Enter your password"}
        className={`text-base px-5 py-3 ${
          isMobile ? "outline-none shadow border-none w-full" : "h-10 shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder:text-gray-300 border-none w-80"
        } rounded-lg`}
      />
      {errors.password && (
        <p className={`text-red-500 ${!isMobile && "capitalize"}`}>
          {errors.password.message}
        </p>
      )}
    </>
  );

  const renderOrganizationField = (isMobile: boolean) => (
    <>
      {!isMobile && <label htmlFor="organization">Organization Name</label>}
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
        placeholder={isMobile ? "Organization Name" : "Enter your organization"}
        className={`text-base px-5 py-3 ${
          isMobile ? "outline-none shadow border-none w-full" : "h-10 shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder:text-gray-300 border-none w-80"
        } rounded-lg`}
      />
      {filteredCompanies.length > 0 && (
        <ul className={`border border-gray-300 ${isMobile ? "mt-1" : "mt-2"} w-full max-h-48 overflow-y-auto bg-white z-10 ${isMobile && "absolute rounded"}`}>
          {filteredCompanies.map((company) => (
            <li
              key={company.startup_id}
              onClick={() => handleCompanySelect(company)}
              className={`cursor-pointer ${isMobile ? "p-3 border-b border-gray-100" : "p-2"} hover:bg-gray-100`}
            >
              {company.startup_name}
            </li>
          ))}
        </ul>
      )}
      {showAddOrganizationButton && (
        <button
          className={`${isMobile ? "mt-0" : "mt-2"} bg-primary text-white px-5 ${isMobile ? "h-10 w-80 py-2" : "h-10 w-80 py-2"} rounded-lg`}
          onClick={handleOpenModal}
        >
          Company not found? Add it here!
        </button>
      )}
      {errors.organization_name && (
        <p className={`text-red-500 ${!isMobile && "capitalize"}`}>
          {errors.organization_name.message}
        </p>
      )}
    </>
  );

  const renderSubmitButton = (isMobile: boolean) => (
    <button
      type="submit"
      disabled={!isValid || loading}
      className={`rounded-md ${
        isValid && !loading ? "bg-primary" : "bg-gray-300 cursor-not-allowed"
      } text-sm px-4 ${isMobile ? "py-3 uppercase w-full mt-2" : "py-2"} text-white flex items-center justify-center font-semibold`}
    >
      {loading ? "Registering..." : "Register"}
    </button>
  );

  const renderStatusMessage = (isMobile: boolean) => (
    !loading && (message || error) && (
      <p className={isMobile ? 
        `text-${error ? "red" : "blue"}-500 text-sm` : 
        `text-base capitalize ${error ? "text-red-500" : "text-primary"}`}
      >
        {message || error}
      </p>
    )
  );

  return (
    <>
      {/* --------- Mobile View --------- */}
      <div className="block lg:hidden h-screen w-full flex-col justify-start pt-10 items-start bg-gradient-to-b from-yellow-300 to-yellow-100">
        <div className="w-full flex justify-center">
          <Image src="/tyn-login.png" alt="Register Image" width={150} height={150} />
        </div>
        
        <div className="w-full h-4/5 flex flex-col gap-5 mt-8 bg-white py-8 rounded-t-3xl shadow-lg">
          <div className="text-4xl text-black font-semibold px-14 py-0">Get Started</div>
          <p className="font-light text-base px-14 text-primary">
            Start your journey by creating an account
          </p>
          
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 px-10 mt-2">
            <div>{renderNameField(true)}</div>
            <div>{renderEmailField(true)}</div>
            <div>{renderPasswordField(true)}</div>
            <div className="relative">{renderOrganizationField(true)}</div>
            {renderStatusMessage(true)}
            {renderSubmitButton(true)}
          </form>

          <div className="mt-4 text-center">
            <div className="text-center font-medium tracking-wide mt-2">
              Already have an account?{" "}
              <Link href="/login">
                <span className="text-primary font-semibold">Sign in</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* --------- Laptop/Desktop View --------- */}
      <div className="hidden lg:flex h-screen justify-evenly items-center bg-gradient-to-b from-yellow-100 via-yellow-200 to-yellow-300">
        <div className="w-7/12 h-screen flex items-center justify-center">
          <Image src="/tyn-login.png" alt="tyn-login" width={400} height={400} />
        </div>

        <div className="w-5/12 bg-white h-screen overflow-y-auto flex flex-col gap-2">
          <div className="flex items-start flex-col gap-y-2 xl:gap-4 px-8 pt-8">
            <h2 className="font-bold text-3xl xl:text-5xl">Get Started</h2>
            <p className="font-light text-base xl:text-xl text-primary">
              Start your journey by creating an account
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 xl:gap-6 px-10 justify-center items-center xl:pt-8"
          >
            <div className="flex flex-col items-start gap-2">
              {renderNameField(false)}
            </div>

            <div className="flex flex-col items-start gap-2">
              {renderEmailField(false)}
            </div>

            <div className="flex flex-col items-start gap-2">
              {renderPasswordField(false)}
            </div>

            <div className="flex flex-col items-start gap-2">
              {renderOrganizationField(false)}
            </div>

            {renderStatusMessage(false)}

            <div className="my-2">
              {renderSubmitButton(false)}
            </div>
          </form>

          <div className="flex justify-center items-center mt-4 my-10">
            <span className="text-sm xl:text-base text-black font-semibold">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary">
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>

      {showModal && <RegistrationModel onClose={handleCloseModal} />}
    </>
  );
};

export default RegisterPage;