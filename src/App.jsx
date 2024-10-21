import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUpForm from "./signupform";
import Form from "./form";
import Home from "./Home";
// import LandingPage from './LandingPage';
import RotationPandingPage from "./RotationLandingPage";
import PrivateRoute from "./privateroute";
import UpdateCV from "./cvupdate";
import HandleLogout from "./logout";
import FormLayout from "./Formlayout";
import ProfilePage from "./ProfilePage";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RotationPandingPage />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
          <Route path="/signupform" element={<SignUpForm />} />
          <Route path="/form" element={<Form />} />
          <Route path="/logout" element={<HandleLogout />} />
          <Route path="/Formlayout" element={<FormLayout />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/cvupdate" element={<UpdateCV />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
