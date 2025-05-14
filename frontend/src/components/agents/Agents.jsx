import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/axiosConfig";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await api.get("/api/agents");
        setAgents(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching agents:", err);
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <div className="agents-container">
      <h1>Agents</h1>
      <Link to="/add-agent" className="btn btn-primary mb-3">
        Add New Agent
      </Link>

      {loading ? (
        <p>Loading agents...</p>
      ) : agents.length === 0 ? (
        <p>No agents found</p>
      ) : (
        <div className="agents-list">
          {agents.map((agent) => (
            <div key={agent._id} className="agent-card">
              <h3>{agent.name}</h3>
              <p>Email: {agent.email}</p>
              <p>Phone: {agent.phone}</p>
              <p>Status: {agent.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Agents;
