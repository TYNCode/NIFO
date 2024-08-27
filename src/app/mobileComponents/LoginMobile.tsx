import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { FormData } from "../interfaces";

interface LoginMobileProps {
  onSubmit: SubmitHandler<FormData>;
  loading: boolean;
  message?: string;
  error?: string;
}

const LoginMobile: React.FC<LoginMobileProps> = ({ onSubmit, loading, message, error }) => {
  const { handleSubmit, register, formState: { errors, isSubmitted, isValid } } = useForm<FormData>({ mode: "onChange" });

  return (
    <div className="h-screen w-full flex flex-col justify-start pt-10 items-start bg-gradient-to-b from-yellow-300 to-yellow-100">
      <div className="w-full flex justify-center">
        <Image src="/tyn-login.png" alt="Login Image" width={150} height={150} />
      </div>
      <div className="text-4xl text-white font-semibold px-14 py-4">
        Sign In
      </div>
      <div className="w-full h-4/5 flex flex-col gap-5 mt-8 bg-white py-8 rounded-t-3xl shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10 px-10 mt-4">
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
            <p className={`text-${error ? "red" : "blue"}-500`}>{message}</p>
          )}
          {error && (
            <p className="text-red-500">{error}</p>
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
          <Link href="/changePassword" className="underline font-semibold text-blue-400">
            Forgot Password?
          </Link>
          <div className="text-center font-medium tracking-wide mt-2">
            Not a member?{" "}
            <Link href="/register">
              <span className="text-blue-400 font-bold underline">Sign-up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginMobile;
