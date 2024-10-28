import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie"; // Make sure to install js-cookie
import { toast } from "react-hot-toast"; // For notifications

const HandleLogout = () => {
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      // Call the logout API
      await axios.post("http://localhost:5000/logout", { withCredentials: true });

      // Clear cookies manually if needed (depends on your backend implementation)
      Cookies.remove("authToken"); // Remove token from cookies
      Cookies.remove("userId"); // Remove user ID from cookies (if stored)

      // Redirect to the login page or another specified page
      navigate('/'); // Adjust this path as needed
      toast.success("Logged out successfully!"); // Show success message
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again."); // Show error message
    }
  };

  return (
    <button 
      onClick={handleLogoutClick} 
      className="flex gap-2 items-center justify-center bg-white rounded-full border border-blue-900 text-[#0A599E] p-1 pl-2 pr-2 hover:bg-gray-400 hover:text-white font-bold w-fit text-center rotate-hover z-10"
    >
      Logout
    </button>
  );
};

export default HandleLogout;
