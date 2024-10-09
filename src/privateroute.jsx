import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);  // Track auth status
  const [loading, setLoading] = useState(true);  // Track loading state

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Make a request to the backend to verify the token in cookies
        const response = await axios.get('http://localhost:5000/Api/checkAuth', {
          withCredentials: true,  
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);  // Not authenticated if the request fails
      } finally {
        setLoading(false);  // End loading
      }
    };

    checkAuth();  
  }, []);

  if (loading) {
    return <div>Loading...</div>;  
  }

  return isAuthenticated ? children : <Navigate to="/cvupdate" />;
};

export default PrivateRoute;
