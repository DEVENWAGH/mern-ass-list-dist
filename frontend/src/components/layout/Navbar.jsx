import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check if a path is active
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // If no user, don't render navbar
  if (!user) return null;

  // Navigation items - centralized for consistency
  const navItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <FaTachometerAlt className="mr-2" />,
    },
    {
      path: "/agents",
      name: "Agents",
      icon: <FaUser className="mr-2" />,
    },
    {
      path: "/upload-csv",
      name: "Upload CSV",
      icon: <FaUpload className="mr-2" />,
    },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold">
              Agent Manager
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${
                  isActive(item.path)
                    ? "text-white bg-blue-700 px-3 py-1 rounded"
                    : "hover:text-blue-200"
                }`}
              >
                {item.icon} {item.name}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white transition duration-150"
            >
              <FaSignOutAlt className="mr-1" /> Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden ${
            isMenuOpen ? "block" : "hidden"
          } pb-4 space-y-1`}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block py-2 px-4 text-sm hover:bg-blue-700 rounded ${
                isActive(item.path) ? "bg-blue-700" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.icon} {item.name}
            </Link>
          ))}

          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            className="w-full text-left py-2 px-4 text-sm bg-red-500 hover:bg-red-600 rounded mt-2 flex items-center"
          >
            <FaSignOutAlt className="inline mr-2" /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
