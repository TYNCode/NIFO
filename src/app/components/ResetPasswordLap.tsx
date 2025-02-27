"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const ResetPasswordLap: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const uidb64 = searchParams.get("uidb64");
  const token = searchParams.get("token");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/user/reset-password/",
        {
          uidb64: uidb64,
          token: token,
          new_password: newPassword,
          confirm_new_password: confirmPassword,
        }
      );
      setMessage(response.data.message);
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
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
            Enter your new password here
          </p>
        </div>
        <form
          className="flex flex-col gap-8 px-10 justify-center items-center pt-8"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col items-start justify-start gap-2">
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              autoComplete="off"
              id="new-password"
              placeholder="Enter your password"
              className="text-base placeholder:text-base px-5 py-3 h-10 outline-none rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder:text-gray-300 border border-solid w-80"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col items-start justify-start gap-2">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              autoComplete="off"
              id="confirm-password"
              placeholder="Confirm your password"
              className="text-base placeholder:text-base px-5 py-3 h-10 outline-none rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] placeholder:text-gray-300 border border-solid w-80"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-blue-500 text-sm px-4 py-2 text-white flex items-center justify-center uppercase font-semibold"
          >
            Submit
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center text-lg text-blue-600">
            {message}
          </div>
        )}

        <div className="flex justify-center items-center gap-2 mt-8 xl:mt-40">
          <div>Not a member?</div>
          <Link href="/register" className="underline">
            Sign-up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordLap;
