import axios from "axios";

const axiosPrivate = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosPrivate.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtAccessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Add response interceptor for token refresh logic ---
axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Prevent infinite loop
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("jwtRefreshToken");
        if (!refreshToken) throw new Error("No refresh token");
        // Call refresh endpoint (adjust URL if needed)
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/token/refresh/`,
          { refresh: refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );
        const newAccessToken = res.data.access || res.data.access_token;
        if (newAccessToken) {
          localStorage.setItem("jwtAccessToken", newAccessToken);
          // Update the Authorization header and retry the original request
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed: clear tokens and redirect to login
        localStorage.removeItem("jwtAccessToken");
        localStorage.removeItem("jwtRefreshToken");
        localStorage.removeItem("user");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
// --- End response interceptor ---

export default axiosPrivate;
