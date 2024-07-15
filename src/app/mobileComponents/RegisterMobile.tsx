import React from "react";
import Image from "next/image";
import Link from "next/link";
import { UseFormRegister, FieldErrors, SubmitHandler } from "react-hook-form";

interface FormData {
  first_name: string;
  email: string;
  organization_name: string;
  password: string;
}

interface RegisterMobileProps {
  handleSubmit: any;
  onSubmit: SubmitHandler<FormData>;
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  isSubmitted: boolean;
  registerResponse: string;
  isValid: boolean;
  loading: boolean;
}

const RegisterMobile: React.FC<RegisterMobileProps> = ({
  handleSubmit,
  onSubmit,
  register,
  errors,
  isSubmitted,
  registerResponse,
  isValid,
  loading
}) => {
  return (
    <div className="md:hidden h-screen w-full flex flex-col justify-start pt-10 items-start bg-gradient-to-b from-yellow-300 to-yellow-100">
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
              {...register("first_name", { required: "Full name is required" })}
              id="first_name"
              placeholder="Full Name"
              className="text-base px-5 py-3 outline-none rounded-lg shadow w-full"
            />
            {errors.first_name && <p className="text-red-500">{errors.first_name.message}</p>}
          </div>
          <div className="flex flex-col items-start justify-start gap-2 w-full">
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              id="email"
              placeholder="Email Address"
              className="text-base px-5 py-3 outline-none rounded-lg shadow w-full"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col items-start justify-start gap-2 w-full">
            <input
              type="text"
              {...register("organization_name", { required: "Organization name is required" })}
              id="organization_name"
              placeholder="Organization Name"
              className="text-base px-5 py-3 outline-none rounded-lg shadow w-full"
            />
            {errors.organization_name && <p className="text-red-500">{errors.organization_name.message}</p>}
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
          {isSubmitted && registerResponse && <p className="text-blue-500">{registerResponse}</p>}
          <button type="submit" disabled={!isValid} className="bg-blue-500 text-white px-4 py-2 font-semibold mt-4 w-full rounded-lg">
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="mt-4 text-center font-medium tracking-wide">
            Already have an account? <Link href="/login"><span className="text-blue-400 font-bold underline">Sign-in</span></Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterMobile;
