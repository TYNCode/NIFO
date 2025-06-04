// "use client";

// import React, { useEffect, useState } from "react";
// import { useForm, SubmitHandler } from "react-hook-form";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useAppDispatch, useAppSelector } from "../redux/hooks";
// import {
//   resetPassword,
//   clearResetState,
// } from "../redux/features/auth/resetPasswordSlice";

// interface IFormInput {
//   new_password: string;
//   confirm_new_password: string;
// }

// const ResetPasswordPage: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { loading, message, error } = useAppSelector(
//     (state) => state.resetPassword
//   );

//   const uidb64 = searchParams.get("uidb64") || "";
//   const token = searchParams.get("token") || "";

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors, isValid },
//   } = useForm<IFormInput>({ mode: "onChange" });

//   const onSubmit: SubmitHandler<IFormInput> = (data) => {
//     dispatch(
//       resetPassword({
//         uidb64,
//         token,
//         new_password: data.new_password,
//         confirm_new_password: data.confirm_new_password,
//       })
//     );
//   };

//   useEffect(() => {
//     if (message && !loading && !error) {
//       setTimeout(() => {
//         router.push("/login");
//       }, 1500);
//     }
//     return () => {
//       dispatch(clearResetState());
//     };
//   }, [message, error, loading, router, dispatch]);

//   return (
//     <>
//       {/* Mobile View */}
//       <div className="block lg:hidden h-screen w-full flex-col justify-start pt-10 items-start bg-gradient-to-b from-yellow-300 to-yellow-100">
//         <div className="w-full flex justify-center">
//           <Image src="/tyn-login.png" alt="Logo" width={150} height={150} />
//         </div>
//         <div className="w-full h-4/5 flex flex-col gap-5 mt-8 bg-white py-8 rounded-t-3xl shadow-lg">
//           <div className="text-4xl text-black font-semibold px-14">
//             Reset Password
//           </div>
//           <p className="text-base font-light text-primary px-14">
//             Enter your new password
//           </p>
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="flex flex-col gap-5 px-10 mt-2"
//           >
//             <input
//               type="password"
//               placeholder="New Password"
//               {...register("new_password", {
//                 required: "New password is required",
//               })}
//               className="text-base px-5 py-3 h-10 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] border-none w-80 placeholder:text-gray-300"
//             />
//             {errors.new_password && (
//               <p className="text-red-500 text-sm">
//                 {errors.new_password.message}
//               </p>
//             )}

//             <input
//               type="password"
//               placeholder="Confirm Password"
//               {...register("confirm_new_password", {
//                 required: "Confirm password is required",
//                 validate: (value) =>
//                   value === watch("new_password") || "Passwords do not match",
//               })}
//               className="text-base px-5 py-3 h-10 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] border-none w-80 placeholder:text-gray-300"
//             />
//             {errors.confirm_new_password && (
//               <p className="text-red-500 text-sm">
//                 {errors.confirm_new_password.message}
//               </p>
//             )}

//             {message && <p className="text-blue-600 text-sm">{message}</p>}
//             {error && <p className="text-red-500 text-sm">{error}</p>}

//             <button
//               type="submit"
//               disabled={!isValid || loading}
//               className={`rounded-md ${
//                 isValid && !loading
//                   ? "bg-primary"
//                   : "bg-gray-300 cursor-not-allowed"
//               } text-sm px-4 py-3 text-white flex items-center justify-center uppercase font-semibold w-full`}
//             >
//               {loading ? "Submitting..." : "Submit"}
//             </button>
//           </form>
//           <div className="text-center mt-6 text-sm">
//             Not a member?{" "}
//             <Link href="/register" className="text-primary font-semibold">
//               Sign-up
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Desktop View */}
//       <div className="hidden lg:flex h-screen justify-evenly items-center bg-gradient-to-b from-yellow-100 via-yellow-200 to-yellow-300">
//         <div className="w-7/12 h-screen flex items-center justify-center">
//           <Image src="/tyn-login.png" alt="Logo" width={400} height={400} />
//         </div>
//         <div className="w-5/12 h-full bg-white">
//           <div className="flex flex-col gap-4 px-10 pt-20">
//             <h2 className="font-bold text-3xl xl:text-5xl">Reset Password</h2>
//             <p className="font-light text-base xl:text-xl text-primary">
//               Enter your new password to reset your account
//             </p>
//           </div>
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="flex flex-col gap-6 px-10 pt-8 justify-center items-center"
//           >
//             <div className="flex flex-col gap-2">
//               <label>New Password</label>
//               <input
//                 type="password"
//                 placeholder="Enter your new password"
//                 {...register("new_password", {
//                   required: "New password is required",
//                 })}
//                 className="text-base px-5 py-3 h-10 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] border-none w-80 placeholder:text-gray-300"
//               />
//               {errors.new_password && (
//                 <p className="text-red-500 text-sm">
//                   {errors.new_password.message}
//                 </p>
//               )}
//             </div>

//             <div className="flex flex-col gap-2">
//               <label>Confirm Password</label>
//               <input
//                 type="password"
//                 placeholder="Re-enter your new password"
//                 {...register("confirm_new_password", {
//                   required: "Confirm password is required",
//                   validate: (value) =>
//                     value === watch("new_password") || "Passwords do not match",
//                 })}
//                 className="text-base px-5 py-3 h-10 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] border-none w-80 placeholder:text-gray-300"
//               />
//               {errors.confirm_new_password && (
//                 <p className="text-red-500 text-sm">
//                   {errors.confirm_new_password.message}
//                 </p>
//               )}
//             </div>

//             {message && <p className="text-blue-600 text-sm">{message}</p>}
//             {error && <p className="text-red-500 text-sm">{error}</p>}

//             <button
//               type="submit"
//               disabled={!isValid || loading}
//               className={`rounded-md ${
//                 isValid && !loading
//                   ? "bg-primary"
//                   : "bg-gray-300 cursor-not-allowed"
//               } text-sm px-4 py-2 text-white font-semibold w-80`}
//             >
//               {loading ? "Submitting..." : "Submit"}
//             </button>
//             <div className="flex justify-center items-center gap-2 mt-8 xl:mt-24">
//               <div className="font-semibold">Not a member?</div>
//               <Link href="/register" className="text-primary font-semibold">
//                 Sign-up
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ResetPasswordPage;


import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page