import axios from "axios";

const API_URL = "/api/lists/";

// Upload and distribute a list
const uploadList = async (formData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  const response = await axios.post(API_URL + "upload", formData, config);
  return response.data;
};

// Get all lists
const getLists = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Get list by ID
const getListById = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + id, config);
  return response.data;
};

// Get agent's list items
const getAgentListItems = async (agentId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + "agent/" + agentId, config);
  return response.data;
};

const listService = {
  uploadList,
  getLists,
  getListById,
  getAgentListItems,
};

export default listService;
