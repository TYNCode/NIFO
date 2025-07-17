"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "./login/page";
import HomePage from "./components/HomePage/HomePage";
import { getRoleBasedRoute } from "./utils/roleBasedRouting";

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isInitialCheckDone, setIsInitialCheckDone] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      let userInfo = localStorage.getItem("user");

      let parsedUserInfo = userInfo ? JSON.parse(userInfo) : null;

      if (parsedUserInfo) {
        // Check if user should be redirected to role-specific route
        const route = getRoleBasedRoute(parsedUserInfo);
        if (route !== "/") {
          router.push(route);
          return;
        }
        
        setIsLoggedIn(true);
      } else {
        router.push("/login");
      }

      setIsInitialCheckDone(true);
    }
  }, [router]);

  return (
    <main className="">
      {isInitialCheckDone &&
        (isLoggedIn ? (
          <div className="">
            <HomePage />
          </div>
        ) : (
          <LoginPage />
        ))}
    </main>
  );
}
