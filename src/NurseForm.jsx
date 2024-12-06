import { useState } from "react";
import logo from "./assets/amsolJobVacancies.png";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import axios from "axios";
import arrow from "./assets/Vector1.svg";
import HandleLogout from "./logout";
import { useNavigate } from "react-router-dom";
import { useUser } from "./Context/UserContext";

const NurseForm = () => {

  const { token } = useUser(); 
  const navigate=useNavigate()
  const [activeSection, setActiveSection] = useState("personalDetails");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); 
  const [age, setAge] = useState("");
  const [nationality, setNationality] = useState("");
  const [location, setLocation] = useState("");
  const [positionApplied, setPositionApplied]=useState("");
  const [yearsOfExperience,setYearsOfExperience]=useState("");
  const [currentJobTitle, setCurrentJobTitle]=useState("");
  const [currentCompany,setcurrentCompany]=useState("");
  const [currentSalary, setCurrentSalary] = useState("");
  const [expectedSalary,setExpectedSalary]=useState("");
  const [desiredAllowance, setDesiredAllowance]=useState("");
  const [highestEducation, setHighestEducation]=useState("")
  const [levelOfEducation, setlevelOfEducation]=useState("");
  const [nursingLicense,setNursingLicense]=useState("");
  const [cv, setCv] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [cvSubmitted, setCvSubmitted] = useState(false);
