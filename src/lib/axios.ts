import axios from "axios";
import { getToken } from "./storage";
const apiClient = axios.create({
  baseURL: "",
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
