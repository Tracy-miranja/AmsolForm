import  { useState } from "react";
import api from "../api/axiosInstance"; 
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const { data } = await api.post("/api/auth/forgot-password", { email });
    toast.success(data.message || "Reset link sent to your email!");
    setEmail("");
    // ✅ Small delay so toast shows before navigation
    setTimeout(() => navigate("/forgetPrompt"), 1500);
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to send reset link. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-center">Forgot Your Password?</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;