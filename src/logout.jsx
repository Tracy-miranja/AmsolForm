import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie"; 
import { toast } from "react-hot-toast"; 
import { FaSignOutAlt } from "react-icons/fa";

const HandleLogout = () => {
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {

      console.log("Current cookies before logout:", Cookies.get());

    
      await axios.post("https://amsol-api-2.onrender.com/logout", {}, { withCredentials: true });

      Cookies.remove("token");
      Cookies.remove("authToken");
      Cookies.remove("userId");

      
      navigate("/"); 
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
      <FaSignOutAlt />
    </button>
  );
};

export default HandleLogout;
