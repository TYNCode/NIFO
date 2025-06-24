"use client";

import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { loginUser, clearLoginState } from "../redux/features/auth/loginSlice";
import { FormData } from "../interfaces";
import AuthForm from "../components/AuthForm";

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, message } = useAppSelector((state) => state.login);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (data) => {
    dispatch(loginUser(data));
  };

  useEffect(() => {
    if (message && !loading && !error) {
      router.push("/");
      dispatch(clearLoginState()); // Only reset after successful login
    }
  }, [message, error, loading, router, dispatch]);

  return (
    <>
      {/* --------- Mobile View (below md) --------- */}
      <div className="flex md:hidden min-h-screen bg-gradient-to-b from-yellow-300 to-yellow-100 flex-col items-center justify-center">
        <div className="w-full flex justify-center pt-10">
          <Image src="/tyn-login.png" alt="Login Image" width={96} height={96} className="w-24 h-24" />
        </div>
        <div className="w-full flex flex-col gap-5 mt-8 bg-white py-8 rounded-t-3xl">
          <div className="text-2xl sm:text-4xl text-primary font-semibold px-10 py-0">Sign in</div>
          <p className="text-sm md:text-base xl:text-xl text-primary px-10">Sign in if you have an account here</p>
          <AuthForm
            mode="login"
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            message={message}
            buttonText="Sign in"
            footerText="Not a member?"
            footerLinkText="Sign-up"
            footerLinkHref="/register"
          />
        </div>
      </div>

      {/* --------- iPad View (md to lg) --------- */}
      <div className="hidden md:flex lg:hidden min-h-screen bg-gradient-to-b from-yellow-300 to-yellow-100 items-center justify-center">
        <div className="w-full min-h-screen flex flex-col justify-center">
          <div className="w-full h-full bg-white flex flex-col justify-center px-4 py-8 sm:px-8">
            <div className="flex flex-col items-center mb-6">
              <Image src="/tyn-login.png" alt="Login Image" width={96} height={96} className="w-24 h-24" />
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mt-4">Sign in</h2>
              <p className="text-base text-primary mt-2">Sign in if you have an account here</p>
            </div>
            <AuthForm
              mode="login"
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
              message={message}
              buttonText="Sign in"
              footerText="Not a member?"
              footerLinkText="Sign-up"
              footerLinkHref="/register"
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
              alt="tyn-login"
              width={400}
              height={400}
              className="w-full max-w-xs md:max-w-md h-auto mx-auto"
            />
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-lg md:max-w-xl bg-white rounded-lg shadow-lg p-6 md:p-10 overflow-auto">
              <div className="flex items-start justify-start flex-col gap-4 pb-4">
                <h2 className="font-bold text-xl md:text-3xl xl:text-5xl">Sign in</h2>
                <p className="font-light text-sm md:text-base xl:text-xl text-primary">
                  Sign in if you have an account here
                </p>
              </div>
              <AuthForm
                mode="login"
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                message={message}
                buttonText="Sign in"
                footerText="Not a member?"
                footerLinkText="Sign-up"
                footerLinkHref="/register"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;