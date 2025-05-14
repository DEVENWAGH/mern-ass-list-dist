import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadCsv, reset as csvReset } from "../../features/csv/csvSlice";
import { getAgents } from "../../features/agents/agentSlice";
import { toast } from "react-toastify";

const CsvUpload = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);

  const { agents } = useSelector((state) => state.agent);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.csv
  );

  useEffect(() => {
    dispatch(getAgents());

    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success("CSV uploaded and distributed successfully");
      setFile(null);
      dispatch(csvReset());
    }
  }, [dispatch, isError, isSuccess, message]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    if (agents.length === 0) {
      toast.error("You need at least one agent to distribute tasks to");
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", file);
    dispatch(uploadCsv(formData));
  };

  return (
    <div className="csv-upload">
      <h2>Upload and Distribute Lists</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="csvFile">Upload CSV File</label>
          <input
            type="file"
            id="csvFile"
            onChange={handleFileChange}
            accept=".csv,.xlsx,.xls"
          />
          <small>Accepted formats: CSV, XLSX, XLS</small>
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Uploading..." : "Upload and Distribute"}
        </button>
      </form>
    </div>
  );
};

export default CsvUpload;
