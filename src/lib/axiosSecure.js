"use client";
import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "/api/server/api",
  withCredentials: true,
});

export default axiosSecure;