const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const navigateToSection = (section) => {
    setActiveSection(section);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!fullName || !phoneNumber || !age || !email || !cv) {
      alert("Please fill out all required fields.");
      setLoading(false); 
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phoneNumber", phoneNumber);
      formData.append("age", age);
      formData.append("nationality", nationality);
      formData.append("location", location);
      formData.append("positionApplied", positionApplied);
      formData.append("highestEducation", highestEducation);
      formData.append("yearsOfExperience", yearsOfExperience);
      formData.append("currentJobTitle", currentJobTitle);
      formData.append("currentCompany", currentCompany);
      formData.append("currentSalary", currentSalary);
      formData.append("expectedSalary", expectedSalary);
      formData.append("desiredAllowance", desiredAllowance);
      formData.append("levelOfEducation", levelOfEducation);
      formData.append("nursingLicense", nursingLicense);
      formData.append("cv", cv);
  
      const response = await axios.post(
        "https://amsol-api-2.onrender.com/api/nurse-applications",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, 
          },
          withCredentials: true, 
        }
      );
  
      setMessage("Form submitted successfully!");
      setError("");
      setShowPopup(true);
  
      setTimeout(() => {
        setShowPopup(false);
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error submitting form");
      setMessage("");
    } finally {
      setLoading(false); 
    }
  };
  

  const validateForm = () => {
    return (
      fullName &&
      email &&
      phoneNumber &&
      email &&
      age &&
      nationality &&
      location
    );
  };

  const handleNextButtonClick = () => {
    if (validateForm()) {
      setIsFormValid(true);
      setActiveSection("institutionDetails"); 
    } else {
      setIsFormValid(false);
      setError("Please fill out all required fields before proceeding."); 
    }
  };

  return (
    <>
      <div className="w-[100%] h-[20px] bg-gradient-to-r from-[#25b2e6] to-blue-500 flex items-center justify-around shadow-2xl p-8 text-white gap-5 overflow-fixed">
        <div className="bg-white rounded-full sm:w-[100px] md:w-[200px] flex items-center justify-center">
          <img
            src={logo}
            alt="hrOutsourcing"
            className="sm:w-[50px] md:w-[110px] p-1"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex flex-row items-center gap-5">
            <Link className="text-white flex flex-row gap-2" to="/">
              <FaHome className="mt-1" />
              Home
            </Link>
          </div>
          
          <div>
            <HandleLogout />
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="sm:w-[98%] md:w-[70%] h-screen flex flex-col items-center p-2 mt-10 border border-b-6 shadow-lg">
          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h3 className="text-xl font-bold text-green-500">
                  {cvSubmitted
                    ? "Form succesfully submitted!"
                    : "Successfully Registered!"}
                    
                </h3>
                <p className="text-gray-700 mt-2">
                  {cvSubmitted
                    ? "Your Form has been successfully submitted."
                    : "Your details have been successfully submitted."}
                </p>
              </div>
            </div>
          )}
      

          <div className="w-[100%] h-fit shadow-lg rounded-lg flex flex:col md:flex-row">
            <div
              onClick={() => navigateToSection("personalDetails")}
              className={`cursor-pointer p-1 border-b-2 sm:w-[40%] w-[30%] ${activeSection === "personalDetails"
                  ? "bg-blue-500 text-white"
                  : ""
                } hover:bg-blue-500 hover:text-white`}
            >
              <h2 className="font-bold">1. Personal Details</h2>
            </div>
            <div
              onClick={handleNextButtonClick}
              className={`cursor-pointer p-1 border-b-2 sm:w-[40%] w-[100%] w-[30%] ${activeSection === "institutionDetails"
                  ? "bg-blue-500 text-white"
                  : ""
                } hover:bg-blue-500 hover:text-white`}
            >
              <h2 className="font-bold">2. Qualifications Details</h2>
            </div>
            <div
              onClick={handleNextButtonClick}
              className={`cursor-pointer p-1 w-[30%] ${activeSection === "uploadApply" ? "bg-blue-500 text-white" : ""
                } hover:bg-blue-500 hover:text-white`}
            >
              <h2 className="font-bold">3. Upload Documents and Apply</h2>
            </div>
          </div>

          {/* Form Sections */}
          {activeSection === "personalDetails" && (
            <div className="w-full bg-white p-6 shadow-lg rounded-lg">
              <form action="/Api/users" method="POST">
                {/* Personal Details Form Fields */}
                <div className="mb-4 flex flex-col md:flex-row">
                  <label className="block text-black sm:w-[100%] md:w-[15%] font-semibold">
                    FullName <span className="text-red-500">*</span>:
                  </label>
                  <input
                  id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full p-2 border rounded text-black bg-gray-100"
                  />
                </div>
                <div className="mb-4 flex flex-row">
                  <label className="block text-black sm:w-[100%] md:w-[15%] font-semibold">
                    Email<span className="text-red-500">*</span>:
                  </label>
                  <input
                  id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 border rounded text-black bg-gray-100"
                  />
                </div>
                <div className="mb-4 flex flex-row">
                  <label className="block text-black sm:w-[100%] md:w-[15%] font-semibold">
                    Phone Number<span className="text-red-500">*</span>:
                  </label>
                  <input
                  id="phonenumber"
                    type="Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="w-full p-2 border rounded text-black bg-gray-100"
                  />
                </div>
               
                <div className="mb-4 flex flex-row">
                  <label className="block text-black sm:w-[100%] md:w-[15%] font-semibold">
                    age<span className="text-red-500">*</span>:
                  </label>
                  <input
                   id="age"
                    type="num"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    className="w-full p-2 border rounded text-black bg-gray-100"
                  />
                </div>
               
                <div className="mb-4 flex sm:flex-row">
                  <label className="block text-black sm:w-[100%] md:w-[15%] font-semibold">
                    Nationality<span className="text-red-500">*</span>:
                  </label>
                  <input
                    id="nationality"
                    type="type"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    required
                    className="w-full p-2 border rounded text-black bg-gray-100"
                  />
                </div>
                <div className="mb-4 flex flex-row">
                  <label className="block text-black sm:w-[100%] md:w-[15%] font-semibold">
                    Location<span className="text-red-500">*</span>:
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 border rounded text-black bg-gray-100"
                  />
                </div>
               
                <button
                  type="button"
                  className=" sm:w-[40%]  md:w-[30%] md:ml-40 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  onClick={handleNextButtonClick}
                >
                  Next
                </button>
                {message && <p className="mt-4 text-green-500">{message}</p>}
                {error && <p className="mt-4 text-red-500">{error}</p>}
              </form>
            </div>
          )}

          {activeSection === "institutionDetails" && (
            <div className="w-full bg-white p-6 shadow-lg rounded-lg">
              <form action="/api/users" method="POST">
                {/* Institutional Form Fields */}
                
                <div className="mb-4 flex  md:flex-row">
                  <label className="block text-black sm:w-[100%] md:w-[15%] font-semibold">
                  Highest Education<span className="text-red-500">*</span>:
                  </label>
                  <select
                    id="highestEducation"
                    value={highestEducation}
                    onChange={(e) => setHighestEducation(e.target.value)}
                    required
                    className="w-full p-2 rounded-lg border text-black bg-gray-100"
                  >
                    <option value="">Select your qualification</option>
                    <option value="Master's Degree">Doctorate(PhD)</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="Postgraduate Diploma">
                      Postgraduate Diploma{" "}
                    </option>
                    <option value="Bachelor’s Degree">Bachelor’s Degree</option>
                    <option value="Higher Diploma">
                    Higher Diploma
                    </option>
                    <option value="Diploma">Diploma</option>
                    <option value="Diploma">Professional Certificate</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Degree">others</option>
                  </select>
                </div>       
                <div className="mb-4 flex  flex-row">
                  <label className="block text-black sm:w-[100%] md:w-[15%] font-semibold">
                    Specify Level Of Education<span className="text-red-500">*</span>:
                  </label>
                  <input
                  id="levelOfEducation"
                    type="text"
                    value={levelOfEducation}
                    onChange={(e) => setlevelOfEducation(e.target.value)}
                    required
                    className="w-full p-2 border rounded text-black bg-gray-100"
                  />
                </div>
                <div className="mb-4 flex  flex-row">
                  <label className="block text-black sm:w-[100%] md:w-[15%] font-semibold">
                   Position Applied:<span className="text-red-500">*</span>:
                  </label>
                  <input
                  id="positionApplied"
                    type="text"
                    value={positionApplied}
                    onChange={(e) => setPositionApplied(e.target.value)}
                    required
                    className="w-full p-2 border rounded text-black bg-gray-100"
                  />
                </div>
                <div className="mb-4 flex  md:flex-row">
                  <label className="block text-black sm:w-[100%] md:w-[15%] font-semibold">
                    Current Salary<span className="text-red-500">*</span>:
                  </label>
                  <input
                  id="currentSalary"
                    type="number"
                    value={currentSalary}
                    onChange={(e) => setCurrentSalary(e.target.value)}
                    className="w-full p-2 border rounded text-black bg-gray-100"
                  />
                </div>

                <div className="mb-4 flex  md:flex-row">
                  <label className="block text-black sm:w-[100%] md:w-[15%] font-semibold">
                    Expected Salary<span className="text-red-500">*</span>:
                  </label>
                  <input
                  id="expectedSalary"
                    type="number"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    className="w-full p-2 border rounded text-black bg-gray-100"
                  />
                </div>
                <div className="mb-4 flex  md:flex-row">
                  <label className="block text-black sm:w-[100%] md:w-[15%] font-semibold">
                    Years of Experience<span className="text-red-500">*</span>:
                  </label>
                  <input
                  id="yearsOfExperience"
                    type="number"
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    className="w-full p-2 border rounded text-black bg-gray-100"
                  />
                </div>
                <div className="mb-4 flex  md:flex-row">
                  <label className="block text-black sm:w-[100%] md:w-[15%] font-semibold">
                    Current Job title<span className="text-red-500">*</span>:
                  </label>
                  <input
                  id="currentjobtitle"
                    type="text"
                    value={currentJobTitle}
                    onChange={(e) => setCurrentJobTitle(e.target.value)}
                    className="w-full p-2 border rounded text-black bg-gray-100"
                  />
                </div>
                <div className="mb-4 flex  md:flex-row">
                  <label className="block text-black sm:w-[100%] md:w-[15%] font-semibold">
                    Current Company<span className="text-red-500">*</span>:
                  </label>
                  <input
                  id="currentCompany"
                    type="text"
                    value={currentCompany}
                    onChange={(e) => setcurrentCompany(e.target.value)}
                    className="w-full p-2 border rounded text-black bg-gray-100"
                  />
                </div>
                <div className="mb-4 flex  md:flex-row">
                  <label className="block text-black sm:w-[100%] md:w-[15%] font-semibold">
                    Desired allowance<span className="text-red-500">*</span>:
                  </label>
                  <input
                  id="desiredallowance"
                    type="text"
                    value={desiredAllowance}
                    onChange={(e) => setDesiredAllowance(e.target.value)}
                    className="w-full p-2 border rounded text-black bg-gray-100"
                  />
                </div>
                <button
                  type="button"
                  className="sm:w-[40%]  md:w-[30%] md:ml-40 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                  onClick={() => navigateToSection("uploadApply")}
                >
                  Next
                </button>
                {message && <p className="mt-4 text-green-500">{message}</p>}
                {error && <p className="mt-4 text-red-500">{error}</p>}
              </form>
            </div>
          )}

          {activeSection === "uploadApply" && (
            <div className="w-full bg-white p-6 shadow-lg rounded-lg">
              <form onSubmit={handleSubmit}>
              <div className="mb-4 flex md:flex-row">
  <label className="block text-black sm:w-[100%] md:w-[15%] font-semibold">
    Nursing license<span className="text-red-500">*</span>:
  </label>
  <select 
  id="nursingLicense"
  value={nursingLicense}
  onChange={(e)=>setNursingLicense(e.target.value)}
   className="w-full p-2 border rounded bg-gray-100 text-black">
    <option value="No">No</option>  
    <option value="Yes">Yes</option> 
  </select>
</div>
                {/* CV Upload Field */}
                <div className="mb-4 flex flex-row">
                  <label className="block text-black sm:w-[100%] md:w-[15%] font-semibold">
                    Upload CV<span className="text-red-500">*</span>:
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"

                    name="cv"
                    onChange={(e) => setCv(e.target.files[0])}
                    required
                    className="w-full p-2 border rounded bg-gray-100 text-black"
                  />
                </div>

                <div className="flex flex-row justify-center mt-6">
                  <button
                    type="submit"
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  >
                    Submit Application
                  </button>
                </div>
              
                {error && <p className="mt-4 text-red-500">{error}</p>}
                {message && <p className="mt-4 text-green-500">{message}</p>}
              </form>
            </div>
          )}
     {loading && (
  <div className="spinner-overlay bg-black">
    <div className="loading-circle"></div>
  </div>
)}
        </div>
      </div>
    </>
  );
};

export default NurseForm;
