import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAgents } from "../features/agents/agentSlice";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Correctly access the auth and agent state
  const { user } = useSelector((state) => state.auth);
  const { agents, isLoading, isError, message } = useSelector(
    (state) => state.agent
  );

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    dispatch(getAgents());
  }, [dispatch, isError, message]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section className="heading">
        <h1>Welcome {user && user.name}</h1>
        <p>Agents Dashboard</p>
      </section>

      <section className="content">
        {agents && agents.length > 0 ? (
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Total Agents</h3>
              <p className="stat-number">{agents.length}</p>
            </div>
            <div className="stat-card">
              <h3>Active Agents</h3>
              <p className="stat-number">
                {agents.filter((agent) => agent.status === "active").length}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <p>You haven't added any agents yet</p>
            <button className="btn" onClick={() => navigate("/add-agent")}>
              Add Agent
            </button>
          </div>
        )}

        <div className="dashboard-actions">
          <button className="btn" onClick={() => navigate("/add-agent")}>
            Add New Agent
          </button>
          <button className="btn" onClick={() => navigate("/upload-csv")}>
            Upload CSV
          </button>
        </div>
      </section>
    </>
  );
}

export default Dashboard;
