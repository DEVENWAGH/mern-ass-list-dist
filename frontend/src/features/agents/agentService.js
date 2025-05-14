import api from "../../utils/axiosConfig";

const API_URL = "/api/agents/";

// Create new agent
const createAgent = async (agentData) => {
  const response = await api.post(API_URL, agentData);
  return response.data;
};

// Get all agents
const getAgents = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

// Get agent by ID
const getAgentById = async (id) => {
  const response = await api.get(API_URL + id);
  return response.data;
};

// Update agent
const updateAgent = async (id, agentData) => {
  const response = await api.put(API_URL + id, agentData);
  return response.data;
};

// Delete agent
const deleteAgent = async (id) => {
  const response = await api.delete(API_URL + id);
  return response.data;
};

const agentService = {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
};

export default agentService;
