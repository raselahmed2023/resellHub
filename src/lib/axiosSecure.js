"use client";
import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "/server/api",
  withCredentials: true,
});

export default axiosSecure;