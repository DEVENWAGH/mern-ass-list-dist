import React, { useState, useEffect } from "react";
import api from "../../utils/axiosConfig";

const DistributedLists = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState("all"); // 'all', 'byAgent'
  const [selectedAgent, setSelectedAgent] = useState("");
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch agents
        const agentsRes = await api.get("/api/agents");
        setAgents(agentsRes.data);

        // Fetch distributed lists
        const listsRes = await api.get("/api/lists");
        setLists(listsRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter lists by agent
  const filterListsByAgent = (agentId) => {
    setSelectedAgent(agentId);
    setCurrentView("byAgent");
  };

  // Reset to show all lists
  const showAllLists = () => {
    setCurrentView("all");
    setSelectedAgent("");
  };

  // Get lists to display based on current view
  const getDisplayedLists = () => {
    if (currentView === "all") {
      return lists;
    } else {
      return lists.filter((list) =>
        list.distributedTo.some((dist) => dist.agent === selectedAgent)
      );
    }
  };

  return (
    <div className="distributed-lists">
      <h1>Distributed Lists</h1>

      <div className="filter-controls">
        <button
          className={`btn ${
            currentView === "all" ? "btn-primary" : "btn-outline"
          }`}
          onClick={showAllLists}
        >
          Show All Lists
        </button>

        <div className="agent-filters">
          <span>Filter by Agent: </span>
          {agents.map((agent) => (
            <button
              key={agent._id}
              className={`btn ${
                selectedAgent === agent._id ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => filterListsByAgent(agent._id)}
            >
              {agent.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Loading lists...</p>
      ) : getDisplayedLists().length === 0 ? (
        <p>No distributed lists found</p>
      ) : (
        <div className="lists-container">
          {getDisplayedLists().map((list) => (
            <div key={list._id} className="list-card">
              <h3>{list.name}</h3>
              <p>Uploaded: {new Date(list.createdAt).toLocaleDateString()}</p>
              <p>Total Records: {list.totalRecords}</p>
              <div className="agents">
                <h4>Distributed to:</h4>
                <ul>
                  {list.distributedTo.map((distribution, index) => (
                    <li key={index}>
                      {agents.find((a) => a._id === distribution.agent)?.name ||
                        "Unknown Agent"}
                      ({distribution.recordCount} records)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DistributedLists;
