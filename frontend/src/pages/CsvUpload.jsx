import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { getAgents } from "../features/agents/agentSlice";

const CsvUpload = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { agents } = useSelector((state) => state.agent);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [distributions, setDistributions] = useState({});

  useEffect(() => {
    dispatch(getAgents());
  }, [dispatch]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // Check file extension
    const fileExt = selectedFile.name.split(".").pop().toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(fileExt)) {
      toast.error("Only CSV, XLSX, and XLS files are allowed");
      e.target.value = null;
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
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/csv/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setDistributions(response.data.data);
      toast.success("File uploaded and tasks distributed successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error uploading file");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="heading">
        <h1>Upload CSV and Distribute Tasks</h1>
        <p>Upload a file with contacts to distribute among agents</p>
      </section>

      <section className="content">
        <div className="csv-upload-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="csvFile">Upload File (CSV, XLSX, XLS)</label>
              <input
                type="file"
                id="csvFile"
                onChange={handleFileChange}
                accept=".csv,.xlsx,.xls"
              />
              <small>
                File should contain columns: FirstName, Phone, Notes
              </small>
            </div>
            <button
              type="submit"
              className="btn btn-block"
              disabled={loading || !file}
            >
              {loading ? "Uploading..." : "Upload and Distribute"}
            </button>
          </form>
        </div>

        {Object.keys(distributions).length > 0 && (
          <div className="distributions-container">
            <h2>Distribution Results</h2>
            {Object.keys(distributions).map((agentId) => {
              const agent = agents.find((a) => a._id === agentId);
              return (
                <div key={agentId} className="agent-distribution">
                  <h3>{agent ? agent.name : "Unknown Agent"}</h3>
                  <p>Assigned items: {distributions[agentId].length}</p>
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
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
            })}
          </div>
        )}

        <div className="back-link">
          <button onClick={() => navigate("/")} className="btn btn-block">
            Back to Dashboard
          </button>
        </div>
      </section>
    </>
  );
};

export default CsvUpload;
