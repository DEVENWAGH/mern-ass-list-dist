import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axiosConfig";

const Dashboard = () => {
  const [stats, setStats] = useState({
    agents: 0,
    lists: 0,
    distributedLists: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // In a real implementation, fetch dashboard stats from the API
        // const response = await api.get('/api/dashboard/stats');
        // setStats(response.data);

        // For now, we'll just simulate this with a timeout
        setTimeout(() => {
          setStats({
            agents: 12,
            lists: 5,
            distributedLists: 3,
          });
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Agents</h3>
          <p>{stats.agents}</p>
          <Link to="/agents" className="btn btn-sm">
            View Agents
          </Link>
        </div>

        <div className="stat-card">
          <h3>Lists</h3>
          <p>{stats.lists}</p>
          <Link to="/upload-list" className="btn btn-sm">
            Upload List
          </Link>
        </div>

        <div className="stat-card">
          <h3>Distributed Lists</h3>
          <p>{stats.distributedLists}</p>
          <Link to="/distributed-lists" className="btn btn-sm">
            View Lists
          </Link>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-container">
          <Link to="/add-agent" className="btn btn-primary">
            Add New Agent
          </Link>
          <Link to="/upload-list" className="btn btn-primary">
            Upload New List
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
