import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAgents } from "../features/agents/agentSlice";
import api from "../utils/axiosConfig";

const CsvUpload = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { agents } = useSelector((state) => state.agent);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [distributions, setDistributions] = useState({});
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    dispatch(getAgents());
  }, [dispatch]);

  const handleFileChange = (e) => {
    setFileError("");
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Check file extension
    const fileExt = selectedFile.name.split(".").pop().toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(fileExt)) {
      setFileError("Only CSV, XLSX, and XLS files are allowed");
      e.target.value = null;
      setFile(null);
      return;
    }

    // Check file size (limit to 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFileError("File size should not exceed 5MB");
      e.target.value = null;
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    if (!agents || agents.length === 0) {
      toast.error("You need at least one agent to distribute tasks to");
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", file);

    setLoading(true);
    try {
      const response = await api.post("/api/csv/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setDistributions(response.data.data);
      toast.success("File uploaded and tasks distributed successfully");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error uploading file";
      toast.error(errorMsg);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Upload CSV and Distribute Tasks
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Upload a file with contacts to distribute among agents
      </p>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="csvFile"
              className="block text-gray-700 font-bold mb-2"
            >
              Upload File (CSV, XLSX, XLS)
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                id="csvFile"
                onChange={handleFileChange}
                accept=".csv,.xlsx,.xls"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            {fileError && (
              <p className="mt-2 text-sm text-red-600">{fileError}</p>
            )}
            <p className="mt-2 text-sm text-gray-500">
              File should contain columns: FirstName, Phone, Notes
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded"
            >
              Back to Dashboard
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded flex items-center"
              disabled={loading || !file || agents.length === 0}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Upload and Distribute
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {agents.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You need to add agents before you can distribute tasks.
                <button
                  onClick={() => navigate("/agents/add")}
                  className="ml-2 font-medium underline text-yellow-700 hover:text-yellow-600"
                >
                  Add an agent now
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {Object.keys(distributions).length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Distribution Results</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Agent
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Assigned Items
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.keys(distributions).map((agentId) => {
                  const agent = agents.find((a) => a._id === agentId);
                  return (
                    <tr key={agentId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {agent ? agent.name : "Unknown Agent"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {agent ? agent.email : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {distributions[agentId].length} items
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() =>
                            document
                              .getElementById(`modal-${agentId}`)
                              .classList.remove("hidden")
                          }
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Items
                        </button>

                        {/* Modal for this agent's items */}
                        <div
                          id={`modal-${agentId}`}
                          className="hidden fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center"
                        >
                          <div className="bg-white rounded-lg p-8 max-w-3xl w-full">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-xl font-bold">
                                Items for {agent ? agent.name : "Unknown Agent"}
                              </h3>
                              <button
                                onClick={() =>
                                  document
                                    .getElementById(`modal-${agentId}`)
                                    .classList.add("hidden")
                                }
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <svg
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Name
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Phone
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                      Notes
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {distributions[agentId].map((item, index) => (
                                    <tr key={index}>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.firstName}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.phone}
                                      </td>
                                      <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                                        {item.notes}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CsvUpload;
