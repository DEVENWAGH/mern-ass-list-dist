import axios from "axios";
import { toast } from "react-toastify";

// Create axios instance with base URL from environment or use relative paths
// Get API URL without using import.meta (which causes issues on some browsers)
let API_URL = "https://mern-ass.onrender.com"; // Default production URL

// Only use import.meta in supported environments
try {
  if (
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL
  ) {
    API_URL = import.meta.env.VITE_API_URL;
  } else if (
    typeof window !== "undefined" &&
    window.env &&
    window.env.REACT_APP_API_URL
  ) {
    API_URL = window.env.REACT_APP_API_URL;
  }
} catch (e) {
  console.warn("Unable to access import.meta, using default API URL");
}

console.log("API URL:", API_URL); // For debugging during development

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    // Show toast notification for errors
    toast.error(message);

    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Clear user data if token is invalid/expired
      localStorage.removeItem("user");

      // Redirect to login page if not already there
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
