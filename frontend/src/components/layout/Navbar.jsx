import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import {
  FaSignOutAlt,
  FaUser,
  FaList,
  FaUpload,
  FaTachometerAlt,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/dashboard" className="text-xl font-bold">
            Agent Manager
          </Link>
        </div>

        {user && (
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="flex items-center hover:text-blue-200"
            >
              <FaTachometerAlt className="mr-1" /> Dashboard
            </Link>
            <Link
              to="/agents"
              className="flex items-center hover:text-blue-200"
            >
              <FaUser className="mr-1" /> Agents
            </Link>
            <Link
              to="/upload-csv"
              className="flex items-center hover:text-blue-200"
            >
              <FaUpload className="mr-1" /> Upload CSV
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
            >
              <FaSignOutAlt className="mr-1" /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
