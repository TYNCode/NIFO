"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { clearStatus, requestPasswordReset } from "../redux/features/auth/forgotPasswordSlice";


interface IFormInput {
  email: string;
}

const ChangePassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, message } = useAppSelector((state) => state.changePassword);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IFormInput>({ mode: "onChange" });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    dispatch(requestPasswordReset(data.email));
  };

  useEffect(() => {
    return () => {
      dispatch(clearStatus());
    };
  }, [dispatch]);

  return (
    <>
      {/* Mobile View */}
      <div className="block lg:hidden h-screen w-full flex-col justify-start pt-10 items-start bg-gradient-to-b from-yellow-300 to-yellow-100">
        <div className="w-full flex justify-center">
          <Image src="/tyn-login.png" alt="Logo" width={150} height={150} />
        </div>
        <div className="w-full h-4/5 flex flex-col gap-5 mt-8 bg-white py-8 rounded-t-3xl shadow-lg">
          <div className="text-4xl text-black font-semibold px-14">Reset Password</div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 px-10 mt-4">
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Enter your email"
              className="text-base px-5 py-3 rounded-lg shadow border-none w-full placeholder:text-gray-300"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            {message && <p className="text-blue-600 text-sm">{message}</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={!isValid || loading}
              className={`rounded-md ${
                isValid && !loading ? "bg-[#0070C0]" : "bg-gray-300 cursor-not-allowed"
              } text-sm px-4 py-3 text-white font-semibold uppercase`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
          <div className="text-center mt-6 text-sm">
            Not a member?{' '}
            <Link href="/register" className="text-[#0070C0] font-semibold">
              Sign-up
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex h-screen justify-evenly items-center bg-gradient-to-b from-yellow-100 via-yellow-200 to-yellow-300">
        <div className="w-7/12 h-screen flex items-center justify-center">
          <Image src="/tyn-login.png" alt="Logo" width={400} height={400} />
        </div>
        <div className="w-5/12 h-full bg-white">
          <div className="flex flex-col gap-4 px-10 pt-20">
            <h2 className="font-bold text-3xl xl:text-5xl">Reset Password</h2>
            <p className="font-light text-base xl:text-xl text-[#0070C0]">
              Enter your registered email to reset your password
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center items-center gap-6 px-10 pt-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                {...register("email", { required: "Email is required" })}
                placeholder="Enter your email"
                className="text-base px-5 py-3 h-10 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] border-none w-80 placeholder:text-gray-300"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            {message && <p className="text-blue-600 text-sm">{message}</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={!isValid || loading}
              className={`rounded-md w-80 ${
                isValid && !loading ? "bg-[#0070C0]" : "bg-gray-300 cursor-not-allowed"
              } text-sm px-4 py-2 text-white font-semibold`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
            <div className="flex justify-center items-center gap-2 mt-8 xl:mt-24">
              <div className="font-semibold">Not a member?</div>
              <Link href="/register" className="text-[#0070C0] font-semibold">
                Sign-up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
