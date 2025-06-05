import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://not-contest-cdn.openbuilders.xyz/api/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error);
    return Promise.reject(error);
  },
);

export default axiosInstance;
