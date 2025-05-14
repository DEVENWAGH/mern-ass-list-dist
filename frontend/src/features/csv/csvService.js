import api from "../../utils/axiosConfig";

const API_URL = "/api/csv/";

// Upload and distribute CSV
const uploadCsv = async (csvData) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  const response = await api.post(API_URL + "upload", csvData, config);
  return response.data;
};

// Get distributions by agent
const getDistributions = async () => {
  const response = await api.get(API_URL + "distributions");
  return response.data;
};

const csvService = {
  uploadCsv,
  getDistributions,
};

export default csvService;
