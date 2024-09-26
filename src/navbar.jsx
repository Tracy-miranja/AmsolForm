import { FaHome } from "react-icons/fa";
import logo from "./assets/amsolJobVacancies.png"
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
      <div className="w-[100%] h-[50px] bg-gradient-to-r from-[#25b2e6] to-[#0922e3] flex items-center justify-around shadow-xl p-8 text-white gap-5">
       <div className="bg-white rounded-full w-[200px] flex items-center justify-center"> <img src={logo} alt="hrOutsourcing" className="w-[110px] p-1"/></div>
        <div className="flex flex-row items-center gap-5 ">
        <a className="text-white flex flex-row gap-2" href="#"><FaHome className="mt-1"/>Home</a>
        <Link to="/form" className="bg-white rounded-full text-blue-800 p-1 pl-2 pr-2 hover:bg-gray-400 hover:text-white font-bold">Log In</Link>
        <Link to="/signupform" className="bg-white rounded-full text-blue-800 p-1 pl-2 pr-2 hover:bg-gray-400 hover:text-white font-bold">Sign Up</Link>
        </div>
      </div>
    );
  };
  
  export default Navbar;
  