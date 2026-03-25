import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Cookies from "js-cookie";
import Auth from "./Auth";
import Home from "./Home";
import RotationLandingPage from "./RotationLandingPage";
import UpdateCV from "./cvupdate";
import HandleLogout from "./logout";
import ProfilePage from "./ProfilePagex";
import { UserProvider } from "./Context/UserContext";
import ProfileDetailsPage from "./ProfileDetailsPage";
import FormLayout from "./Formlayout";
import ForgetPassword from "./ForgetPassword";
import ResetPassword from "./ResetPassword";
import ForgetPrompt from "./forgetprompt";
import Register from "./Register";
import Profile from "./userProfile";
import NurseForm from "./NurseForm";
import Profilepage from "./userdashboard/ProfilePage"
import JobPage from "./job";
import UserDashbaord from "./userdashboard/userDashboard";
import Application from "./userdashboard/Application";
import UserProfileDashboard from "./Userprofiledashboard";
import { JobProvider } from "./JobContext";

const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    setIsLoggedIn(!!token); // Ensure state reflects token presence
  }, []);

  // Ensure that we re-check login state whenever login changes
  useEffect(() => {
    console.log("Login state changed:", isLoggedIn);
  }, [isLoggedIn]);

  const handleLoginSuccess = () => {
    toast.success("Login successful!");
    setIsLoggedIn(true); // Set state to logged in
  };

  const handleLoginError = () => {
    toast.error("Login failed! Please check your credentials.");
  };

  return (
    <UserProvider>
      <JobProvider>
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
          <Route path="/applications" element={<Application/>}/>
          <Route path="/profile" element={<UserProfileDashboard />} />
          <Route path="/dashboard" element={<UserDashbaord />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="/forgetPrompt" element={<ForgetPrompt />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/Profilepage" element={<Profilepage />} />
          <Route path="/Jobs" element={<JobPage />} />

          {/* Private Routes */}
          <Route
            path="/home"
            element={
              <PrivateRoute isAuthenticated={isLoggedIn}>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/update-profile"
            element={
              <PrivateRoute isAuthenticated={isLoggedIn}>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/cv-update"
            element={
              <PrivateRoute isAuthenticated={isLoggedIn}>
                <UpdateCV />
              </PrivateRoute>
            }
          />
          <Route
            path="/Formlayout"
            element={
              <PrivateRoute isAuthenticated={isLoggedIn}>
                <FormLayout />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile-details"
            element={
              <PrivateRoute isAuthenticated={isLoggedIn}>
                <ProfileDetailsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              
               <Profile />
             
            }
          />
        <Route path="/NurseForm" element={<NurseForm />}/>
          {/* Logout Route */}
          <Route
            path="/logout"
            element={<HandleLogout setIsLoggedIn={setIsLoggedIn} />}
          />
        </Routes>
      </Router>
      </JobProvider>
    </UserProvider>
  );
};

export default App;
