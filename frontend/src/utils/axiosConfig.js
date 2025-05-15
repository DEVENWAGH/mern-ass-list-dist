import axios from "axios";
import { toast } from "react-toastify";

// Determine API URL based on environment
let API_URL = "https://mern-ass.onrender.com"; // Production default

// Try to get URL from environment variables in a browser-safe way
try {
  // First check Vite environment variables
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) {
    API_URL = import.meta.env.VITE_API_URL;
  }
  // Fall back to window.env for compatibility with non-Vite environments
  else if (typeof window !== "undefined" && window.env?.REACT_APP_API_URL) {
    API_URL = window.env.REACT_APP_API_URL;
  }
} catch (e) {
  console.warn("Unable to access environment variables, using default API URL");
}

// Log API URL during development for debugging
if (import.meta.env.DEV) {
  console.log("API URL:", API_URL);
}

// Create axios instance with consistent configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - adds auth token to all requests
api.interceptors.request.use(
  (config) => {
    // Get auth token from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract error message
    const errorMessage =
      error.response?.data?.message || error.message || "Something went wrong";

    // Show toast notification
    toast.error(errorMessage);

    // Handle authentication errors
    if (error.response?.status === 401) {
      // Only clear user data if we're not already on the login page
      // to avoid an infinite redirect loop
      localStorage.removeItem("user");

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
