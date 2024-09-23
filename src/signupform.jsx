import axios from "axios";
import { useState } from "react";

const SignUpForm = () => {
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); 

  const getUserDetails = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/Api/SignUp", { fullName, Email, password });
      setMessage(response.data.message);
      setEmail("");
      setPassword("");
      setFullName("");
      setError(""); 
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
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="flex flex-col bg-gray-800 w-[350px] p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-2xl font-semibold mb-4 text-white">Sign Up</h3>
        <form className="flex flex-col text-sm text-white" onSubmit={getUserDetails}>
          <div className="mb-4">
            <label>
              Full Name <span className="text-red-500">*</span>:
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required
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
  );
};

export default SignUpForm;
