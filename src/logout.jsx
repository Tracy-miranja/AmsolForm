import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie"; // Ensure js-cookie is installed
import { toast } from "react-hot-toast"; // For notifications

const HandleLogout = () => {
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      // Log current cookies for debugging
      console.log("Current cookies before logout:", Cookies.get());
  
      // Call the logout API
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
  
     Cookies.remove("token");
Cookies.remove("authToken");
Cookies.remove("userId");

  
      // Log cookies after logout attempt
      console.log("Current cookies after logout:", Cookies.get());
  
      // Redirect and show toast
      navigate('/'); 
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
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
