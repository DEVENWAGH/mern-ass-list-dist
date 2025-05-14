import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createAgent, reset } from "../../features/agents/agentSlice";
import { toast } from "react-toastify";

const AddAgent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.agent
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    status: "active",
  });

  const { name, email, phone, password, status } = formData;

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success("Agent added successfully");
      navigate("/");
      dispatch(reset());
    }
  }, [isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // Validate phone number to include country code
    if (!phone.includes("+")) {
      toast.error("Phone number must include country code (e.g., +1)");
      return;
    }

    // Validate password
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    dispatch(createAgent(formData));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="add-agent">
      <h1>Add Agent</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
            placeholder="Enter agent name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            placeholder="Enter agent email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Mobile Number (with country code)</label>
          <input
            type="text"
            name="phone"
            value={phone}
            onChange={onChange}
            required
            placeholder="e.g., +1234567890"
          />
          <small>Include country code (e.g., +1 for US)</small>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            placeholder="Enter password"
            minLength="6"
          />
          <small>Minimum 6 characters</small>
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select name="status" value={status} onChange={onChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Agent
        </button>
      </form>
    </div>
  );
};

export default AddAgent;
