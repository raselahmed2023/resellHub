import axios from "axios";

const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true,
});

axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized - redirecting to login");
      // Optional: redirect to login page
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosSecure;