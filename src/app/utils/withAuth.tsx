"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const WithAuth = (Component: React.ComponentType) => {
    return function AuthenticatedComponent(props: any) {
        const router = useRouter();

        useEffect(() => {
            const token = typeof window !== "undefined" ? localStorage.getItem("jwtAccessToken") : null;

            if (!token) {
                router.push("/login");
            }
        }, []);

        return <Component {...props} />;
    };
};

export default WithAuth;
