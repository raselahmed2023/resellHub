"use client";
import axios from "axios";
import { authClient } from "@/lib/auth-client";

const axiosSecure = axios.create({ 
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosSecure.interceptors.request.use(async (config) => {
  try {
    const session = await authClient.getSession();
    const token = session?.data?.session?.token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (e) {
    console.error("Session fetch error:", e);
  }
  return config;
});

axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosSecure;