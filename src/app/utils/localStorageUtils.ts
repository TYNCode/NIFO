import { User, UserInfo } from "../interfaces";

export const getUserInfo = (): UserInfo | null => {
    try {
        const userInfo = localStorage.getItem("user");
        if (userInfo) {
          return JSON.parse(userInfo);
        }
        return null;
      } catch (error) {
        console.error("Failed to parse user info from localStorage:", error);
        return null;
      }
};

// Utility function to check if user has TYN role for trends management
export const hasTYNRole = (): boolean => {
    try {
        const userInfo = getUserInfo();
        return userInfo?.role?.toLowerCase() === 'tyn' || userInfo?.is_superuser === true;
    } catch (error) {
        console.error("Failed to check TYN role:", error);
        return false;
    }
};

// Utility function to check if user can manage trends (create, update, delete)
export const canManageTrends = (): boolean => {
    return hasTYNRole();
};

// Utility function to check if user can read trends (all authenticated users)
export const canReadTrends = (): boolean => {
    try {
        const userInfo = getUserInfo();
        return !!userInfo; // Any authenticated user can read trends
    } catch (error) {
        console.error("Failed to check read permissions:", error);
        return false;
    }
};

// Utility function to get user role for display purposes
export const getUserRole = (): string | null => {
    try {
        const userInfo = getUserInfo();
        return userInfo?.role || null;
    } catch (error) {
        console.error("Failed to get user role:", error);
        return null;
    }
};
