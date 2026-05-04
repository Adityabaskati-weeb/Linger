import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("campusiq-auth");
  const parsed = raw ? JSON.parse(raw) : null;
  const accessToken = parsed?.state?.accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
