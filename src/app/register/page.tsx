"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  fetchStartupSearchSuggestions,
  clearSearchResults,
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
  const { searchResults } = useAppSelector((state) => state.companyProfile);

  const [query, setQuery] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  // Mobile form
  const {
    handleSubmit: handleSubmitMobile,
    register: registerMobile,
    setValue: setValueMobile,
    clearErrors: clearErrorsMobile,
    formState: { errors: errorsMobile, isValid: isValidMobile },
  } = useForm<FormData>({ mode: "onChange" });

  // Desktop form  
  const {
    handleSubmit: handleSubmitDesktop,
    register: registerDesktop,
    setValue: setValueDesktop,
    clearErrors: clearErrorsDesktop,
    formState: { errors: errorsDesktop, isValid: isValidDesktop },
  } = useForm<FormData>({ mode: "onChange" });

  useEffect(() => {
    if (query.trim().length > 0) {
      const debounce = setTimeout(() => {
        dispatch(fetchStartupSearchSuggestions(query));
      }, 300);
      return () => clearTimeout(debounce);
    } else {
      dispatch(clearSearchResults());
    }
  }, [query, dispatch]);

  const handleCompanySelect = (company: StartupNameType) => {
    setQuery(company.startup_name);
    setSelectedCompanyId(company.startup_id);
    
    // Update both forms
    setValueMobile("organization_id", company.startup_id);
    setValueMobile("organization_name", company.startup_name);
    clearErrorsMobile("organization_name");
    
    setValueDesktop("organization_id", company.startup_id);
    setValueDesktop("organization_name", company.startup_name);
    clearErrorsDesktop("organization_name");
    
    // Clear search results immediately to prevent re-showing
    dispatch(clearSearchResults());
  };

  const onSubmitMobile: SubmitHandler<FormData> = (data) => {
    if (selectedCompanyId) {
      data.organization_id = selectedCompanyId;
      data.organization_name = query;
    }
    dispatch(registerUser(data));
  };

  const onSubmitDesktop: SubmitHandler<FormData> = (data) => {
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
    if (query.trim()) {
      dispatch(fetchStartupSearchSuggestions(query));
    }
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSelectedCompanyId(null);
    setValueMobile("organization_name", value);
    setValueDesktop("organization_name", value);
  };

  const showAddOrganizationButton =
    query &&
    !searchResults.some(
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

  const renderStatusMessage = (isMobile: boolean) =>
    !loading &&
    (message || error) && (
      <p
        className={`${
          isMobile
            ? `${error ? "text-red-500" : "text-blue-500"} text-sm`
            : `${error ? "text-red-500" : "text-blue-500"} text-base`
        }`}
      >
        {message || error}
      </p>
    );

  return (
    <>
      {/* --------- Mobile View --------- */}
      <div className="block lg:hidden h-full w-full flex-col justify-start pt-10 items-start bg-gradient-to-b from-yellow-300 to-yellow-100">
        <div className="w-full flex justify-center">
          <Image
            src="/tyn-login.png"
            alt="Register Image"
            width={150}
            height={150}
          />
        </div>

        <div className="w-full h-4/5 flex flex-col gap-5 mt-8 bg-white py-8 rounded-t-3xl">
          <div className="text-2xl sm:text-4xl text-primary font-semibold px-10 py-0">
            Get Started
          </div>
          <form
            onSubmit={handleSubmitMobile(onSubmitMobile)}
            className="flex flex-col gap-6 px-10 mt-4"
          >
            <input
              type="text"
              {...registerMobile("first_name", { required: "Name is required" })}
              id="first_name-mobile"
              placeholder="Full Name"
              className="text-base px-5 py-3 outline-none rounded-lg shadow border-none w-full"
            />
            {errorsMobile.first_name && (
              <p className="text-red-500">{errorsMobile.first_name.message}</p>
            )}

            <input
              type="password"
              {...registerMobile("password", { required: "Password is required" })}
              id="password-mobile"
              placeholder="Password"
              autoComplete="off"
              className="text-base px-5 py-3 outline-none rounded-lg shadow border-none w-full"
            />
            {errorsMobile.password && (
              <p className="text-red-500">{errorsMobile.password.message}</p>
            )}

            <input
              type="email"
              {...registerMobile("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              id="email-mobile"
              placeholder="Organization Email"
              className="text-base px-5 py-3 outline-none rounded-lg shadow border-none w-full"
            />
            {errorsMobile.email && (
              <p className="text-red-500">{errorsMobile.email.message}</p>
            )}

            <div className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Organization Name"
                className="text-base px-5 py-3 outline-none rounded-lg shadow border-none w-full"
              />
              {searchResults.length > 0 && (
                <ul className="absolute z-50 bg-white w-full border border-gray-300 mt-1 rounded-md max-h-36 overflow-y-auto shadow-md">
                  {searchResults.slice(0, 5).map((company) => (
                    <li
                      key={company.startup_id}
                      onMouseDown={(e) => {
                        e.preventDefault(); // Prevent input blur
                        handleCompanySelect(company);
                      }}
                      className="cursor-pointer p-2 hover:bg-gray-100 text-sm"
                    >
                      {company.startup_name}
                    </li>
                  ))}
                </ul>
              )}
              {showAddOrganizationButton && (
                <button
                  type="button"
                  className="mt-2 bg-primary text-white px-5 py-2 rounded-lg w-full text-sm"
                  onClick={handleOpenModal}
                >
                  Company not found? Add it here!
                </button>
              )}
              {errorsMobile.organization_name && (
                <p className="text-red-500">
                  {errorsMobile.organization_name.message}
                </p>
              )}
            </div>

            {renderStatusMessage(true)}

            <button
              type="submit"
              disabled={!isValidMobile || loading}
              className={`rounded-md ${
                isValidMobile && !loading
                  ? "bg-primary"
                  : "bg-gray-300 cursor-not-allowed"
              } text-sm px-4 py-3 text-white flex items-center justify-center uppercase font-semibold w-full`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="mt-4 text-center flex flex-col gap-4">
            <div className="text-center font-medium tracking-wide mt-2">
              Already have an account?{" "}
              <Link href="/login">
                <span className="text-primary font-semibold">Sign in</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* --------- Desktop View --------- */}
      <div className="hidden lg:flex h-screen justify-evenly items-center bg-gradient-to-b from-yellow-100 via-yellow-200 to-yellow-300">
        <div className="w-7/12 h-screen flex items-center justify-center">
          <Image
            src="/tyn-login.png"
            alt="tyn-login"
            width={400}
            height={400}
          />
        </div>
        <div className="w-5/12 h-full bg-white">
          <div className="flex items-start justify-start flex-col gap-4 px-10 pt-10">
            <h2 className="font-bold text-3xl xl:text-5xl">Get Started</h2>
            <p className="font-light text-base xl:text-xl text-primary">
              Start your journey by creating an account
            </p>
          </div>
          <form
            onSubmit={handleSubmitDesktop(onSubmitDesktop)}
            className="flex flex-col gap-8 px-10 justify-center items-center pt-8"
          >
            <div className="flex flex-col items-start justify-start gap-2">
              <label htmlFor="first_name-desktop">Your Name</label>
              <input
                type="text"
                {...registerDesktop("first_name", { required: "Name is required" })}
                id="first_name-desktop"
                placeholder="Enter your name"
                className="text-base placeholder:text-base px-5 py-3 h-10 outline-none rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder:text-gray-300 border-none w-80"
              />
              {errorsDesktop.first_name && (
                <p className="text-red-500">{errorsDesktop.first_name.message}</p>
              )}
            </div>

            <div className="flex flex-col items-start justify-start gap-2">
              <label htmlFor="email-desktop">Your Email</label>
              <input
                type="email"
                {...registerDesktop("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                id="email-desktop"
                placeholder="Enter your email"
                className="text-base placeholder:text-base px-5 py-3 h-10 outline-none rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder:text-gray-300 border-none w-80"
              />
              {errorsDesktop.email && (
                <p className="text-red-500">{errorsDesktop.email.message}</p>
              )}
            </div>

            <div className="flex flex-col items-start justify-start gap-2">
              <label htmlFor="password-desktop">Password</label>
              <input
                type="password"
                {...registerDesktop("password", { required: "Password is required" })}
                id="password-desktop"
                placeholder="Enter your password"
                autoComplete="off"
                className="text-base placeholder:text-base px-5 py-3 h-10 outline-none rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder:text-gray-300 border-none w-80"
              />
              {errorsDesktop.password && (
                <p className="text-red-500">{errorsDesktop.password.message}</p>
              )}
            </div>

            <div className="flex flex-col items-start justify-start gap-2">
              <label htmlFor="organization-desktop">Organization</label>
              <div className="relative w-80">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  id="organization-desktop"
                  placeholder="Enter your organization"
                  className="text-base placeholder:text-base px-5 py-3 h-10 outline-none rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder:text-gray-300 border-none w-full"
                />
                {searchResults.length > 0 && (
                  <ul className="absolute z-50 bg-white w-full border border-gray-300 mt-1 rounded-md max-h-36 overflow-y-auto shadow-md">
                    {searchResults.slice(0, 5).map((company) => (
                      <li
                        key={company.startup_id}
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent input blur
                          handleCompanySelect(company);
                        }}
                        className="cursor-pointer p-2 hover:bg-gray-100 text-sm"
                      >
                        {company.startup_name}
                      </li>
                    ))}
                  </ul>
                )}
                {showAddOrganizationButton && (
                  <button
                    type="button"
                    className="mt-2 bg-primary text-white px-5 py-2 rounded-lg w-full text-sm"
                    onClick={handleOpenModal}
                  >
                    Company not found? Add it here!
                  </button>
                )}
                {errorsDesktop.organization_name && (
                  <p className="text-red-500">
                    {errorsDesktop.organization_name.message}
                  </p>
                )}
              </div>
            </div>

            {renderStatusMessage(false)}

            <div className="w-full flex justify-center">
              <button
                type="submit"
                disabled={!isValidDesktop || loading}
                className={`rounded-md ${
                  isValidDesktop && !loading
                    ? "bg-primary"
                    : "bg-gray-300 cursor-not-allowed"
                } text-sm px-4 py-2 text-white flex items-center justify-center font-semibold`}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </form>

          <div className="flex justify-center items-center gap-2 mt-4">
            <div className="font-semibold">Already have an account?</div>
            <Link href="/login" className="text-primary font-semibold">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {showModal && <RegistrationModel onClose={handleCloseModal} />}
    </>
  );
};

export default RegisterPage;