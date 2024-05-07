"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { User } from "../interfaces";
import api from "../components/Axios";

interface FormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitted },
  } = useForm<FormData>();

  const [loginResponse, setLoginResponse] = useState<string>(" ");
  const [loginState, setLoginState] = useState<User | undefined>(undefined);

  const onSubmit: SubmitHandler<FormData> = async (data, event) => {
    try {
      console.log(data, "data");
      const response = await axios.post(
        `https://theyellow.group/api/user/login/`,
        data
      );
      setLoginResponse(response.data.message);
      setLoginState(response.data.user);
      router.push("/");
      const { access_token, refresh_token } = response.data.tokens;
      localStorage.setItem("jwtAccessToken", access_token);
      localStorage.setItem("jwtRefreshToken", refresh_token);
    } catch (error) {
      setLoginResponse(error?.response?.data?.message);
      console.log("errorinlogin", error);
    }
  };

  useEffect(() => {
    if (loginState) {
      localStorage.setItem("userInfo", JSON.stringify(loginState));
    }
  }, [loginState]);

  return (
    <div className="h-screen flex justify-evenly items-center bg-gradient-to-b from-yellow-100 to-yellow-400">
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
      <div className="w-5/12 h-full bg-white">
        <div className="flex items-start justify-start flex-col gap-4 px-10 pt-20">
          <h2 className="font-bold text-5xl">Sign in</h2>
          <p className="font-light text-xl text-gray-400">
            Sign in if you have an account here
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8 px-10 justify-center items-center pt-8"
        >
          <div className="flex flex-col items-start justify-start gap-2">
            <label htmlFor="email">Your Email</label>
            <input
              type="text"
              autoComplete="off"
              {...register("email", {
                required: "Email is required",
              })}
              id="email"
              placeholder="Enter your email"
              className="text-base placeholder:text-base px-5 py-3 h-10 outline-none rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder:text-gray-300 border border-solid w-80"
            />
            {errors.email && (
              <p className="text-red-500 capitalize">
                {errors.email.message as ReactNode}
              </p>
            )}
          </div>

          <div className="flex flex-col items-start justify-start gap-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              autoComplete="off"
              id="password"
              {...register("password", {
                required: "Password is required",
              })}
              placeholder="Enter your password"
              className="text-base placeholder:text-base px-5 py-3 h-10 outline-none rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder:text-gray-300 border border-solid w-80"
            />
            {errors.password && (
              <p className="text-red-500 capitalize">
                {errors.password.message as ReactNode}
              </p>
            )}
          </div>

          {isSubmitted && loginResponse && (
            <p className="text-blue-500 capitalize">{loginResponse}</p>
          )}
          {/* {isSubmitted && errorMessage && (
      <p className="text-red-500 capitalize">{errorMessage}</p>
    )} */}

          <div>
            <Link href="/changePassword" className="underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="rounded-md bg-blue-500 text-sm px-4 py-2 text-white flex items-center justify-center uppercase font-semibold"
          >
            {/* {loading ? "Signing in" : "Sign in"} */}
            Sign in
          </button>
        </form>

        <div className="flex justify-center items-center gap-2 mt-8 xl:mt-40">
          <div>Not a member?</div>
          <Link href="/register" className="underline">
            Sign-up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
