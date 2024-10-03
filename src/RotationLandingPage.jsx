import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import vacancy from "./assets/Vector2b.svg";
import jobvacancy from "./assets/Group1.svg";


const RotationPandingPage = () => {
  return (
    <div className="flex flex-col h-[100vh]">
      <Navbar />
      <div className="flex w-full section-container">
        <div className="flex w-[60%] h-[60vh]">
          <img src={vacancy} className="h-[100vh]" alt="vacancy" />
        </div>
        {/* Second section */}
        <div className="flex w-[50%] flex-col gap-5">
          {/* Log in section */}
          <div className="flex w-[100%] h-[40vh] justify-center gap-5 flex-col relative parent-container">
            <h1 className="font-bold text-2xl">
              You haven't Logged In?<br />click the button below
            </h1>
            <p>
              See the latest vacancies and <br />
              how we can supercharge your search
            </p>
            <Link
              to="/signupform"
              className="bg-blue-400 rounded-full text-white p-1 pl-2 pr-2 hover:bg-gray-400 hover:text-white font-bold w-[100px] text-center rotate-hover"
            >
              Log In
            </Link>
            <div className="animation login-image">
              <img
                src={jobvacancy}
                className="w-[100%] h-[40vh] absolute -ml-[250px] -mt-[200px] hidden-on-hover"
                alt="jobvacancy"
              />
            </div>
          </div>

          {/* Sign up section */}
          <div className="flex h-[40vh] flex-col gap-5 justify-center relative parent-container">
            <h1 className="font-bold text-2xl">
              You haven't signed Up?<br />click the button below
            </h1>
            <p>
              See the latest vacancies and <br />
              how we can supercharge your search
            </p>
            <Link
              to="/signupform"
              className="bg-blue-400 rounded-full text-white p-1 pl-2 pr-2 hover:bg-gray-400 hover:text-white font-bold w-[100px] text-center rotate-hover"
            >
              Sign Up
            </Link>
            <div className="animation signup-image">
              <img
                src={jobvacancy}
                className="w-[100%] h-[40vh] absolute -ml-[250px] -mt-[200px] hidden-on-hover"
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
