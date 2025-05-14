import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ component: Component }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  // Authenticated, render the component
  return <Component />;
};

export default PrivateRoute;
