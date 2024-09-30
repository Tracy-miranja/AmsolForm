import { useState } from "react";
import logo from "./assets/amsolJobVacancies.png";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import axios from "axios";

const FormLayout = () => {
  const [activeSection, setActiveSection] = useState("personalDetails");
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [lastName, setLastName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [whatAppNo, setWhatAppNo] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [nationality, setNationality] = useState("");
  const [location, setLocation] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [academicLevel, setAcademicLevel] = useState("");
  const [company1, setCompany1] = useState("");
  const [company2, setCompany2] = useState("");
  const [company3, setCompany3] = useState("");
  // Add these state declarations
  const [position1, setPosition1] = useState("");
  const [duration1, setDuration1] = useState("");
  const [position2, setPosition2] = useState("");
  const [duration2, setDuration2] = useState("");
  const [position3, setPosition3] = useState("");
  const [duration3, setDuration3] = useState("");

  const [salaryInfo, setSalaryInfo] = useState("");
  const [cv, setCv] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [cvSubmitted, setCvSubmitted] = useState(false);

  const navigateToSection = (section) => {
    setActiveSection(section);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !secondName || !lastName || !email || !cv) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("secondName", secondName);
      formData.append("idNumber", idNumber);
      formData.append("whatAppNo", whatAppNo);
      formData.append("phoneNumber", phoneNumber);
      formData.append("email", email);
      formData.append("age", age);
      formData.append("nationality", nationality);
      formData.append("location", location);
      formData.append("specialization", specialization);
      formData.append("academicLevel", academicLevel);

      // Append work experience fields
      formData.append("company1", company1);
      formData.append("position1", position1);
      formData.append("duration1", duration1);
      formData.append("company2", company2);
      formData.append("position2", position2);
      formData.append("duration2", duration2);
      formData.append("company3", company3);
      formData.append("position3", position3);
      formData.append("duration3", duration3);

      formData.append("salaryInfo", salaryInfo);
      formData.append("cv", cv); // Append CV file

      const response = await axios.post(
        "http://localhost:5000/Api/users",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(response.data.message);
      setError("");
      setCvSubmitted(true); // Mark that CV has been submitted
      setFirstName("");
      setSecondName("");
      setLastName("");
      setIdNumber("");
      setWhatAppNo("");
      setPhoneNumber("");
      setEmail("");
      setNationality("");

      setLocation("");
      setAcademicLevel("");
      setCompany1("");
      setCompany2("");
      setCompany3("");
      setSalaryInfo("");
      setSpecialization("");
      setAge("");
      setCv(null);
      setSpecialization("");

      setShowPopup(true); // Show success popup

      // Automatically hide popup after 3 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    } catch (err) {
      console.error(err); // Log the entire error
      setError(err.response?.data?.message || "Error submitting form");
      setMessage("");
    }
  };

  return (
    <>
      <div className="w-[100%] h-[50px] bg-gradient-to-r from-[#25b2e6] to-[#0922e3] flex items-center justify-around shadow-2xl p-8 text-white gap-5">
        <div className="bg-white rounded-full w-[200px] flex items-center justify-center">
          <img src={logo} alt="hrOutsourcing" className="w-[110px] p-1" />
        </div>
        <div className="flex flex-row items-center gap-5">
          <Link className="text-white flex flex-row gap-2" to="/">
            <FaHome className="mt-1" />
            Home
          </Link>
        </div>
      </div>

      <div className="w-[70%] h-screen flex flex-col items-center p-2 mt-10 border border-b-6 shadow-lg">
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
        {/* Row Links */}
        <div className="w-[100%] h-fit shadow-lg rounded-lg flex flex-row">
          <div
            onClick={() => navigateToSection("personalDetails")}
            className={`cursor-pointer p-1 border-b-2 w-[30%] ${
              activeSection === "personalDetails"
                ? "bg-blue-500 text-white"
                : ""
            } hover:bg-blue-500 hover:text-white`}
          >
            <h2 className="font-bold">1. Personal Details</h2>
          </div>
          <div
            onClick={() => navigateToSection("institutionDetails")}
            className={`cursor-pointer p-1 border-b-2 w-[30%] ${
              activeSection === "institutionDetails"
                ? "bg-blue-500 text-white"
                : ""
            } hover:bg-blue-500 hover:text-white`}
          >
            <h2 className="font-bold">2. Qualifications Details</h2>
          </div>
          <div
            onClick={() => navigateToSection("uploadApply")}
            className={`cursor-pointer p-1 w-[30%] ${
              activeSection === "uploadApply" ? "bg-blue-500 text-white" : ""
            } hover:bg-blue-500 hover:text-white`}
          >
            <h2 className="font-bold">3. Upload Documents and Apply</h2>
          </div>
        </div>

        {/* Form Sections */}
        {activeSection === "personalDetails" && (
          <div className="w-full bg-white p-6 shadow-lg rounded-lg">
            <h2 className="font-bold mb-4">Personal Details</h2>
            <form action="/Api/users" method="POST">
              {/* Personal Details Form Fields */}
              <div className="mb-4 flex flex-row">
                <label className="block text-black w-[15%] font-semibold">
                  First Name:
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4 flex flex-row">
                <label className="block text-black w-[15%] font-semibold">
                  Second Name:
                </label>
                <input
                  type="text"
                  value={secondName}
                  onChange={(e) => setSecondName(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4 flex flex-row">
                <label className="block text-black w-[15%] font-semibold">
                  Last Name:
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4 flex flex-row">
                <label className="block text-black w-[15%] font-semibold">
                  ID Number:
                </label>
                <input
                  type="Number"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4 flex flex-row">
                <label className="block text-black w-[15%] font-semibold">
                  WhatsApp No.:
                </label>
                <input
                  type="tel"
                  value={whatAppNo}
                  onChange={(e) => setWhatAppNo(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4 flex flex-row">
                <label className="block text-black w-[15%] font-semibold">
                  Phone Number:
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4 flex flex-row">
                <label className="block text-black w-[15%] font-semibold">
                  Email:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4 flex flex-row">
                <label className="block text-black w-[15%] font-semibold">
                  Age:
                </label>
                <input
                  type="Number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4 flex flex-row">
                <label className="block text-black w-[15%] font-semibold">
                  Nationality:
                </label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4 flex flex-row">
                <label className="block text-black w-[15%] font-semibold">
                  Location:
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="button"
                className="w-[10%] ml-40 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                onClick={() => navigateToSection("institutionDetails")}
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
            <h2 className="font-semibold mb-4">Qualifications</h2>
            <form action="/Api/users" method="POST">
              {/* Institutional Form Fields */}
              <div className="mb-4 flex flex-row">
                <label className="block text-black w-[15%] font-semibold">
                  Specialization:
                </label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4 flex flex-row">
                <label className="block text-black w-[15%] font-semibold">
                  Academic level:
                </label>
                <select
                  value={academicLevel}
                  onChange={(e) => setAcademicLevel(e.target.value)}
                  required
                  className="w-full p-2 rounded-lg border border-gray-300 text-black"
                >
                  <option value="">Select your qualification</option>
                  <option value="Masters">Masters</option>
                  <option value="Degree">Degree</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Certificate">Certificate</option>
                </select>
              </div>
              {/* //workexperience part */}

              <div>
                <input
                  type="text"
                  placeholder="Company 1"
                  value={company1}
                  onChange={(e) => setCompany1(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Position 1"
                  value={position1}
                  onChange={(e) => setPosition1(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Duration 1"
                  value={duration1}
                  onChange={(e) => setDuration1(e.target.value)}
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Company 2"
                  value={company2}
                  onChange={(e) => setCompany2(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Position 2"
                  value={position2}
                  onChange={(e) => setPosition2(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Duration 2"
                  value={duration2}
                  onChange={(e) => setDuration2(e.target.value)}
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Company 3"
                  value={company3}
                  onChange={(e) => setCompany3(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Position 3"
                  value={position3}
                  onChange={(e) => setPosition3(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Duration 3"
                  value={duration3}
                  onChange={(e) => setDuration3(e.target.value)}
                />
              </div>

              <div className="mb-4 flex flex-row">
                <label className="block text-black w-[15%] font-semibold">
                  Salary Information:
                </label>
                <input
                  type="number"
                  value={salaryInfo}
                  onChange={(e) => setSalaryInfo(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="button"
                className="w-[10%] ml-40 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
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
            <h2 className="font-bold mb-4">Upload Documents and Apply</h2>
            <form onSubmit={handleSubmit}>
              {/* CV Upload Field */}
              <div className="mb-4 flex flex-row">
                <label className="block text-black w-[15%] font-semibold">
                  Upload CV:
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setCv(e.target.files[0])}
                  required
                  className="w-full p-2 border rounded"
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
      </div>
    </>
  );
};

export default FormLayout;
