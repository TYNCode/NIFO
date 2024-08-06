import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormData } from "../../interfaces";
import Image from "next/image";
import Link from "next/link";

interface RegisterLapProps {
  onSubmit: SubmitHandler<FormData>;
  loading: boolean;
  message?: string;
  error?: string;
}

const RegisterLap: React.FC<RegisterLapProps> = ({ onSubmit, loading, message, error }) => {
  const { handleSubmit, register, formState: { errors, isValid, isSubmitting } } = useForm<FormData>({
    mode: "onChange", // Validate on change
  });

  return (
    <div className="flex justify-evenly items-center bg-gradient-to-b from-yellow-100 to-yellow-400">
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
      <div className="w-5/12 bg-white order-2 md:order-2 h-screen">
        <div className="flex items-start justify-start flex-col gap-y-2 xl:gap-4 p-8">
          <h2 className="font-bold text-3xl xl:text-5xl">Get started</h2>
          <p className="font-light text-base xl:text-xl text-gray-400">
            Start your journey by creating an account
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 xl:gap-8 px-10 justify-center items-center xl:pt-8"
        >
          <div className="flex flex-col items-start justify-start gap-2">
            <label htmlFor="first_name">Full Name</label>
            <input
              type="text"
              {...register("first_name", { required: "Name is required" })}
              id="first_name"
              placeholder="Enter your Name"
              className="text-base placeholder-text-base px-5 py-3 h-10 outline-none rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder-text-gray-300 border border-solid w-80"
            />
            {errors.first_name && (
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
            {errors.email && (
              <p className="text-red-500 capitalize">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col items-start justify-start gap-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              autoComplete="off"
              id="password"
              placeholder="Enter your password"
              className="text-base placeholder-text-base px-5 py-3 h-10 outline-none rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder-text-gray-300 border border-solid w-80"
            />
            {errors.password && (
              <p className="text-red-500 capitalize">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex flex-col items-start justify-start gap-2">
            <label htmlFor="organization">Organization Name</label>
            <input
              type="text"
              {...register("organization_name", { required: "Organization name is required" })}
              autoComplete="off"
              id="organization"
              placeholder="Enter your organization"
              className="text-base placeholder-text-base px-5 py-3 h-10 outline-none rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder-text-gray-300 border border-solid w-80"
            />
            {errors.organization_name && (
              <p className="text-red-500 capitalize">
                {errors.organization_name.message}
              </p>
            )}
          </div>

          {/* Success/Error Message */}
          {!loading && (message || error) && (
            <p className={`text-base capitalize ${error ? 'text-red-500' : 'text-blue-500'}`}>
              {message || error}
            </p>
          )}

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`rounded-md bg-blue-500 text-sm px-4 py-2 text-white flex items-center justify-center uppercase font-semibold ${isSubmitting || !isValid ? "cursor-not-allowed bg-gray-300" : ""}`}
          >
            {loading ? "Registering..." : "Register"}
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

export default RegisterLap;
