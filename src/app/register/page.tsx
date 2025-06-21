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
import AuthForm from "../components/AuthForm";

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

  const handleRegister = (data: FormData) => {
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
      {/* --------- Mobile View (below md) --------- */}
      <div className="flex md:hidden min-h-screen bg-gradient-to-b from-yellow-300 to-yellow-100 flex-col items-center justify-center">
        <div className="w-full flex justify-center pt-10">
          <Image src="/tyn-login.png" alt="Register Image" width={96} height={96} className="w-24 h-24" />
        </div>
        <div className="w-full flex flex-col gap-5 mt-8 bg-white py-8 rounded-t-3xl">
          <div className="text-2xl sm:text-4xl text-primary font-semibold px-10 py-0">Get Started</div>
          <p className="text-sm md:text-base xl:text-xl text-primary px-10">Start your journey by creating an account</p>
          <AuthForm
            mode="register"
            onSubmit={handleRegister}
            loading={loading}
            error={error}
            message={message}
            showName={true}
            showOrg={true}
            buttonText="Register"
            footerText="Already have an account?"
            footerLinkText="Sign in"
            footerLinkHref="/login"
          />
        </div>
      </div>

      {/* --------- iPad View (md to lg) --------- */}
      <div className="hidden md:flex lg:hidden min-h-screen bg-gradient-to-b from-yellow-300 to-yellow-100 items-center justify-center">
        <div className="w-full min-h-screen flex flex-col justify-center">
          <div className="w-full h-full bg-white flex flex-col justify-center px-4 py-8 sm:px-8">
            <div className="flex flex-col items-center mb-6">
              <Image src="/tyn-login.png" alt="Register Image" width={96} height={96} className="w-24 h-24" />
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mt-4">Get Started</h2>
              <p className="text-base text-primary mt-2">Start your journey by creating an account</p>
            </div>
            <AuthForm
              mode="register"
              onSubmit={handleRegister}
              loading={loading}
              error={error}
              message={message}
              showName={true}
              showOrg={true}
              buttonText="Register"
              footerText="Already have an account?"
              footerLinkText="Sign in"
              footerLinkHref="/login"
            />
          </div>
        </div>
      </div>

      {/* --------- Laptop/Desktop View --------- */}
      <div className="hidden lg:flex min-h-screen bg-gradient-to-b from-yellow-100 via-yellow-200 to-yellow-300">
        <div className="flex flex-col md:flex-row w-full items-center justify-center">
          <div className="flex-1 flex items-center justify-center p-4">
            <Image
              src="/tyn-login.png"
              alt="Register Image"
              width={400}
              height={400}
              className="w-full max-w-xs md:max-w-md h-auto mx-auto"
            />
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-lg md:max-w-xl bg-white rounded-lg shadow-lg p-6 md:p-10 overflow-auto">
              <div className="flex items-start justify-start flex-col gap-4 pb-4">
                <h2 className="font-bold text-xl md:text-3xl xl:text-5xl">Get Started</h2>
                <p className="font-light text-sm md:text-base xl:text-xl text-primary">
                  Start your journey by creating an account
                </p>
              </div>
              <AuthForm
                mode="register"
                onSubmit={handleRegister}
                loading={loading}
                error={error}
                message={message}
                showName={true}
                showOrg={true}
                buttonText="Register"
                footerText="Already have an account?"
                footerLinkText="Sign in"
                footerLinkHref="/login"
              />
            </div>
          </div>
        </div>
      </div>

      {showModal && <RegistrationModel onClose={handleCloseModal} />}
    </>
  );
};

export default RegisterPage;