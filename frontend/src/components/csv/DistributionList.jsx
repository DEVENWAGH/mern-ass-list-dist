import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDistributions } from "../../features/csv/csvSlice";
import { getAgents } from "../../features/agents/agentSlice";

const DistributionList = () => {
  const dispatch = useDispatch();
  const { distributions, isLoading } = useSelector((state) => state.csv);
  const { agents } = useSelector((state) => state.agent);
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    dispatch(getAgents());
    dispatch(getDistributions());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="distribution-list">
      <h2>Task Distributions</h2>
      <div className="agent-selector">
        <label htmlFor="agent-select">Select Agent:</label>
        <select
          id="agent-select"
          onChange={(e) => setSelectedAgent(e.target.value)}
          value={selectedAgent || ""}
        >
          <option value="">-- All Agents --</option>
          {agents.map((agent) => (
            <option key={agent._id} value={agent._id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>

      <div className="distributions-container">
        {Object.keys(distributions).length === 0 ? (
          <p>No distributions available</p>
        ) : !selectedAgent ? (
          // Show all agents
          Object.keys(distributions).map((agentId) => {
            const agent = agents.find((a) => a._id === agentId);
            return (
              <div key={agentId} className="agent-distribution">
                <h3>{agent ? agent.name : "Unknown Agent"}</h3>
                <table className="distribution-table">
                  <thead>
                    <tr>
                      <th>First Name</th>
                      <th>Phone</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distributions[agentId].map((item, index) => (
                      <tr key={index}>
                        <td>{item.firstName}</td>
                        <td>{item.phone}</td>
                        <td>{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })
        ) : (
          // Show only selected agent
          distributions[selectedAgent] && (
            <div className="agent-distribution">
              <h3>
                {agents.find((a) => a._id === selectedAgent)?.name ||
                  "Unknown Agent"}
              </h3>
              <table className="distribution-table">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Phone</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {distributions[selectedAgent].map((item, index) => (
                    <tr key={index}>
                      <td>{item.firstName}</td>
                      <td>{item.phone}</td>
                      <td>{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DistributionList;
