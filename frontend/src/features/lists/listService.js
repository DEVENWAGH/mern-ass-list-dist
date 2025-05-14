import api from "../../utils/axiosConfig";

const API_URL = "/api/lists/";

// Upload and distribute a list
const uploadList = async (formData, token) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const response = await api.post(API_URL + "upload", formData, config);
  return response.data;
};

// Get all lists
const getLists = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

// Get list by ID
const getListById = async (id) => {
  const response = await api.get(API_URL + id);
  return response.data;
};

// Get agent's list items
const getAgentListItems = async (agentId) => {
  const response = await api.get(API_URL + "agent/" + agentId);
  return response.data;
};

const listService = {
  uploadList,
  getLists,
  getListById,
  getAgentListItems,
};

export default listService;
