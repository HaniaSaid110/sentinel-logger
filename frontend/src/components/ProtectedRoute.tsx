import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const ProtectedRoute: React.FC = () => {
  const { developer, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-dark-bg text-gray-200">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-blue-500"></div>
        <p className="mt-4 font-medium text-gray-400">Loading Sentinel Logger...</p>
      </div>
    );
  }

  if (!developer) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
