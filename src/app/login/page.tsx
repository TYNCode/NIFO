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

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitted, isValid },
  } = useForm<FormData>({ mode: "onChange" });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    dispatch(loginUser(data));
  };

  useEffect(() => {
    if (message && !loading) {
      if (!error) router.push("/");
      dispatch(clearLoginState());
    }
  }, [message, error, loading, router, dispatch]);

  return (
    <>
      {/* --------- Mobile View --------- */}
      <div className="block lg:hidden h-screen w-full flex-col justify-start pt-10 items-start bg-gradient-to-b from-yellow-300 to-yellow-100">
        <div className="w-full flex justify-center">
          <Image src="/tyn-login.png" alt="Login Image" width={150} height={150} />
        </div>
       
        <div className="w-full h-4/5 flex flex-col gap-5 mt-8 bg-white py-8 rounded-t-3xl shadow-lg">
        <div className="text-4xl text-black font-semibold px-14 py-0">Sign In</div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 px-10 mt-4">
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              id="email"
              placeholder="Email Address"
              className="text-base px-5 py-3 outline-none rounded-lg shadow border-none w-full"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              id="password"
              placeholder="Password"
              className="text-base px-5 py-3 outline-none rounded-lg shadow border-none w-full"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}

            {isSubmitted && message && (
              <p className={`text-${error ? "red" : "blue"}-500 text-sm`}>{message}</p>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="w-full flex justify-end">
              <Link href="/changePassword" className="text-primary text-sm font-semibold">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={!isValid || loading}
              className={`rounded-md ${
                isValid && !loading ? "bg-primary" : "bg-gray-300 cursor-not-allowed"
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
            <p className="font-light text-base xl:text-xl text-primary">Sign in if you have an account here</p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8 px-10 justify-center items-center pt-8"
          >
            <div className="flex flex-col items-start justify-start gap-2">
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                {...register("email", { required: "Email is required" })}
                id="email"
                placeholder="Enter your email"
                className="text-base placeholder:text-base px-5 py-3 h-10 outline-none rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder:text-gray-300  border-none w-80"
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col items-start justify-start gap-2">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                autoComplete="off"
                {...register("password", { required: "Password is required" })}
                id="password"
                placeholder="Enter your password"
                className="text-base placeholder:text-base px-5 py-3 h-10 outline-none rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder:text-gray-300  border-none w-80"
              />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>

            {isSubmitted && message && (
              <p className={`text-${error ? "red" : "blue"}-500`}>{message}</p>
            )}
            {error && <p className="text-red-500">{error}</p>}

            <div className="w-full flex justify-center">
              <Link href="/changePassword" className="text-primary font-semibold text-sm">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={!isValid || loading}
              className={`rounded-md ${
                isValid && !loading ? "bg-primary" : "bg-gray-300 cursor-not-allowed"
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
