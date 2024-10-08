import axios from "axios";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import logo from "./assets/amsolJobVacancies.png"


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
     <div className="w-[100%] h-[50px] bg-gradient-to-r from-[#25b2e6] to-blue-500 flex items-center justify-around shadow-2xl p-8 text-white gap-5">
        <div className="bg-white rounded-full w-[200px] flex items-center justify-center"> 
          <img src={logo} alt="hrOutsourcing" className="w-[110px] p-1" />
        </div>
        <div className="flex flex-row items-center gap-5">
          <Link className="text-white flex flex-row gap-2" to="/"><FaHome className="mt-1"/>Home</Link>
          
        </div>
      </div>
     <div className="flex text-center justify-center p-6"><h3 className="font-bold">Welcome to AMSOL, sign up to start your journey here</h3></div>
    <div className="flex justify-center h-screen p-6 ">
      <div className="flex flex-col  w-[50%] p-6 rounded-lg shadow-lg  h-fit">
        <h3 className="text-2xl font-semibold mb-4 ml-2 ">Create Your Personal Account</h3>
        <form className="flex flex-col text-sm " onSubmit={getUserDetails}>
          <div className="">
            <label className="">
            <span className="font-bold ml-2">UserName</span><span className="text-red-500">*</span>:
              <input 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required
                placeholder="Enter Username"
                className="ml-2 w-full p-1 rounded text-gray-900 border border-gray-300 focus:border-blue-500 p-2"
              />
              <p className="ml-2 mb-5">This will be your <span className="text-blue-500">username</span> . It will help employers find you easily</p>
            </label>
          </div>
          <div className="">
            <label className="">
            <span className="font-bold ml-2">Email</span> <span className="text-red-500">*</span>:
              <input 
                type="email" 
                value={Email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                placeholder="Enter Email"
                className="ml-2 w-full p-1 rounded text-gray-900 border border-gray-300 focus:border-blue-500 p-2"
              />
              <p className="ml-2 mt-1 mb-5">We'll never share your email with anyone else</p>
            </label>
          </div>
          <div className=" relative">
              <label className="mt-2">
              <span className="font-bold ml-2 ">Password</span> <span className="text-red-500">*</span>:
                <input
                  type={showPassword ? "text" : "password"}  
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter Password"
                  className="ml-2 w-full p-2 rounded text-gray-900 border border-gray-300 focus:border-blue-500 "
                />
                <p  className="p-2 mb-5">Make sure it's atleast 8 characters including a number and a special character</p>
                <span
                  className="absolute right-3 top-[30%] cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye className="text-black"/>: <FaEyeSlash className="text-gray-800"/>}
                </span>
              </label>
            </div>
          <div className=" relative">
              <label  className="">
               <span className="font-bold ml-2 mt-5">Confirm Password</span>  <span className="text-red-500">*</span>:
                <input
                  type={showConfirmPassword ? "text" : "password"}  
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Enter Confirm Password"
                  className="ml-2 w-full p-2 rounded text-gray-900 border border-gray-300 focus:border-blue-500"
                />
              
                <span
                  className="absolute right-3 top-[38%] cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEye className="text-black"/>: <FaEyeSlash className="text-gray-800"/>}
                </span>
              </label>
            </div>
            <p  className="ml-2 mt-5">By Clicking <span className="text-blue-500">"Create account"</span> below, you agree to our terms of service and privacy statement. We'll occasionally send you emails regarding your account. Already have an account?</p>
          <button type="submit" className="bg-blue-700 text-white ml-2 py-2 px-4 rounded hover:bg-blue-800 mt-2 w-[100px]">
            Sign Up
          </button>

          {message && (
            <p className="mt-4 text-green-500 font-bold">{message}</p>
          )}
          
          {error && (
            <p className="mt-4 text-red-500 font-bold">{error}</p>
          )}

          <p className="mt-4 ml-2">
            Already have an account? <a href="./form" className="text-blue-800 hover:underline">Log in</a>
          </p>
        </form>
      </div>
    </div>
    </div>
  );
};

export default SignUpForm;
