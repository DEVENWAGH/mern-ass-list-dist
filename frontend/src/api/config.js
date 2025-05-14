const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const apiConfig = {
  baseUrl: API_URL,
  endpoints: {
    auth: "/api/auth",
    agents: "/api/agents",
    lists: "/api/lists",
  },
};

export default apiConfig;
