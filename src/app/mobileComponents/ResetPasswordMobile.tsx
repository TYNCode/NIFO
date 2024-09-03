"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const ResetPasswordMobile: React.FC = () => {
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
      // Handle error response
      setMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-100 to-yellow-400 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/tyn-login.png"
            alt="tyn-login"
            width={80}
            height={80}
            className="mb-4"
          />
          <h2 className="font-bold text-3xl mb-2 text-center">
            Reset Password
          </h2>
          <p className="text-sm text-gray-500 text-center">
            Enter your new password here
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                autoComplete="off"
                id="new-password"
                placeholder="New Password"
                className="text-base placeholder:text-base px-4 py-2 h-10 outline-none rounded-md shadow-sm border border-gray-300 w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                autoComplete="off"
                id="confirm-password"
                placeholder="Confirm Password"
                className="text-base placeholder:text-base px-4 py-2 h-10 outline-none rounded-md shadow-sm border border-gray-300 w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-md bg-blue-500 text-white font-semibold text-base uppercase hover:bg-blue-600"
            >
              Submit
            </button>
          </form>

          {message && (
            <div className="mt-4 text-center text-base text-red-500">
              {message}
            </div>
          )}

          <div className="flex justify-center items-center gap-2 mt-6 text-sm">
            <div>Not a member?</div>
            <Link href="/register" className="text-blue-500 underline">
              Sign-up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordMobile;
