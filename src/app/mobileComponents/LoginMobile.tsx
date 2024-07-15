"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface FormData {
  email: string;
  password: string;
}

interface LoginMobileProps {
  handleSubmit: any;
  onSubmit: any;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isSubmitted: boolean;
  loginResponse: string;
}

const LoginMobile: React.FC<LoginMobileProps> = ({
  handleSubmit,
  onSubmit,
  register,
  errors,
  isSubmitted,
  loginResponse
}) => {
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
         Sign in
      </div>
      <div className="w-full h-4/5 flex flex-col  mt-8 bg-white py-8 rounded-t-3xl shadow-lg">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-10 mt-4"
        >
          <div className="font-semibold text-xl my-2"> 
            Welcome!
          </div>
          <div className="flex flex-col items-start justify-start gap-2 w-full">
            <input
              type="text"
              {...register("email", { required: "Email is required" })}
              id="email"
              placeholder="Email Address"
              className="text-base px-5 py-3 outline-none rounded-lg shadow w-full"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col items-start justify-start gap-2 w-full">
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              id="password"
              placeholder="Password"
              className="text-base px-5 py-3 outline-none rounded-lg shadow w-full"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>
          {isSubmitted && loginResponse && <p className="text-blue-500">{loginResponse}</p>}
          <div className="flex justify-end items-end text-blue-400 font-bold text-sm">
          <Link href="/changePassword">Forgot Password?</Link>
          </div>
          <button type="submit" className="bg-gray-300 text-white px-4 py-2  font-semibold mt-4 w-full rounded-lg">
            Sign in
          </button>
          <div className="mt-4 text-center font-medium tracking-wide">
            Not a member? <Link href="/register"><span className="text-blue-400 font-bold underline">Sign-up</span></Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginMobile;
