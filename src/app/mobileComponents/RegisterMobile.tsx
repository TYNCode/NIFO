import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FormData } from '../interfaces';
import Image from 'next/image';
import Link from 'next/link';

interface RegisterMobileProps {
  onSubmit: SubmitHandler<FormData>;
  loading: boolean;
  message?: string;
  error?: string;
}

const RegisterMobile: React.FC<RegisterMobileProps> = ({
  onSubmit,
  loading,
  message,
  error,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid, isSubmitting, isSubmitted },
  } = useForm<FormData>({
    mode: 'onChange',
  });

  return (
    <div className="h-screen w-full flex flex-col justify-start pt-10 items-start bg-gradient-to-b from-yellow-300 to-yellow-100">
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
              {...register('first_name', {
                required: 'Full name is required',
              })}
              id="first_name"
              placeholder="Full Name"
              className="text-base px-5 py-3 outline-none rounded-lg shadow w-full"
            />
            {errors.first_name && (
              <p className="text-red-500">{errors.first_name.message}</p>
            )}
          </div>
          <div className="flex flex-col items-start justify-start gap-2 w-full">
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              id="email"
              placeholder="Email Address"
              className="text-base px-5 py-3 outline-none rounded-lg shadow w-full"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col items-start justify-start gap-2 w-full">
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              id="password"
              placeholder="Password"
              className="text-base px-5 py-3 outline-none rounded-lg shadow w-full"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="flex flex-col items-start justify-start gap-2 w-full">
            <input
              type="text"
              {...register('organization_name', {
                required: 'Organization name is required',
              })}
              id="organization_name"
              placeholder="Organization Name"
              className="text-base px-5 py-3 outline-none rounded-lg shadow w-full"
            />
            {errors.organization_name && (
              <p className="text-red-500">{errors.organization_name.message}</p>
            )}
          </div>
          {!loading && (message || error) && (
            <p className={`text-base capitalize text-center ${error ? 'text-red-500' : 'text-blue-500'}`}>
              {message || error}
            </p>
          )}
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`rounded-md ${
              isValid ? 'bg-blue-500' : 'bg-gray-300 cursor-not-allowed'
            } text-sm px-4 py-2 text-white flex items-center justify-center uppercase font-semibold w-full rounded-lg`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          <div className="mt-4 text-center font-medium tracking-wide">
            Already have an account?{' '}
            <Link href="/login">
              <span className="text-blue-400 font-bold underline">Sign-in</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterMobile;
