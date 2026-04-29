import React, { useState } from "react";
import api from "../api/axiosInstance";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://amsol-api-production.up.railway.app/forgot-password", {
        email,
      });
      toast.success("Reset link sent to your email!");
      navigate("/forgetPrompt");
      setEmail("");
    } catch (error) {
      console.error("Error sending reset link:", error);
      toast.error("Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="mb-4 text-lg font-bold">Forgot Your Password?</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgetPassword;
