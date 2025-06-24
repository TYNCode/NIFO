"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { registerUser } from "../redux/features/auth/registerSlice";
import { fetchStartupSearchSuggestions, clearSearchResults, fetchEnterpriseSearchSuggestions } from "../redux/features/companyprofile/companyProfileSlice";
import AuthForm from "../components/AuthForm";
import RegistrationModel from "../components/RegisterModel/RegisterModel";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<"startup" | "enterprise">("startup");
  const [orgQuery, setOrgQuery] = useState("");
  const [orgId, setOrgId] = useState<number | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const { searchResults } = useAppSelector((state) => state.companyProfile);
  const { loading, error, message } = useAppSelector((state) => state.register);

  const router = useRouter();
  const handleRegister = (formData) => {
    dispatch(
      registerUser({
        ...formData,
        role: tab,
        is_primary_user: true,
        organization_id: orgId,
        organization_name: orgQuery || formData.organization_name,
      })
    );
  };

  const handleTabSwitch = (role) => {
    setTab(role);
    setOrgQuery("");
    setOrgId(null);
    dispatch(clearSearchResults());
    setShowSuggestions(false);
  };

  const handleOrgInputChange = (e) => {
    setOrgQuery(e.target.value);
    setOrgId(null);
    if (e.target.value.length > 1) {
      if (tab === 'startup') {
        dispatch(fetchStartupSearchSuggestions(e.target.value));
      } else {
        dispatch(fetchEnterpriseSearchSuggestions(e.target.value));
      }
      setShowSuggestions(true);
    } else {
      dispatch(clearSearchResults());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setOrgQuery(suggestion.startup_name || suggestion.enterprise_name);
    setOrgId(suggestion.startup_id || suggestion.enterprise_id);
    setShowSuggestions(false);
    dispatch(clearSearchResults());
  };

  useEffect(() => {
    if (message) {
      router.push("/");
    }
  }, [message]);

  const openAddCompanyModal = () => setShowAddCompanyModal(true);
  const closeAddCompanyModal = () => setShowAddCompanyModal(false);

  const renderTabSwitch = () => (
    <div className="flex w-full justify-center my-4">
      <div className="inline-flex bg-gray-100 p-1 rounded-full shadow-inner">
        {['startup', 'enterprise'].map((role: any) => (
          <button
            key={role}
            type="button"
            onClick={() => handleTabSwitch(role)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${tab === role ? 'bg-yellow-300 text-white shadow-md' : 'text-gray-600 hover:text-black'
              }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );

  const renderOrgInput = (props) => (
    <div className="flex flex-col items-start gap-2 w-full relative">
      <label htmlFor="organization_name" className="text-sm md:text-base">Organization</label>
      <input
        type="text"
        id="organization_name"
        placeholder="Enter your organization"
        className="h-10 md:h-12 px-3 py-2 text-base placeholder:text-base outline-none rounded-lg shadow placeholder:text-gray-300 border-none w-full"
        value={orgQuery}
        onChange={handleOrgInputChange}
        autoComplete="off"
        onFocus={() => orgQuery.length > 1 && setShowSuggestions(true)}
        {...props}
      />
      {showSuggestions && (
        <div className="absolute left-0 right-0 top-full z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchResults.length > 0 ? (
            searchResults.map((s) => (
              <div
                key={s.startup_id || s.enterprise_id}
                className="px-4 py-2 cursor-pointer hover:bg-yellow-100"
                onClick={() => handleSuggestionClick(s)}
              >
                {s.startup_name || s.enterprise_name}
              </div>
            ))
          ) : (
            orgQuery.length > 1 && (
              <div className="px-4 py-2 text-gray-500 flex justify-between items-center">
                Company not found?
                <button className="ml-2 text-blue-600 underline" type="button" onClick={openAddCompanyModal}>Add new</button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile */}
      <div className="flex md:hidden min-h-screen bg-gradient-to-b from-yellow-300 to-yellow-100 flex-col items-center justify-center">
        <Image src="/tyn-login.png" alt="Register Image" width={96} height={96} className="w-24 h-24 mt-10" />
        <div className="w-full flex flex-col gap-1 mt-4 bg-white py-8 rounded-t-3xl">
          <h2 className="text-2xl sm:text-4xl text-primary font-semibold px-10">Get Started</h2>
          <p className="text-sm md:text-base xl:text-xl text-primary px-10">Start your journey by registering as a</p>
          {renderTabSwitch()}
          <AuthForm
            mode="register"
            onSubmit={handleRegister}
            showName
            showOrg
            orgValue={orgQuery}
            onOrgChange={handleOrgInputChange}
            orgInputProps={{ autoComplete: "off", onFocus: () => orgQuery.length > 1 && setShowSuggestions(true) }}
            loading={loading}
            error={error}
            message={message}
            buttonText="Register"
            footerText="Already have an account?"
            footerLinkText="Sign in"
            footerLinkHref="/login"
            renderOrgInput={renderOrgInput}
          />
        </div>
      </div>

      {/* iPad */}
      <div className="hidden md:flex lg:hidden min-h-screen bg-gradient-to-b from-yellow-300 to-yellow-100 items-center justify-center">
        <div className="w-full bg-white px-4 py-8 sm:px-8 rounded-lg shadow-lg">
          <div className="flex flex-col items-center mb-6">
            <Image src="/tyn-login.png" alt="Register Image" width={96} height={96} className="w-24 h-24" />
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mt-4">Get Started</h2>
            <p className="text-base text-primary mt-2">Start your journey by registering as a</p>
          </div>
          {renderTabSwitch()}
          <AuthForm
            mode="register"
            onSubmit={handleRegister}
            showName
            showOrg
            orgValue={orgQuery}
            onOrgChange={handleOrgInputChange}
            orgInputProps={{ autoComplete: "off", onFocus: () => orgQuery.length > 1 && setShowSuggestions(true) }}
            loading={loading}
            error={error}
            message={message}
            buttonText="Register"
            footerText="Already have an account?"
            footerLinkText="Sign in"
            footerLinkHref="/login"
            renderOrgInput={renderOrgInput}
          />
        </div>
      </div>

      {/* Laptop/Desktop */}
      <div className="hidden lg:flex min-h-screen bg-gradient-to-b from-yellow-100 via-yellow-200 to-yellow-300">
        <div className="flex w-full items-center justify-center">
          <div className="flex-1 flex items-center justify-center">
            <Image src="/tyn-login.png" alt="Register Image" width={400} height={400} className="w-full max-w-xs md:max-w-md h-auto mx-auto" />
          </div>
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-xl bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl xl:text-4xl font-bold mb-2">Get Started</h2>
              <p className="text-sm xl:text-base text-primary mb-6">Start your journey by registering as a</p>
              {renderTabSwitch()}
              <AuthForm
                mode="register"
                onSubmit={handleRegister}
                showName
                showOrg
                orgValue={orgQuery}
                onOrgChange={handleOrgInputChange}
                orgInputProps={{ autoComplete: "off", onFocus: () => orgQuery.length > 1 && setShowSuggestions(true) }}
                loading={loading}
                error={error}
                message={message}
                buttonText="Register"
                footerText="Already have an account?"
                footerLinkText="Sign in"
                footerLinkHref="/login"
                renderOrgInput={renderOrgInput}
              />
            </div>
          </div>
        </div>
      </div>

      {showAddCompanyModal && <RegistrationModel onClose={closeAddCompanyModal} defaultType={tab} />}
    </>
  );
};

export default RegisterPage;
