import { useNavigate } from "react-router-dom";

const HandleLogout = () => {
  const navigate = useNavigate(); 

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/form'); 
  };

  return (
    <button onClick={handleLogoutClick}>
      Logout
    </button>
  );
};

export default HandleLogout;
