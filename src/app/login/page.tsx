"use client";

import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { loginUser, clearLoginState } from "../redux/features/auth/loginSlice";
import { FormData } from "../interfaces";

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, message } = useAppSelector((state) => state.login);

  // Mobile form
  const {
    handleSubmit: handleSubmitMobile,
    register: registerMobile,
    formState: { errors: errorsMobile, isValid: isValidMobile },
    trigger: triggerMobile,
  } = useForm<FormData>({
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Desktop form
  const {
    handleSubmit: handleSubmitDesktop,
    register: registerDesktop,
    formState: { errors: errorsDesktop, isValid: isValidDesktop },
    trigger: triggerDesktop,
  } = useForm<FormData>({
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmitMobile: SubmitHandler<FormData> = async (data) => {
    const isValid = await triggerMobile();
    if (!isValid) return;
    dispatch(loginUser(data));
  };

  const onSubmitDesktop: SubmitHandler<FormData> = async (data) => {
    const isValid = await triggerDesktop();
    if (!isValid) return;
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
      {/* --------- Mobile View --------- */}
      <div className="block lg:hidden h-full w-full flex-col justify-start pt-10 items-start bg-gradient-to-b from-yellow-300 to-yellow-100">
        <div className="w-full flex justify-center">
          <Image src="/tyn-login.png" alt="Login Image" width={150} height={150} />
        </div>

        <div className="w-full h-4/5 flex flex-col gap-5 mt-8 bg-white py-8 rounded-t-3xl">
          <div className="text-2xl sm:text-4xl text-primary font-semibold px-10 py-0">Sign In</div>
          <form onSubmit={handleSubmitMobile(onSubmitMobile)} className="flex flex-col gap-6 px-10 mt-4">
            <input
              type="email"
              {...registerMobile("email", { required: "Email is required" })}
              id="email-mobile"
              placeholder="Email Address"
              className="text-base px-5 py-3 outline-none rounded-lg shadow border-none w-full"
            />
            {errorsMobile.email && <p className="text-red-500">{errorsMobile.email.message}</p>}

            <input
              type="password"
              {...registerMobile("password", { required: "Password is required" })}
              id="password-mobile"
              placeholder="Password"
              className="text-base px-5 py-3 outline-none rounded-lg shadow border-none w-full"
            />
            {errorsMobile.password && <p className="text-red-500">{errorsMobile.password.message}</p>}

            {message && (
              <p className={`${error ? "text-red-500" : "text-blue-500"} text-sm`}>{message}</p>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="w-full flex justify-end">
              <Link href="/changePassword" className="text-primary text-sm font-semibold">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || !isValidMobile}
              className={`rounded-md ${
                loading || !isValidMobile ? "bg-gray-300 cursor-not-allowed" : "bg-primary"
              } text-sm px-4 py-3 text-white flex items-center justify-center uppercase font-semibold w-full`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-4 text-center flex flex-col gap-4">
            <div className="text-center font-medium tracking-wide mt-2">
              Not a member?{" "}
              <Link href="/register">
                <span className="text-primary font-semibold">Sign-up</span>
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
        <div className="w-5/12 h-full bg-white">
          <div className="flex items-start justify-start flex-col gap-4 px-10 pt-20">
            <h2 className="font-bold text-3xl xl:text-5xl">Sign in</h2>
            <p className="font-light text-base xl:text-xl text-primary">
              Sign in if you have an account here
            </p>
          </div>
          <form
            onSubmit={handleSubmitDesktop(onSubmitDesktop)}
            className="flex flex-col gap-8 px-10 justify-center items-center pt-8"
          >
            <div className="flex flex-col items-start justify-start gap-2">
              <label htmlFor="email-desktop">Your Email</label>
              <input
                type="email"
                {...registerDesktop("email", { required: "Email is required" })}
                id="email-desktop"
                placeholder="Enter your email"
                className="text-base placeholder:text-base px-5 py-3 h-10 outline-none rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder:text-gray-300 border-none w-80"
              />
              {errorsDesktop.email && <p className="text-red-500">{errorsDesktop.email.message}</p>}
            </div>

            <div className="flex flex-col items-start justify-start gap-2">
              <label htmlFor="password-desktop">Password</label>
              <input
                type="password"
                autoComplete="off"
                {...registerDesktop("password", { required: "Password is required" })}
                id="password-desktop"
                placeholder="Enter your password"
                className="text-base placeholder:text-base px-5 py-3 h-10 outline-none rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder:text-gray-300 border-none w-80"
              />
              {errorsDesktop.password && <p className="text-red-500">{errorsDesktop.password.message}</p>}
            </div>

            {message && (
              <p className={`${error ? "text-red-500" : "text-blue-500"}`}>{message}</p>
            )}
            {error && <p className="text-red-500">{error}</p>}

            <div className="w-full flex justify-center">
              <Link href="/changePassword" className="text-primary font-semibold text-sm">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || !isValidDesktop}
              className={`rounded-md ${
                loading || !isValidDesktop ? "bg-gray-300 cursor-not-allowed" : "bg-primary"
              } text-sm px-4 py-2 text-white flex items-center justify-center font-semibold`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="flex justify-center items-center gap-2 mt-8 xl:mt-40">
            <div className="font-semibold">Not a member?</div>
            <Link href="/register" className="text-primary font-semibold">
              Sign-up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;