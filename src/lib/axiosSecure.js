import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "/",  // same domain!
  withCredentials: true,
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