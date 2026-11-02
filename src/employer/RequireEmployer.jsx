import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getSession } from "./employerAuth";

const RequireEmployer = ({ children }) => {
  const location = useLocation();
  const session = getSession();

  if (!session?.role) return <Navigate to="/auth" state={{ from: location }} replace />;
  if (session.role !== "employer") return <Navigate to="/profile" replace />;
  return children;
};

export default RequireEmployer;