import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import {
  FaSignOutAlt,
  FaUser,
  FaUpload,
  FaTachometerAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold">
              Agent Manager
            </Link>
          </div>

          {user && (
            <>
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-4">
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

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={toggleMenu}
                  className="text-white focus:outline-none"
                >
                  {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {user && (
          <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"} pb-4`}>
            <Link
              to="/dashboard"
              className="block py-2 px-4 text-sm hover:bg-blue-700 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaTachometerAlt className="inline mr-2" /> Dashboard
            </Link>
            <Link
              to="/agents"
              className="block py-2 px-4 text-sm hover:bg-blue-700 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaUser className="inline mr-2" /> Agents
            </Link>
            <Link
              to="/upload-csv"
              className="block py-2 px-4 text-sm hover:bg-blue-700 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaUpload className="inline mr-2" /> Upload CSV
            </Link>
            <button
              onClick={onLogout}
              className="w-full text-left py-2 px-4 text-sm bg-red-500 hover:bg-red-600 rounded mt-2"
            >
              <FaSignOutAlt className="inline mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
