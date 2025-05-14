import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAgents } from "../features/agents/agentSlice";
import { toast } from "react-toastify";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access the auth and agent state
  const { user } = useSelector((state) => state.auth);
  const { agents, isLoading, isError, message } = useSelector(
    (state) =>
      state.agent || {
        agents: [],
        isLoading: false,
        isError: false,
        message: "",
      }
  );

  useEffect(() => {
    if (isError) {
      toast.error(message || "An error occurred");
    }

    dispatch(getAgents());
  }, [dispatch, isError, message]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome {user?.name || "User"}
        </h1>
        <p className="text-lg text-gray-600 font-medium">Agents Dashboard</p>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        {agents && agents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Total Agents
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {agents.length}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Active Agents
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {agents.filter((agent) => agent.status === "active").length}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg mb-8">
            <p className="text-lg text-gray-600 mb-4">
              You haven't added any agents yet
            </p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition-colors duration-300"
              onClick={() => navigate("/add-agent")}
            >
              Add Agent
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition-colors duration-300 flex items-center justify-center"
            onClick={() => navigate("/add-agent")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New Agent
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md transition-colors duration-300 flex items-center justify-center"
            onClick={() => navigate("/upload-csv")}
          >
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
            Upload CSV
          </button>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
