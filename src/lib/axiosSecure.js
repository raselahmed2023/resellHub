import axios from "axios";
import { authClient } from "./auth-client";

const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});


axiosSecure.interceptors.request.use(async (config) => {
  const session = await authClient.getSession();
  if (session?.data?.session?.token) {
    config.headers["Authorization"] = `Bearer ${session.data.session.token}`;
  }
  return config;
});

axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized - redirecting to login");
    }
    return Promise.reject(error);
  }
);

export default axiosSecure;