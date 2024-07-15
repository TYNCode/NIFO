"use client";

import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { User } from "../interfaces";

interface FormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitted, isValid },
  } = useForm<FormData>({
    mode: "onChange",
  });

  const [loginResponse, setLoginResponse] = useState<string>(" ");
  const [loginState, setLoginState] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://theyellow.group/api/user/login/`,
        data
      );
      if (response.status === 200) {
        setLoginResponse("Login successful.");
        router.push("/");
        setLoginState(response.data.user);
        localStorage.setItem(
          "jwtAccessToken",
          response.data.tokens.access_token
        );
        localStorage.setItem(
          "jwtRefreshToken",
          response.data.tokens.refresh_token
        );
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        throw new Error(`Login failed with status: ${response.status}`);
      }
    } catch (error) {
      setLoginResponse(
        error?.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
      console.error("error in login", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loginState) {
      localStorage.setItem("userInfo", JSON.stringify(loginState));
    }
  }, [loginState]);

  const loginLap = () => {
    return (
      <div>
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
                    {errors.email.message as React.ReactNode}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-start justify-start gap-2">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  autoComplete="off"
                  {...register("password", {
                    required: "Password is required",
                  })}
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

              {isSubmitted && loginResponse && (
                <p className="text-blue-500 capitalize">{loginResponse}</p>
              )}

              <div>
                <Link href="/changePassword" className="underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={!isValid || loading}
                className={`rounded-md ${
                  isValid && !loading
                    ? "bg-blue-500"
                    : "bg-gray-300 cursor-not-allowed"
                } text-sm px-4 py-2 text-white flex items-center justify-center uppercase font-semibold`}
              >
                {loading ? "Signing in..." : "Sign in"}
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
      </div>
    );
  };

  const loginMobile = () => {
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
          Sign In
        </div>
        <div className="w-full h-4/5 flex flex-col gap-5 mt-8 bg-white py-8 rounded-t-3xl shadow-lg">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-10 px-10 mt-4"
          >
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              id="email"
              placeholder="Email Address"
              className="text-base px-5 py-3 outline-none rounded-lg shadow w-full"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
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
            {isSubmitted && loginResponse && (
              <p className="text-blue-500">{loginResponse}</p>
            )}
            <button
              type="submit"
              disabled={!isValid || loading}
              className={`rounded-md ${
                isValid && !loading
                  ? "bg-blue-500"
                  : "bg-gray-300 cursor-not-allowed"
              } text-sm px-4 py-2 text-white flex items-center justify-center uppercase font-semibold w-full`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <div className="mt-4 text-center flex flex-col gap-4">
            <Link
              href="/changePassword"
              className="underline font-semibold text-blue-400"
            >
              Forgot Password?
            </Link>
            <div className="text-center font-medium tracking-wide mt-2">
              Not a member?{" "}
              <Link href="/register">
                <span className="text-blue-400 font-bold underline">
                  Sign-up
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="hidden lg:block">{loginLap()}</div>
      <div className="lg:hidden">{loginMobile()}</div>
    </div>
  );
};

export default LoginPage;
