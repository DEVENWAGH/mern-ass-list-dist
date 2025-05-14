import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaUsers, FaClipboardList, FaSignOutAlt, FaTachometerAlt, FaUpload } from "react-icons/fa";
import { logout, reset } from "../../features/auth/authSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/dashboard" className="text-white font-bold text-xl">
                Lead Distribution
              </Link>
            </div>
            {user && (
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/dashboard"
                    className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <FaTachometerAlt className="mr-1" /> Dashboard
                  </Link>
                  <Link
                    to="/agents"
                    className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <FaUsers className="mr-1" /> Agents
                  </Link>
                  <Link
                    to="/lists/upload"
                    className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <FaUpload className="mr-1" /> Upload List
                  </Link>
                  <Link
                    to="/lists"
                    className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <FaClipboardList className="mr-1" /> View Lists
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <div className="flex items-center">
                  <span className="text-white mr-4">Welcome, {user.name}</span>
                  <button
                    onClick={onLogout}
                    className="flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    <FaSignOutAlt className="mr-1" /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-white bg-indigo-700 hover:bg-indigo-800 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="bg-indigo-700 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium flex items-center"
                  onClick={toggleMenu}
                >
                  <FaTachometerAlt className="mr-2" /> Dashboard
                </Link>
                <Link
                  to="/agents"
                  className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium flex items-center"
                  onClick={toggleMenu}
                >
                  <FaUsers className="mr-2" /> Agents
                </Link>
                <Link
                  to="/lists/upload"
                  className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium flex items-center"
                  onClick={toggleMenu}
                >
                  <FaUpload className="mr-2" /> Upload List
                </Link>
                <Link
                  to="/lists"
                  className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium flex items-center"
                  onClick={toggleMenu}
                >
                  <FaClipboardList className="mr-2" /> View Lists
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    toggleMenu();
                  }}
                  className="w-full text-left text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium flex items-center"
                >
                  <FaSignOutAlt className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
