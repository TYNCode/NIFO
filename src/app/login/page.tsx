"use client";

import React, { useEffect } from "react";
import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { loginUser, clearLoginState } from "../redux/features/auth/loginSlice";

import LoginMobile from "../mobileComponents/LoginMobile";
import { FormData } from "../interfaces";
import LoginLap from "../components/LaptopView/LoginLap";

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, message } = useAppSelector((state) => state.login);

  const handleLogin: SubmitHandler<FormData> = (data) => {
    dispatch(loginUser(data));
  };

  useEffect(() => {
    if (message && !loading) {
      if (!error) {
        router.push("/");
      }
      dispatch(clearLoginState());
    }
  }, [message, error, loading, router, dispatch]);

  return (
    <div>
      <div className="hidden lg:block">
        <LoginLap
          onSubmit={handleLogin}
          loading={loading}
          message={message}
          error={error}
        />
      </div>
      <div className="lg:hidden">
        <LoginMobile
          onSubmit={handleLogin}
          loading={loading}
          message={message}
          error={error}
        />
      </div>
    </div>
  );
};

export default LoginPage;
