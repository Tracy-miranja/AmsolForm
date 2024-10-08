import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpForm from './SignUpForm';
import Form from './form';
import Home from './Home';
// import LandingPage from './LandingPage';
import RotationPandingPage from './RotationLandingPage';
import PrivateRoute from './PrivateRoute'; // Import the PrivateRoute component
import UpdateCV from './cvupdate';
import HandleLogout from './logout';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RotationPandingPage />} />
          <Route path="/signupform" element={<SignUpForm />} />
          <Route path="/form" element={<Form />} />
          {/* Protect the Home route */}
          <Route path='/logout' element={<HandleLogout />}/>
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path='/cvupdate' element={<PrivateRoute><UpdateCV /></PrivateRoute>}/>
        </Routes>
      </Router>
    </>
  );
};

export default App;
