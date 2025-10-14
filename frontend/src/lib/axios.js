import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "dev" ? "http:localhost:3000/api" : "/api",
  withCredentials: true,
});
