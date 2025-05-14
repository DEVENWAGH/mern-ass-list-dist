import axios from "axios";

const API_URL = "/api/agents/";

// Create new agent
const createAgent = async (agentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, agentData, config);
  return response.data;
};

// Get all agents
const getAgents = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Get agent by ID
const getAgentById = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + id, config);
  return response.data;
};

// Update agent
const updateAgent = async (id, agentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + id, agentData, config);
  return response.data;
};

// Delete agent
const deleteAgent = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + id, config);
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
