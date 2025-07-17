import { useRouter } from "next/navigation";

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: "startup" | "enterprise" | "tyn";
  organization_name: string;
  is_primary_user: boolean;
}

export const getUserFromStorage = (): User | null => {
  if (typeof window === "undefined") return null;
  
  const userInfo = localStorage.getItem("user");
  if (!userInfo) return null;
  
  try {
    return JSON.parse(userInfo);
  } catch (error) {
    console.error("Error parsing user info:", error);
    return null;
  }
};

export const getRoleBasedRoute = (user: User | null): string => {
  if (!user) return "/login";
  
  switch (user.role) {
    case "startup":
      return "/startup/dashboard";
    case "enterprise":
    case "tyn":
      return "/";
    default:
      return "/login";
  }
};

export const checkAuthAndRole = (requiredRole?: string): User | null => {
  const user = getUserFromStorage();
  
  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    const correctRoute = getRoleBasedRoute(user);
    if (typeof window !== "undefined") {
      window.location.href = correctRoute;
    }
    return null;
  }
  
  return user;
};

export const useRoleBasedRedirect = () => {
  const router = useRouter();
  
  const redirectToRoleBasedRoute = (user: User | null) => {
    const route = getRoleBasedRoute(user);
    router.push(route);
  };
  
  return { redirectToRoleBasedRoute };
}; 