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
        "http://127.0.0.1:8000/user/forgot-password/",
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
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-yellow-100 to-yellow-400">
      <div className="w-full flex justify-center mt-10">
        <Image
          src="/tyn-login.png"
          alt="Login Image"
          width={150}
          height={150}
        />
      </div>
      <div className="text-4xl text-white font-semibold px-14 py-4">
        Reset Password
      </div>
      <div className="w-full h-screen bg-white py-8 rounded-t-3xl shadow-lg mt-8 flex flex-col items-center">
        <p className="font-light text-lg text-gray-400 px-10 text-center">
          Enter your email address here
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 px-10 mt-4 w-full"
        >
          <div className="flex flex-col items-start gap-2 w-full">
            <input
              type="email"
              autoComplete="off"
              id="email"
              placeholder="Enter your email"
              className="text-base px-5 py-3 outline-none rounded-lg shadow border-none w-full"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="rounded-md bg-blue-500 text-sm px-4 py-2 text-white flex items-center justify-center uppercase font-semibold w-full"
          >
            Submit
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center text-sm text-blue-600">
            {message}
          </div>
        )}

        <div className="flex justify-center items-center gap-2 mt-8 text-sm">
          <div>Not a member?</div>
          <Link href="/register" className="underline">
            Sign-up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
