import { useState } from "react";
import axios from "axios";
import { FaCamera, FaUser } from "react-icons/fa";
import FormLayout from "./Formlayout";

const Home = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [academic, setAcademic] = useState("");
  const [company1, setCompany1] = useState("");
  const [company2, setCompany2] = useState("");
  const [company3, setCompany3] = useState("");
  const [salaryInfo, setSalaryInfo] = useState("");
  const [specialization,setSpecialization]=useState("")
  const [cv, setCv] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [cvSubmitted, setCvSubmitted] = useState(false); // Track if CV has been submitted

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("gender", gender);
      formData.append("location", location);
      formData.append("academic", academic);
      formData.append("company1", company1);
      formData.append("company2", company2);
      formData.append("company3", company3);
      formData.append("salaryInfo", salaryInfo);
      formData.append("specialization", specialization);
      formData.append("cv", cv); // Append CV file

      const response = await axios.post("http://localhost:5000/Api/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.message);
      setError("");
      setCvSubmitted(true); // Mark that CV has been submitted

      // Clear form fields except CV
      setFirstName("");
      setLastName("");
      setGender("");
      setLocation("");
      setAcademic("");
      setCompany1("");
      setCompany2("");
      setCompany3("");
      setSalaryInfo("");
      setSpecialization("")

      setShowPopup(true); // Show success popup

      // Automatically hide popup after 3 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || "Error submitting form");
      setMessage("");
    }
  };

  const handleCvUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("cv", cv); // Append updated CV file

      const response = await axios.put("http://localhost:5000/Api/users/${userId}/cv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("CV successfully updated!");
      setError("");
      setShowPopup(true); // Show success popup

      // Automatically hide popup after 3 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || "Error updating CV");
      setMessage("");
    }
  };

  return (
    <div className="h-fit-content flex items-center justify-center flex-col">
   
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold text-green-500">{cvSubmitted ? "CV Successfully Updated!" : "Successfully Registered!"}</h3>
            <p className="text-gray-700 mt-2">{cvSubmitted ? "Your CV has been successfully updated." : "Your details have been successfully submitted."}</p>
          </div>
        </div>
      )}
      <div className="w-[100%] h-[8vh] bg-blue-500 text-white-100 flex items-center justify-center  flex-col"></div>
      <div className="w-[100%] h-[2vh] bg-gray-500 text-white-100 flex items-center justify-center mb-[10px] flex-col"></div>
      <FormLayout />
      <div className="shadow-lg rounded-lg w-full max-w-4xl flex items-stretch justify-center flex-col">
      
        <div className="flex-grow">
        <h2 className="text-2xl font-semibold text-center p-1">Submit Your Details</h2>
          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="bg-blue-800 rounded-lg p-8 text-white space-y-4 h-full flex flex-row items-center justify-around shadow-lg">
            
            <div className="w-[45%]">
            <div className="flex flex-col">
              <label className="mb-1">First Name:</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="p-2 rounded-lg border border-gray-300 text-black w-full"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1">Last Name:</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="p-2 rounded-lg border border-gray-300 text-black"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1">Gender:</label>
              <input
                type="text"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="p-2 rounded-lg border border-gray-300 text-black"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1">Location:</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="p-2 rounded-lg border border-gray-300 text-black"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1">Academic Qualification:</label>
              <select
                value={academic}
                onChange={(e) => setAcademic(e.target.value)}
                required
                className="p-2 rounded-lg border border-gray-300 text-black"
              >
                <option value="">Select your qualification</option>
                <option value="Masters">Master</option>
                <option value="Degree">Degree</option>
                <option value="Diploma">Diploma</option>
                <option value="Diploma">Certificate</option>
              </select>
            </div>
            <div className="flex flex-col">
  <label className="mb-1">Specialization:</label>  {/* Change from "Specification" to "Specialization" */}
  <input
    type="text"
    value={specialization}
    onChange={(e) => setSpecialization(e.target.value)}
    required
    className="p-2 rounded-lg border border-gray-300 text-black"
  />
</div>

            </div>
            <div className="w-[45%]">
              
            <div className="flex flex-col">
              <label className="mb-1">Work Experience (Company 1)</label>
              <input
                type="text"
                value={company1}
                onChange={(e) => setCompany1(e.target.value)}
                required
                className="p-2 rounded-lg border border-gray-300 text-black"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1">Work Experience (Company 2):</label>
              <input
                type="text"
                value={company2}
                onChange={(e) => setCompany2(e.target.value)}
                className="p-2 rounded-lg border border-gray-300 text-black"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1">Work Experience (Company 3):</label>
              <input
                type="text"
                value={company3}
                onChange={(e) => setCompany3(e.target.value)}
                className="p-2 rounded-lg border border-gray-300 text-black"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1">Salary Info:</label>
              <input
                type="number"
                value={salaryInfo}
                onChange={(e) => setSalaryInfo(e.target.value)}
                required
                className="p-2 rounded-lg border border-gray-300 text-black"
              />
            </div>

            {!cvSubmitted && (
              <div className="flex flex-col">
                <label className="mb-1">CV Upload:</label>
                <input
                  type="file"
                  onChange={(e) => setCv(e.target.files[0])}
                  required
                  className="p-2 rounded-lg border border-gray-300 text-black"
                />
              </div>
            )}

            <button type="submit" className="w-full p-3 mt-4 bg-orange-400 rounded-lg hover:bg-green-900">
              Submit
            </button>
            </div>
            {message && <p className="mt-4 text-green-500">{message}</p>}
            {error && <p className="mt-4 text-red-500">{error}</p>}
          </form>

          {cvSubmitted && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-center">Update Your CV</h3>
              <form onSubmit={handleCvUpdate} className="bg-blue-600 rounded-lg p-8 text-white space-y-4">
                <div className="flex flex-col">
                  <label className="mb-1">Upload Updated CV:</label>
                  <input
                    type="file"
                    onChange={(e) => setCv(e.target.files[0])}
                    className="p-2 rounded-lg border border-gray-300 text-black"
                    required
                  />
                </div>
                <button type="submit" className="w-full p-3 mt-4 bg-blue-800 rounded-lg hover:bg-white-900">
                  Update CV
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
