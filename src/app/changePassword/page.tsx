"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

interface IFormInput {
  email: string;
}

const ChangePassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await axios.post(
        "https://theyellow.group/api/user/forgot-password/",
        {
          email: data.email,
        }
      );
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <>
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
            <h2 className="font-bold text-5xl">Reset Password</h2>
            <p className="font-light text-xl text-gray-400">
              Enter your email address here
            </p>
          </div>
          <form
            className="flex flex-col gap-8 px-10 justify-center items-center pt-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col items-start justify-start gap-2">
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                autoComplete="off"
                id="email"
                placeholder="Enter your email"
                className="text-base placeholder:text-base px-5 py-3 h-10 outline-none rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder:text-gray-300 border border-solid w-80"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}
            </div>

            <button
              type="submit"
              className="rounded-md bg-blue-500 text-sm px-4 py-2 text-white flex items-center justify-center uppercase font-semibold"
            >
              Submit
            </button>
          </form>

          {/* Display any success or error message */}
          {message && (
            <div className="mt-4 text-center text-lg text-blue-600">
              {message}
            </div>
          )}

          <div className="flex justify-center items-center gap-2 mt-8">
            <div>Not a member?</div>
            <Link href="/register" className="underline">
              Sign-up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
