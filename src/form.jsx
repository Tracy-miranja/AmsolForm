import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Form = () => {
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const UserLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/Api/login", { Email, password });
      
      setMessage(response.data.message); 
      setEmail("");
      setPassword("");
      setError(""); 
      setTimeout(()=>{
        navigate("/")
      },[1000])
      ;
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
    <>
      <div className="flex flex-col bg-blue-500 w-[500px] h-[300px] p-4">
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        <form className="flex flex-col text-xl font-bold" onSubmit={UserLogin}>
          <div className="mb-4">
            <label>Email:</label>
            <input
              type="email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              className="ml-2 p-1 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ml-2 p-1 rounded"
              required
            />
          </div>
          <button type="submit" className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800">Log in</button>
        </form>
       <p>Not signed Up?<Link className="text-white" to="/">Sign Up</Link></p>
        {message && <p className="mt-4 text-green-500">{message}</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>
    </>
  );
};

export default Form;
