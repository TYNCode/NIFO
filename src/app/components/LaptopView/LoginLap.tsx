"use client"
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface FormData {
  email: string;
  password: string;
}

interface LoginLapProps {
  handleSubmit: any;
  onSubmit: any;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isSubmitted: boolean;
  loginResponse: string;
}

const LoginLap: React.FC<LoginLapProps> = ({
  handleSubmit,
  onSubmit,
  register,
  errors,
  isSubmitted,
  loginResponse
}) => {
  return (
    <div className="h-screen flex justify-evenly items-center bg-gradient-to-b from-yellow-100 to-yellow-400">
      <div className="w-7/12 h-screen flex items-center justify-center">
        <Image
          src="/tyn-login.png"
          alt="Login Image"
          width={400}
          height={400}
        />
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
              {...register("email", { required: "Email is required" })}
              id="email"
              placeholder="Enter your email"
              className="text-base px-5 py-3 outline-none rounded-lg shadow w-80"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col items-start justify-start gap-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              id="password"
              placeholder="Enter your password"
              className="text-base px-5 py-3 outline-none rounded-lg shadow w-80"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>
          {isSubmitted && loginResponse && <p className="text-blue-500">{loginResponse}</p>}
          <Link href="/changePassword">Forgot Password?</Link>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 uppercase font-semibold">
            Sign in
          </button>
          <div className="mt-8">
            Not a member? <Link href="/register">Sign-up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginLap;
