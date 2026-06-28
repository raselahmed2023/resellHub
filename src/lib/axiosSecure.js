"use client";
import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "/api/server",
  withCredentials: true,
});

export default axiosSecure;