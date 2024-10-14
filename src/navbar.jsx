import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaBars, FaTimes } from "react-icons/fa";
import arrow from "./assets/vector 1.svg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div
      className={`flex flex-col h-[100vh] ${
        isHovered
          ? "bg-gradient-to-r from-[#25b2e6] to-[#0A599E] text-white"
          : "bg-white"
      } transition-colors duration-500`}
    >
      {/* Top Banner */}
      <div className="w-full h-[40px] bg-gradient-to-r from-[#25b2e6] to-[#0A599E] flex items-center justify-center p-2">
        <h1 className="text-white font-bold">
          Empowering Organizations To Achieve Emiratization With Our Latest Guidebook
        </h1>
      </div>

      {/* Navbar Header */}
      <div className="w-full flex items-center justify-between p-4 bg-white md:px-8">
        <div className="text-xl font-bold text-[#0A599E]">AMSOL</div>

        {/* Hamburger Icon for Small Screens */}
        <button
          className="md:hidden text-[#0A599E]"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Links for Larger Screens */}
        <div
          className={`hidden md:flex flex-row items-center gap-5 ${
            hoveredSection ? "text-white" : "text-[#0A599E]"
          }`}
        >
          <a
            className={`hover:text-white flex flex-row gap-2 ${
              isHovered ? "text-white" : "text-[#0A599E]"
            }`}
          >
            <FaHome className="mt-1 hover:bg-gray-400" />
            Home
          </a>
          <Link
            to="/form"
            className={`rounded-full ${
              hoveredSection ? "text-white" : "text-[#0A599E]"
            } hover:text-white hover:-mt-2 p-1 pl-2 pr-2 hover:bg-gray-400 font-semibold`}
          >
            About
          </Link>
          <Link
            to="/signupform"
            className={`rounded-full ${
              hoveredSection ? "text-white" : "text-[#0A599E]"
            } hover:text-white hover:-mt-2 p-1 pl-2 pr-2 hover:bg-gray-400 font-semibold`}
          >
            Jobs
          </Link>
          <Link
            to="/signupform"
            className={`rounded-full ${
              hoveredSection ? "text-white" : "text-[#0A599E]"
            } hover:text-white hover:-mt-2 p-1 pl-2 pr-2 hover:bg-gray-400 font-semibold`}
          >
            Career
          </Link>
        </div>
      </div>

      {/* Toggle Menu for Small/Medium Screens */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col items-start gap-4 p-4">
          <Link
            to="/"
            className="text-[#0A599E] hover:text-white hover:bg-gray-400 p-2 rounded-md w-full"
          >
            Home
          </Link>
          <Link
            to="/form"
            className="text-[#0A599E] hover:text-white hover:bg-gray-400 p-2 rounded-md w-full"
          >
            About
          </Link>
          <Link
            to="/signupform"
            className="text-[#0A599E] hover:text-white hover:bg-gray-400 p-2 rounded-md w-full"
          >
            Jobs
          </Link>
          <Link
            to="/signupform"
            className="text-[#0A599E] hover:text-white hover:bg-gray-400 p-2 rounded-md w-full"
          >
            Career
          </Link>
          <Link
            to="/cvupdate"
            className="flex gap-2 items-center justify-start bg-white rounded-full border border-blue-900 text-[#0A599E] p-1 pl-2 pr-2 hover:bg-gray-400 hover:text-white font-bold w-full"
          >
            <span>Update CV</span>
            <img src={arrow} className="w-5 h-5" alt="Arrow" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;

  