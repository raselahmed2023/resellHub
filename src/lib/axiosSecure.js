const axiosSecure = axios.create({
  baseURL: "/api/server/api",
  withCredentials: true,
});