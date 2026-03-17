import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import FullPageLoader from "@/components/FullPageLoader";

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <FullPageLoader />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

