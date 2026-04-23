import React from "react";
import { Navigate } from "react-router-dom";

// ProtectedRoute — redirects to login if no JWT token in localStorage
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If no token, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the child component
  return children;
};

export default ProtectedRoute;
