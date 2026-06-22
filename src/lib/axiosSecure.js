// lib/axiosSecure.js
"use client";
import axios from "axios";
import { authClient } from "@/lib/auth-client";

const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // .env.local: NEXT_PUBLIC_API_URL=http://localhost:5000
});

axiosSecure.interceptors.request.use(async (config) => {
  const session = await authClient.getSession();
  const token   = session?.data?.session?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosSecure;