import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../api/axiosInstance';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 const handleReset = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    return toast.error("Passwords do not match!");
  }

  if (password.length < 6 || !/\d/.test(password) || !/[A-Z]/.test(password)) {
    return toast.error("Password must be 6+ chars with a number and uppercase letter.");
  }

  setLoading(true);
  try {
    const { data } = await api.post('/api/auth/reset-password', { token, password });
    toast.success(data.message || "Password reset successfully!");
    navigate('/auth');
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to reset password.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-center">Reset Your Password</h2>
        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}                              
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;