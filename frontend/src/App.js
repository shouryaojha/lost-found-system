import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected route — requires JWT token */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Default redirect — go to login page */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
