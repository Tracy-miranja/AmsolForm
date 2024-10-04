import React, { useState } from "react";
import { Link } from "react-router-dom";
import vacancy from "./assets/vector 2tt.svg"
import jobvacancy from "./assets/Group1.svg";
import logo from "./assets/amsolJobVacancies.png";
import { FaHome } from "react-icons/fa";

const RotationPandingPage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);

  return (
    <div
      className={`flex flex-col h-[100vh] ${
        isHovered
          ? "bg-gradient-to-r from-[#25b2e6] to-[#0A599E] text-white"
          : "bg-white"
      } transition-colors duration-500`}
    >
      <div className="w-[100%] h-[40px] bg-gradient-to-r from-[#25b2e6] to-[#0A599E] flex items-center justify-center p-2">
        <h1 className="text-white font-bold">Empowering Organizations To Achieve Emiratization With Our Latest Guidebook</h1>
      </div>
      <div className="w-[100%] h-[50px] flex items-center justify-center p-8 text-blue-400 gap-5 z-10">
        <div className="bg-inherit rounded-full w-[200px] flex items-center justify-center">
          {" "}
          <img src={logo} alt="hrOutsourcing" className="w-[110px] p-1" />
        </div>
        <div className={`flex flex-row items-center gap-5 z-10 ${isHovered ? "text-white":"text-[#0A599E]"}`}>
          <a className="text-[#0A599E] flex flex-row gap-2" href="#">
            <FaHome className="mt-1 text-[#0A599E]" />
            Home
          </a>
          <Link
            to="/form"
            className=" rounded-full text-[#0A599E] p-1 pl-2 pr-2 hover:bg-gray-400 hover:text-white font-semibold"
          >
            About
          </Link>
          <Link
            to="/signupform"
            className=" rounded-full text-[#0A599E] p-1 pl-2 pr-2 hover:bg-gray-400 hover:text-white font-semibold"
          >
            Jobs
          </Link>
          <Link
            to="/signupform"
            className=" rounded-full text-[#0A599E] p-1 pl-2 pr-2 hover:bg-gray-400 hover:text-white font-semibold"
          >
            Career
          </Link>
        </div>
      </div>

      <div className="flex w-full">
        <div className="flex w-[60%] h-[60vh] relative">
          <img src={vacancy} className="h-[100vh] absolute -mt-[60px] " alt="vacancy" />
        </div>
        {/* Second section */}
        <div className="flex w-[50%] flex-col gap-5 justify-center h-[80vh]">
          {/* Log in section */}
          <div
            className="flex w-[100%] h-[35vh] justify-center gap-5 flex-col relative parent-container"
            onMouseEnter={() => {
              setHoveredSection("login");
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              setHoveredSection(null);
              setIsHovered(false);
            }}
          >
            <h1 className="font-extrabold text-3xl text-[#0A599E]">
              You <br />
              haven't Logged In?
            </h1>
            <p>
              See the latest vacancies and <br />
              how we can supercharge your search
            </p>
            <Link
              to="/form"
              className="bg-white rounded-full border border-blue-900 text-[#0A599E] p-1 pl-2 pr-2 hover:bg-gray-400 hover:text-white font-bold w-[100px] text-center rotate-hover z-10"
            >
              Log In
            </Link>
            <div className="animation login-image">
              <img
                src={jobvacancy}
                className={`w-[100%] h-[60vh] absolute -ml-[250px] z-0 -mt-[200px] hidden-on-hover ${
                  hoveredSection === "login"
                    ? "animate-rotateIn"
                    : "animate-rotateOut"
                }`}
                alt="jobvacancy"
              />
            </div>
          </div>
          <div className="w-[50%] h-[2px] bg-[#0A599E] "></div>
          {/* Sign up section */}
          <div
            className="flex h-[30vh] flex-col gap-5 justify-center relative parent-container"
            onMouseEnter={() => {
              setHoveredSection("signup");
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              setHoveredSection(null);
              setIsHovered(false);
            }}
          >
            <h1 className="font-extrabold text-3xl text-[#0A599E]">
              You
              <br /> haven't signed Up?
            </h1>
            <p>
              See the latest vacancies and <br />
              how we can supercharge your search
            </p>
            <Link
              to="/signupform"
              className="bg-white rounded-full text-[#0A599E] text-center border border-blue-400  p-1 pl-2 pr-2 hover:bg-gray-400 hover:text-white font-bold w-[100px] text-center rotate-hover z-10"
            >
              Sign Up
            </Link>
            <div className="animation signup-image relative">
              <img
                src={jobvacancy}
                className={`w-[100%] h-[60vh] absolute -ml-[250px] -mt-[320px] z-0 transition-all duration-500 ${
                  hoveredSection === "signup"
                    ? "animate-rotateIn"
                    : "animate-rotateOut"
                }`}
                alt="jobvacancy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RotationPandingPage;
