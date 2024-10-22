import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Toaster, toast } from "react-hot-toast"; // Import toast components
import Auth from "./auth";
import Home from "./Home";
import RotationLandingPage from "./RotationLandingPage";
import UpdateCV from "./cvupdate";
import HandleLogout from "./logout";
import ProfilePage from "./ProfilePage";
import { UserProvider } from "./Context/UserContext"; // Adjust the import according to your file structure

// PrivateRoute component to protect routes
const PrivateRoute = ({ element, isAuthenticated, ...rest }) => {
  return isAuthenticated ? element : <Navigate to="/auth" replace />;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by verifying the token in localStorage or cookies
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Example: Trigger a success toast after successful login
  const handleLoginSuccess = () => {
    toast.success("Login successful!"); // Show success toast
    setIsLoggedIn(true); // Update login state
  };

  // Example: Trigger an error toast after failed login
  const handleLoginError = () => {
    toast.error("Login failed! Please check your credentials."); // Show error toast
  };

  return (
    <UserProvider>
      {" "}
      {/* Wrap the app in UserProvider to provide user context */}
      <>
        <Toaster position="top-right" reverseOrder={false} />
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<RotationLandingPage />} />
            <Route
              path="/auth"
              element={
                <Auth
                  setIsLoggedIn={setIsLoggedIn}
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginError}
                />
              }
            />

            {/* Private Routes */}
            <Route
              path="/update-profile"
              element={
                <PrivateRoute
                  isAuthenticated={isLoggedIn}
                  element={<ProfilePage />} // Fixed element prop
                />
              }
            />
            <Route
              path="/cv-update"
              element={
                <PrivateRoute
                  isAuthenticated={isLoggedIn}
                  element={<UpdateCV />} // Ensure to use the correct component
                />
              }
            />

            {/* Logout */}
            <Route
              path="/logout"
              element={<HandleLogout setIsLoggedIn={setIsLoggedIn} />}
            />

            {/* Home Route */}
            <Route
              path="/home"
              element={
                <PrivateRoute isAuthenticated={isLoggedIn} element={<Home />} />
              }
            />
          </Routes>
        </Router>
      </>
    </UserProvider>
  );
};

export default App;
