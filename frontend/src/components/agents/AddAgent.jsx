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

  // Track whether form was submitted to avoid showing unnecessary toasts
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    // Clear any previous state when component mounts
    dispatch(reset());

    // Only show toasts if the form has been submitted
    if (formSubmitted) {
      if (isError && message) {
        toast.error(message || "Error adding agent");
        setFormSubmitted(false);
      }

      if (isSuccess) {
        toast.success("Agent added successfully");
        // Fix: Change navigation path to /agents to show the agents list
        navigate("/agents");
        dispatch(reset());
        setFormSubmitted(false);
      }
    }

    return () => {
      // Cleanup when unmounting
      if (formSubmitted) {
        dispatch(reset());
      }
    };
  }, [isError, isSuccess, message, navigate, dispatch, formSubmitted]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !password) {
      toast.error("Please fill all required fields");
      return;
    }

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

    // Set form as submitted before dispatching action
    setFormSubmitted(true);

    const agentData = {
      name,
      email,
      phone,
      password,
      status,
    };

    dispatch(createAgent(agentData));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add Agent</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              required
              placeholder="Enter agent name"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              placeholder="Enter agent email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Mobile Number (with country code)
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={phone}
              onChange={onChange}
              required
              placeholder="e.g., +1234567890"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <small className="text-gray-600">
              Include country code (e.g., +1 for US)
            </small>
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              required
              placeholder="Enter password"
              minLength="6"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <small className="text-gray-600">Minimum 6 characters</small>
          </div>
          <div className="mb-6">
            <label
              htmlFor="status"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Status
            </label>
            <select
              name="status"
              id="status"
              value={status}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Agent"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAgent;
