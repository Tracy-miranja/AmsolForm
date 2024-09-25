import axios from "axios";
import { useState } from "react";
import { FaEye } from "react-icons/fa6";
import Navbar from "./navbar";
import chair from "./assets/hiring.png"

const SignUpForm = () => {
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); 
  const [confirmPassword,setConfirmPassword]=useState("")

  const getUserDetails = async (e) => {
    e.preventDefault();
  
    // Ensure that you're comparing the latest values of password and confirmPassword
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setMessage("");
      return; 
    }
  
    try {
      const response = await axios.post("http://localhost:5000/Api/SignUp", {
        fullName,
        Email,
        password
      });
      setMessage(response.data.message);
      setEmail("");
      setPassword("");
      setFullName("");
      setError(""); 
      setConfirmPassword("");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
        setMessage("");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };
  

  return (
    <div>
      <Navbar className="w-[100%]"/>
      <div className="h-[100vh] bg-gradient-to-r from-[#25b2e6] to-[#0922e3] flex flex-col items-center justify-center relative overflow-hidden">
  {/* Welcome Section */}
  <div className="text-center flex flex-col items-center justify-center space-y-4 z-10">
    <h1 className="text-5xl font-bold text-white mb-6">Welcome to AMSOL career page</h1>
    <p className="text-lg text-gray-100 max-w-md mb-6">Apply for your dream job today! Discover opportunities, submit your application, and take the next step in your career journey</p>
    <button className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition shadow-lg">
      Get Started
    </button>
  </div>

  {/* Decorative White Circle and Image */}
  <div className="flex justify-center items-center space-x-8  z-10">
    
    <div>
      <img src={chair} alt="Decorative chair" className="h-[350px] object-cover" />
    </div>
  </div>

  {/* Mountain-like Shape */}
  <div className="absolute inset-x-0 bottom-0">
    <svg viewBox="0 0 1440 320" className="w-full h-full">
      <path fill="#fff" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,208C384,192,480,192,576,213.3C672,235,768,277,864,282.7C960,288,1056,256,1152,229.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L0,320Z"></path>
    </svg>
  </div>
  </div>

    <div className="flex justify-center items-center h-screen bg-black">
      <div className="flex flex-col bg-gray-800 w-[350px] p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-2xl font-semibold mb-4 text-white">Sign Up</h3>
        <form className="flex flex-col text-sm text-white" onSubmit={getUserDetails}>
          <div className="mb-4">
            <label>
             UserName<span className="text-red-500">*</span>:
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required
                placeholder="Enter Username"
                className="ml-2 w-full p-1 rounded text-gray-900"
              />
            </label>
          </div>
          <div className="mb-4">
            <label>
              Email <span className="text-red-500">*</span>:
              <input 
                type="email" 
                value={Email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                placeholder="Enter Email"
                className="ml-2 w-full p-1 rounded text-gray-900"
              />
            </label>
          </div>
          <div className="mb-4">
            <label>
              Password <span className="text-red-500">*</span>:
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                placeholder="Enter Password"
                className="ml-2 w-full p-1 rounded text-gray-900"
              />
            </label>
          </div>
          <div className="mb-4">
            <label>
              Confirm Password <span className="text-red-500">*</span>:
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required
                placeholder="Enter Confirm Password"
                maxLength="8"
                className="ml-2 w-full p-1 rounded text-gray-900"
                
              />
            </label>
          </div>
          <button type="submit" className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800 mt-2">
            Sign Up
          </button>

          {message && (
            <p className="mt-4 text-green-500 font-bold">{message}</p>
          )}
          
          {error && (
            <p className="mt-4 text-red-500 font-bold">{error}</p>
          )}

          <p className="mt-4">
            Already have an account? <a href="./form" className="text-blue-300 hover:underline">Log in</a>
          </p>
        </form>
      </div>
    </div>
    </div>
  );
};

export default SignUpForm;
