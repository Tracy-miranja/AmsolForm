import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpForm from './SignUpForm';
import Form from './form';
import Home from './Home';


const App = () => {
  return (
    <>
    
    <Router>
      <Routes>
        <Route path="/" element={<SignUpForm />} />
        <Route path="/form" element={<Form />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </Router>
    </>
  );
};

export default App;
