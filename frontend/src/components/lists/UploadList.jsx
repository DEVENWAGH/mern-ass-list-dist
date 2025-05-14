import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../../utils/axiosConfig";

const UploadList = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [listName, setListName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [agents, setAgents] = useState([]);

  // Fetch agents for distribution options
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await api.get("/api/agents");
        setAgents(res.data);
      } catch (err) {
        console.error("Error fetching agents:", err);
      }
    };

    fetchAgents();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Validate file type
    if (selectedFile) {
      const fileExt = selectedFile.name.split(".").pop().toLowerCase();
      const validExtensions = ["csv", "xlsx", "xls"];

      if (!validExtensions.includes(fileExt)) {
        toast.error("Please upload a valid CSV or Excel file");
        e.target.value = null;
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!listName.trim()) {
      toast.error("Please enter a list name");
      return;
    }

    // Check if we have enough agents to distribute
    if (agents.length === 0) {
      toast.error("No agents available for list distribution");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", listName);

    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const res = await api.post("/api/lists/upload", formData, config);
      toast.success(
        res.data.msg || "List uploaded and distributed successfully"
      );
      setUploading(false);
      navigate("/distributed-lists");
    } catch (err) {
      console.error("Error uploading list:", err);
      setUploading(false);
    }
  };

  return (
    <div className="upload-list">
      <h1>Upload List</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="listName">List Name</label>
          <input
            type="text"
            id="listName"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            required
            placeholder="Enter a name for this list"
          />
        </div>
        <div className="form-group">
          <label htmlFor="file">Upload CSV or Excel File</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            accept=".csv,.xlsx,.xls"
            required
          />
          <small>Accepted formats: CSV, Excel (.xlsx, .xls)</small>
        </div>

        <div className="form-info">
          <h3>List Distribution Information</h3>
          <p>
            The uploaded list will be distributed equally among{" "}
            {agents.length || 0} active agents.
          </p>
          <p>Each list must contain: FirstName, Phone, and Notes fields.</p>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={uploading || agents.length === 0}
        >
          {uploading ? "Uploading..." : "Upload & Distribute List"}
        </button>
      </form>
    </div>
  );
};

export default UploadList;
