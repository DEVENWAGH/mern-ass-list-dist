import axios from "axios";

const API_URL = "/api/csv/";

// Upload and distribute CSV
const uploadCsv = async (csvData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  const response = await axios.post(API_URL + "upload", csvData, config);
  return response.data;
};

// Get distributions by agent
const getDistributions = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + "distributions", config);
  return response.data;
};

const csvService = {
  uploadCsv,
  getDistributions,
};

export default csvService;
