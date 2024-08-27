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
