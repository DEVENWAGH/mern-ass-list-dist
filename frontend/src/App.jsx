import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

// Page imports
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AgentsPage from "./pages/AgentsPage";
import CsvUpload from "./pages/CsvUpload";
import ViewDistributions from "./pages/ViewDistributions";

// Component imports
import Navbar from "./components/layout/Navbar";
import AddAgent from "./components/agents/AddAgent";
import Spinner from "./components/common/Spinner";

/**
 * Protected route component that ensures users are authenticated
 * before accessing protected pages
 */
const ProtectedLayout = ({ children }) => {
  const { user, isLoading } = useSelector((state) => state.auth);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <Spinner />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the layout with navbar
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow p-4 md:p-6">{children}</div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="w-full h-full min-h-screen flex flex-col bg-gray-50">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />

        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes with layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            }
          />

          <Route
            path="/agents"
            element={
              <ProtectedLayout>
                <AgentsPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/agents/add"
            element={
              <ProtectedLayout>
                <AddAgent />
              </ProtectedLayout>
            }
          />

          <Route
            path="/upload-csv"
            element={
              <ProtectedLayout>
                <CsvUpload />
              </ProtectedLayout>
            }
          />

          <Route
            path="/distributions"
            element={
              <ProtectedLayout>
                <ViewDistributions />
              </ProtectedLayout>
            }
          />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route
            path="/add-agent"
            element={<Navigate to="/agents/add" replace />}
          />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
