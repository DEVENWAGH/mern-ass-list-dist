import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDistributions, reset } from "../features/csv/csvSlice";
import { getAgents } from "../features/agents/agentSlice";
import Spinner from "../components/common/Spinner";

const ViewDistributions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { distributionHistory = {}, isLoading = false } = useSelector(
    (state) => state.csv || {}
  );
  const { agents = [] } = useSelector((state) => state.agent || {});

  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedFile, setSelectedFile] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      dispatch(getAgents());
      dispatch(getDistributions());
    }

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, dispatch]);

  // Get unique file names
  const fileNames = Object.keys(distributionHistory || {});

  // Filter distributions based on selected agent and file
  const getFilteredDistributions = () => {
    if (!distributionHistory) return {};

    // If no filter is applied, return all
    if (!selectedFile && !selectedAgent) {
      return distributionHistory;
    }

    // Filter by file name
    if (selectedFile && !selectedAgent) {
      return {
        [selectedFile]: distributionHistory[selectedFile],
      };
    }

    // Create filtered object
    const filtered = {};

    // Filter by both file and agent or just agent
    Object.keys(distributionHistory).forEach((fileName) => {
      if (selectedFile && fileName !== selectedFile) return;

      const fileData = distributionHistory[fileName];
      const agentDistributions = fileData.agentDistributions;

      // Check if the agent exists in this file's distributions
      if (selectedAgent && agentDistributions[selectedAgent]) {
        if (!filtered[fileName]) {
          filtered[fileName] = {
            ...fileData,
            agentDistributions: {},
          };
        }
        filtered[fileName].agentDistributions[selectedAgent] =
          agentDistributions[selectedAgent];
      } else if (!selectedAgent) {
        filtered[fileName] = fileData;
      }
    });

    return filtered;
  };

  const filteredDistributions = getFilteredDistributions();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
        View Distributions
      </h1>
      <p className="text-base md:text-lg text-gray-600 mb-6">
        View and filter contact distributions among agents
      </p>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/2">
            <label
              htmlFor="fileFilter"
              className="block text-gray-700 font-medium mb-2"
            >
              Filter by File
            </label>
            <select
              id="fileFilter"
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Files</option>
              {fileNames.map((fileName) => (
                <option key={fileName} value={fileName}>
                  {fileName}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/2">
            <label
              htmlFor="agentFilter"
              className="block text-gray-700 font-medium mb-2"
            >
              Filter by Agent
            </label>
            <select
              id="agentFilter"
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Agents</option>
              {agents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between mb-6">
          <button
            onClick={() => {
              setSelectedAgent("");
              setSelectedFile("");
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Clear Filters
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Display distributions */}
      {Object.keys(filteredDistributions).length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 text-center">
          <p className="text-gray-500">No distributions found</p>
        </div>
      ) : (
        Object.keys(filteredDistributions).map((fileName) => {
          const fileData = filteredDistributions[fileName];
          const uploadDate = new Date(fileData.uploadDate).toLocaleDateString();

          return (
            <div
              key={fileName}
              className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6"
            >
              <div className="border-b pb-4 mb-4">
                <h2 className="text-xl font-bold text-gray-800">{fileName}</h2>
                <p className="text-sm text-gray-600">Uploaded: {uploadDate}</p>
              </div>

              {Object.keys(fileData.agentDistributions).map((agentId) => {
                const agentData = fileData.agentDistributions[agentId];
                const agent = agentData.agent;
                const items = agentData.items;

                return (
                  <div key={agentId} className="mb-6 last:mb-0">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{agent.name}</h3>
                        <p className="text-sm text-gray-600">{agent.email}</p>
                      </div>
                      <span className="mt-2 md:mt-0 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {items.length} items
                      </span>
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
                          {items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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
                );
              })}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ViewDistributions;
