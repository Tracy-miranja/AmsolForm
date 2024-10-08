import React from 'react';
import { Navigate } from 'react-router-dom';

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('userId'); // Check if the user is authenticated (i.e., token is present)
  return token ? children : <Navigate to="/form" />;
};

export default PrivateRoute;