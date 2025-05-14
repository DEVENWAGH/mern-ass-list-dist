import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AgentsPage from "./pages/AgentsPage";
import { useSelector } from "react-redux";
import Navbar from "./components/layout/Navbar";
import AddAgent from "./components/agents/AddAgent";
import UploadList from "./components/lists/UploadList";
import DistributedLists from "./components/lists/DistributedLists";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="w-full">
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Navbar />
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agents"
            element={
              <ProtectedRoute>
                <Navbar />
                <AgentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agents/add"
            element={
              <ProtectedRoute>
                <Navbar />
                <AddAgent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lists/upload"
            element={
              <ProtectedRoute>
                <Navbar />
                <UploadList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lists"
            element={
              <ProtectedRoute>
                <Navbar />
                <DistributedLists />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
