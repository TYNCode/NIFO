"use client";

import React, { useEffect } from "react";
import { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  clearRegisterState,
  registerUser,
} from "../redux/features/auth/registerSlice";
import RegisterLap from "../components/LaptopView/RegisterLap";
import RegisterMobile from "../mobileComponents/RegisterMobile";

interface FormData {
  first_name: string;
  email: string;
  organization_name: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, message } = useAppSelector((state) => state.register);

  const handleRegister: SubmitHandler<FormData> = (data) => {
    dispatch(registerUser(data));
  };

  useEffect(() => {
    if (message && !loading) {
      if (!error) {
        router.push("/");
      }
      dispatch(clearRegisterState());
    }
  }, [message, error, loading, router, dispatch]);

  return (
    <div>
      <div className="hidden md:block">
        <RegisterLap
          onSubmit={handleRegister}
          loading={loading}
          message={message}
          error={error}
        />
      </div>
      <div className="block md:hidden">
        <RegisterMobile
          onSubmit={handleRegister}
          loading={loading}
          message={message}
          error={error}
        />
      </div>
    </div>
  );
};

export default RegisterPage;
