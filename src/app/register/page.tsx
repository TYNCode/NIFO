"use client";

import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { User } from "../interfaces";

interface FormData {
  first_name: string;
  email: string;
  organization_name: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitted, isValid },
  } = useForm<FormData>();

  const [registerResponse, setRegisterResponse] = useState<string>(" ");
  const [regsiterState, setRegisterState] = useState<User | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    console.log("dataforregister", data);
    let urlforregister = `https://theyellow.group/api/user/register/`;
    setLoading(true);
    try {
      const response = await axios.post(urlforregister, data);
      // Handle both 200 and 201 as successful statuses.
      if (response.status === 200 || response.status === 201) {
        setRegisterResponse(response.data.message);
        setRegisterState(response.data.user);
        localStorage.setItem("jwtAccessToken", response.data.tokens.access_token);
        localStorage.setItem("jwtRefreshToken", response.data.tokens.refresh_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        console.log('Navigation attempt following registration...');
        router.push("/");  // Navigation to home or another page
      } else {
        // If the status is neither 200 nor 201, throw an error.
        throw new Error(`Registration failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("error in registration", error);
      // It's good practice to handle unexpected statuses or network errors gracefully.
      setRegisterResponse(error.response?.data?.message?.email[0] || "Unexpected error during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    if (regsiterState) {
      localStorage.setItem("userInfo", JSON.stringify(regsiterState));
    }
  }, [regsiterState]);

  //Lap component
  const registerLap = () => {
    return (
      <div className=" flex justify-evenly items-center bg-gradient-to-b from-yellow-100 to-yellow-400">
        <div className="w-7/12 h-screen flex items-center justify-center">
          <div>
            <Image
              src="/tyn-login.png"
              alt="tyn-login"
              width={400}
              height={400}
            />
          </div>
        </div>
        <div className="w-5/12  bg-white order-2 md:order-2 h-screen">
          <div className="flex items-start justify-start flex-col gap-y-2 xl:gap-4 p-8">
            <h2 className="font-bold text-3xl xl:text-5xl">Get started</h2>
            <p className="font-light text-base xl:text-xl text-gray-400">
              Start your journey by creating an account
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 xl:gap-8 px-10 justify-center items-center  xl:pt-8"
          >
            <div className="flex flex-col items-start justify-start gap-2">
              <label htmlFor="first_name">Full Name</label>
              <input
                type="text"
                {...register("first_name", { required: "Name is required" })}
                id="first_name"
                autoComplete="given-name"
                placeholder="Enter your Name"
                className="text-base placeholder-text-base px-5 py-3 h-10 outline-none rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder-text-gray-300 border border-solid w-80"
              />
              {errors.first_name && isSubmitted && (
                <p className="text-red-500 capitalize">
                  {errors.first_name.message}
                </p>
              )}
            </div>
            <div className="flex flex-col items-start justify-start gap-2">
              <label htmlFor="email">Organisation Email</label>
              <input
                type="email"
                id="email"
                autoComplete="off"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Enter your email"
                className="text-base placeholder-text-base px-5 py-3 h-10 outline-none rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder-text-gray-300 border border-solid w-80"
              />
              {errors.email && isSubmitted && (
                <p className="text-red-500 capitalize">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col items-start justify-start gap-2">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                })}
                autoComplete="off"
                id="password"
                placeholder="Enter your password"
                className="text-base placeholder:text-base px-5 py-3 h-10 outline-none rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder:text-gray-300 border border-solid w-80"
              />
              {errors.password && (
                <p className="text-red-500 capitalize">
                  {errors.password.message as React.ReactNode}
                </p>
              )}
            </div>

            <div className="flex flex-col items-start justify-start gap-2">
              <label htmlFor="organization">Organization Name</label>
              <input
                type="text"
                {...register("organization_name", {
                  required: "Organization name is required",
                })}
                autoComplete="off"
                id="organization"
                placeholder="Enter your organization"
                className="text-base placeholder-text-base px-5 py-3 h-10 outline-none rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder-text-gray-300 border border-solid w-80"
              />
              {errors.organization_name && isSubmitted && (
                <p className="text-red-500 capitalize">
                  {errors.organization_name.message}
                </p>
              )}
            </div>

            {isSubmitted && registerResponse && (
              <p className="text-blue-500 capitalize">{registerResponse}</p>
            )}

            <button
              type="submit"
              disabled={!isValid}
              className={`rounded-md ${
                isValid ? "bg-blue-500" : "bg-gray-300 cursor-not-allowed"
              } text-sm px-4 py-2 text-white flex items-center justify-center uppercase font-semibold`}
            >
              {loading ? "Registering" : "Register"}
            </button>
          </form>
          <div className="flex justify-center items-center gap-2 mt-8 md:mt-10">
            <div>Already have an account?</div>
            <Link href="/login" className="underline">
              Sign-in
            </Link>
          </div>
        </div>
      </div>
    );
  };

  //Mobile component
  const registerMobile = () => {
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
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 px-10 mt-4"
          >
            <div className="flex flex-col items-start justify-start gap-2 w-full">
              <input
                type="text"
                {...register("first_name", {
                  required: "Full name is required",
                })}
                id="first_name"
                placeholder="Full Name"
                className="text-base px-5 py-3 outline-none rounded-lg shadow w-full"
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
                className="text-base px-5 py-3 outline-none rounded-lg shadow w-full"
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
                className="text-base px-5 py-3 outline-none rounded-lg shadow w-full"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div className="flex flex-col items-start justify-start gap-2 w-full">
              <input
                type="text"
                {...register("organization_name", {
                  required: "Organization name is required",
                })}
                id="organization_name"
                placeholder="Organization Name"
                className="text-base px-5 py-3 outline-none rounded-lg shadow w-full"
              />
              {errors.organization_name && (
                <p className="text-red-500">
                  {errors.organization_name.message}
                </p>
              )}
            </div>
            {isSubmitted && registerResponse && (
              <p className="text-blue-500 capitalize items-center flex justify-center">{registerResponse}</p>
            )}
            <button
              type="submit"
              disabled={!isValid}
              className={`rounded-md ${
                isValid ? "bg-blue-500" : "bg-gray-300 cursor-not-allowed"
              } text-sm px-4 py-2 text-white flex items-center justify-center uppercase font-semibold w-full rounded-lg`}
            >
             {loading ? "Registering" : "Register"}
            </button>
            <div className="mt-4 text-center font-medium tracking-wide">
              Already have an account?{" "}
              <Link href="/login">
                <span className="text-blue-400 font-bold underline">
                  Sign-in
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="hidden lg:block">{registerLap()}</div>

      <div className="lg:hidden">{registerMobile()}</div>
    </div>
  );
};

export default RegisterPage;
