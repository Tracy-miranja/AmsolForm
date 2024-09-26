import axios from "axios";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import Navbar from "./navbar";


const SignUpForm = () => {
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); 
  const [confirmPassword,setConfirmPassword]=useState("")
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;

  const getUserDetails = async (e) => {
    e.preventDefault();
  
    // Ensure that you're comparing the latest values of password and confirmPassword
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setMessage("");
      return; 
    }
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long and include at least one special character, one letter, and one number."
      );
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
     
    <div className="flex justify-center items-center h-screen ">
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
          <div className="mb-4 relative">
              <label>
                Password <span className="text-red-500">*</span>:
                <input
                  type={showPassword ? "text" : "password"}  
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter Password"
                  className="ml-2 w-full p-1 rounded text-gray-900"
                />
                
                <span
                  className="absolute right-3 top-[58%] cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash className="text-gray-800"/> : <FaEye className="text-black"/>}
                </span>
              </label>
            </div>
          <div className="mb-4 relative">
              <label>
                Confirm Password <span className="text-red-500">*</span>:
                <input
                  type={showConfirmPassword ? "text" : "password"}  
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Enter Confirm Password"
                  className="ml-2 w-full p-1 rounded text-gray-900"
                />
              
                <span
                  className="absolute right-3 top-[58%] cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash className="text-gray-800"/> : <FaEye className="text-black"/>}
                </span>
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
