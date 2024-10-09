import { useNavigate } from "react-router-dom";
import axios from "axios";

const HandleLogout = () => {
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      await axios.post("http://localhost:5000/Api/logout", {
        withCredentials: true,  
      });
      navigate('/form');  
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button onClick={handleLogoutClick} className="flex gap-2 items-center justify-center bg-white rounded-full border border-blue-900 text-[#0A599E] p-1 pl-2 pr-2 hover:bg-gray-400 hover:text-white font-bold w-fit text-center rotate-hover z-10"
    >
      Logout
    </button>
  );
};

export default HandleLogout;
