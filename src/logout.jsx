import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { FaSignOutAlt } from "react-icons/fa";

const HandleLogout = () => {
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      await api.post("/api/auth/logout"); // ← was "/logout"

      localStorage.removeItem("accessToken");
      Cookies.remove("token");
      Cookies.remove("authToken");
      Cookies.remove("userId");

      toast.success("Logged out successfully!");
      navigate("/");

    } catch (error) {
      console.error("Logout failed:", error);

      // Clear local state anyway so user isn't stuck
      localStorage.removeItem("accessToken");
      Cookies.remove("token");
      Cookies.remove("authToken");
      Cookies.remove("userId");

      navigate("/");
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