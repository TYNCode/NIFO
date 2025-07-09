import React from "react";
import { useForm } from "react-hook-form";
import { FormData } from "../interfaces";

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (data: FormData) => void;
  loading?: boolean;
  error?: string | null;
  message?: string | null;
  showName?: boolean;
  showOrg?: boolean;
  buttonText?: string;
  footerText?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
  orgValue?: string;
  onOrgChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  orgInputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  renderOrgInput?: (props: any) => React.ReactNode;
}

const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onSubmit,
  loading = false,
  error,
  message,
  showName = false,
  showOrg = false,
  buttonText,
  footerText,
  footerLinkText,
  footerLinkHref,
  orgValue,
  onOrgChange,
  orgInputProps,
  renderOrgInput,
}) => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({ mode: "onChange" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full h-screen sm:h-full max-w-md mx-auto px-8 sm:p-0">
      {showName && (
        <div className="flex flex-col items-start gap-2 w-full">
          <label htmlFor="first_name" className="text-sm md:text-base">Your Name</label>
          <input
            type="text"
            {...register("first_name", { required: "Name is required" })}
            id="first_name"
            placeholder="Enter your name"
            className="h-10 md:h-12 px-3 py-2 text-base placeholder:text-base outline-none rounded-lg shadow placeholder:text-gray-300 border-none w-full"
          />
          {errors.first_name && <p className="text-red-500 text-xs md:text-sm">{errors.first_name.message}</p>}
        </div>
      )}
      <div className="flex flex-col items-start gap-2 w-full">
        <label htmlFor="email" className="text-sm md:text-base">Your Email</label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          id="email"
          placeholder="Enter your email"
          className="h-10 md:h-12 px-3 py-2 text-base placeholder:text-base outline-none rounded-lg shadow placeholder:text-gray-300 border-none w-full"
        />
        {errors.email && <p className="text-red-500 text-xs md:text-sm">{errors.email.message}</p>}
      </div>
      <div className="flex flex-col items-start gap-2 w-full">
        <label htmlFor="password" className="text-sm md:text-base">Password</label>
        <input
          type="password"
          autoComplete="off"
          {...register("password", { required: "Password is required" })}
          id="password"
          placeholder="Enter your password"
          className="h-10 md:h-12 px-3 py-2 text-base outline-none rounded-lg shadow placeholder:text-gray-300 border-none w-full"
        />
        {errors.password && <p className="text-red-500 text-xs md:text-sm">{errors.password.message}</p>}
        {/* Forgot password link, only show in login mode */}
        {mode === "login" && (
          <a
            href="/changePassword"
            className="text-primary text-xs md:text-sm mt-1 hover:underline self-end"
            style={{ marginTop: '4px' }}
          >
            Forgot password?
          </a>
        )}
      </div>
      {showOrg && (
        renderOrgInput
          ? renderOrgInput({
              // Pass any extra props if needed
            })
          : (
            <div className="flex flex-col items-start gap-2 w-full">
              <label htmlFor="organization_name" className="text-sm md:text-base">Organization</label>
              <input
                type="text"
                id="organization_name"
                placeholder="Enter your organization"
                className="h-10 md:h-12 px-3 py-2 text-base placeholder:text-base outline-none rounded-lg shadow placeholder:text-gray-300 border-none w-full"
                {...(orgValue !== undefined && onOrgChange
                  ? {
                      value: orgValue,
                      onChange: onOrgChange,
                      ...orgInputProps,
                    }
                  : register("organization_name", { required: "Organization is required" })
                )}
              />
              {errors.organization_name && <p className="text-red-500 text-xs md:text-sm">{errors.organization_name.message}</p>}
            </div>
          )
      )}
      {message && (
        <p className={`${error ? "text-red-500" : "text-blue-500"} text-xs md:text-base`}>{message}</p>
      )}
      {error && <p className="text-red-500 text-xs md:text-base">{error}</p>}
      <button
        type="submit"
        disabled={loading || !isValid}
        className={`rounded-md ${
          loading || !isValid ? "bg-gray-300 cursor-not-allowed" : "bg-primary"
        } text-xs md:text-sm px-4 py-2 text-white flex items-center justify-center font-semibold w-full`}
      >
        {loading ? (buttonText === "Register" ? "Registering..." : "Signing in...") : buttonText}
      </button>
      <div className="flex justify-center items-center gap-2 mt-8 xl:mt-20">
        <div className="font-semibold text-xs md:text-base">{footerText}</div>
        {footerLinkHref && footerLinkText && (
          <a href={footerLinkHref} className="text-primary font-semibold text-xs md:text-base">
            {footerLinkText}
          </a>
        )}
      </div>
    </form>
  );
};

export default AuthForm;