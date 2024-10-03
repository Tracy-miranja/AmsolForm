import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpForm from './SignUpForm';
import Form from './form';
import Home from './Home';
import LandingPage from './LandingPage';
import RotationPandingPage from './RotationLandingPage';

const App = () => {
  return (
    <>
    
    <Router>
      <Routes>
      <Route path="/" element={<RotationPandingPage />} />
        <Route path="/signupform" element={<SignUpForm />} />
        <Route path="/form" element={<Form />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </Router>
    </>
  );
};

export default App;
