import React, { useState } from "react";
import { Link } from "react-router-dom";
import vacancy from "./assets/vector 2tt.svg";
import jobvacancy from "./assets/Group1.svg";
import logo from "./assets/amsolJobVacancies.png";
import { FaHome } from "react-icons/fa";
import arrow from "./assets/vector 1.svg";
import jobsKenya from "./assets/Vector 6low.svg";
import desktopbg from "./assets/Desktop.svg";
import topimg from "./assets/Vector 1se.svg"
import secimg from "./assets/Vector 2top.svg"
import sideimg from "./assets/Vector 2side.svg"

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
        <h1 className="text-white font-bold">
          Empowering Organizations To Achieve Emiratization With Our Latest
          Guidebook
        </h1>
      </div>
      <div className="w-[100%] h-[50px] flex items-center justify-center p-8 text-blue-400 gap-5 z-10">
        <div className="bg-inherit rounded-full w-[200px] flex items-center justify-center">
          {" "}
          <img src={logo} alt="hrOutsourcing" className="w-[110px] p-1" />
        </div>
        <div
          className={`flex flex-row items-center gap-5 z-10 ${
            hoveredSection ? "text-white" : "text-[#0A599E]"
          }`}
        >
          <a
            className={`hover:text-white flex flex-row gap-2" href="#" ${
              isHovered ? "text-white" : "text-[#0A599E]"
            }`}
          >
            <FaHome
              className={`mt-1 hover:bg-gray-400  hover:text-white ${
                isHovered ? "text:white" : "text-[#0A599E]"
              }`}
            />
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
            } hover:text-white p-1 pl-2 pr-2 hover:bg-gray-400 font-semibold`}
          >
            Career
          </Link>
        </div>
      </div>

      <div className="flex w-full">
        <div className="flex w-[60%] h-[60vh] relative">
          <img src={ topimg} className="h-[7vh] w-[5%] absolute ml-[75%] mt-[40px] "
            alt="vacancy"/>
          <img
            src={vacancy}
            className="h-[100vh] absolute -mt-[55px] "
            alt="vacancy"
          />
          <h1 className="absolute mt-[25%] ml-[19%] flex flex-col font-extrabold text-5xl text-gray-100 ">
            We’re <br />
            AMSOL
            <span className="text-2xl font-normal">
              <br />
              The Staffing & HR Solutions
              <br /> specialists
            </span>
          </h1>
        </div>
        {/* Second section */}
        <div className="flex w-[40%] flex-col gap-5 justify-center h-[80vh]">
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
            <h1
              className={`font-extrabold text-3xl  ${
                isHovered ? "text-white" : "text-[#0A599E]"
              }`}
            >
               <img src={secimg} className="h-[10vh] w-[18%] absolute ml-[20%] -mt-10"
            alt="vacancy"/>
              You <br />
              haven't Logged In?
            </h1>
            <p>
              See the latest vacancies and <br />
              how we can supercharge your search
            </p>
            <Link
              to="/form"
              className="flex gap-2 items-center justify-center bg-white rounded-full border border-blue-900 text-[#0A599E] p-1 pl-2 pr-2 hover:bg-gray-400 hover:text-white font-bold w-[100px] text-center rotate-hover z-10"
            >
              <span>Log In</span> <img src={arrow} className="w-5 h-5" />
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
            <h1
              className={`font-extrabold text-3xl  ${
                isHovered ? "text-white" : "text-[#0A599E]"
              }`}
            >
              You
              <br /> haven't signed Up?
            </h1>
            <p>

              See the latest vacancies and <br />
              how we can supercharge your search
            </p>
            <Link
              to="/signupform"
              className="flex gap-2 items-center justify-center bg-white rounded-full text-[#0A599E] text-center border border-blue-400  p-1 pl-2 pr-2 hover:bg-gray-400 hover:text-white font-bold w-[120px] text-center rotate-hover z-10"
            >
              <span>Sign Up</span> <img src={arrow} className="w-5 h-5" />
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
            <img src={sideimg} className="h-[20vh] w-[20%] absolute ml-[70%] -mt-15"
            alt="vacancy"/>
          </div>
        </div>
      </div>
      <div>
        <img
          src={jobsKenya}
          className="flex absolute -mt-[100px] ml-[280px] h-[25vh]"
        />
      </div>
    </div>
  );
};

export default RotationPandingPage;