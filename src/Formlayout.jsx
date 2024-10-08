import { useState } from "react";

const FormLayout = () => {
  const [activeSection, setActiveSection] = useState("personalDetails");

  // Handler to set active section based on the button clicked
  const navigateToSection = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="w-[80%] h-screen flex flex-col items-center bg-gray-100 p-2">
      {/* Row Links */}
      <div className="w-[100%] h-fit shadow-lg rounded-lg flex flex-row">
        <div
          onClick={() => navigateToSection("personalDetails")}
          className={`cursor-pointer p-1 border-b-2 w-[30%] ${
            activeSection === "personalDetails" ? "bg-blue-500 text-white" : ""
          } hover:bg-blue-500 hover:text-white`}
        
        >
          <h2 className="font-bold">1. Personal Details</h2>
        </div>
        <div
          onClick={() => navigateToSection("institutionDetails")}
          className={`cursor-pointer p-1 border-b-2 w-[30%] ${
            activeSection === "institutionDetails" ? "bg-blue-500 text-white" : ""
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
        <div className="w-full  bg-white p-6 shadow-lg rounded-lg">
          <h2 className=" font-bold mb-4">Personal Details</h2>
          <form>
            {/* Personal Details Form Fields */}
            <div className="mb-4 flex flex-row">
              <label className="block text-gray-700 w-[15%] font-bold">Full Name:</label>
              <input type="text" required className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4 flex flex-row">
              <label className="block text-gray-700 w-[15%] font-bold">Second Name:</label>
              <input type="text" required className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4 flex flex-row">
              <label className="block text-gray-700 w-[15%] font-bold">last Name:</label>
              <input type="text" required className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4 flex flex-row">
              <label className="block text-gray-700 w-[15%] font-bold">ID Number:</label>
              <input type="text" required className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4 flex flex-row">
              <label className="block text-gray-700 w-[15%] font-bold">WhatApp No.:</label>
              <input type="text" required className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4 flex flex-row">
              <label className="block text-gray-700 w-[15%] font-bold">Phone Number:</label>
              <input type="text" required className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4 flex flex-row">
              <label className="block text-gray-700 w-[15%] font-bold">Email:</label>
              <input type="email" required className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4 flex flex-row">
              <label className="block text-gray-700 w-[15%] font-bold">Age:</label>
              <input type="email" required className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4 flex flex-row">
              <label className="block text-gray-700 w-[15%] font-bold">Nationality:</label>
              <input type="email" className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4 flex flex-row">
              <label className="block text-gray-700 w-[15%] font-bold">Location:</label>
              <input type="email" required className="w-full p-2 border rounded" />
            </div>
            <button
              type="button"
              className="w-[10%] ml-40 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              onClick={() => navigateToSection("institutionDetails")}
            >
              Next
            </button>
          </form>
        </div>
      )}

      {activeSection === "institutionDetails" && (
        <div className="w-full bg-white p-6 shadow-lg rounded-lg">
          <h2 className=" font-semibold mb-4">Qualifications</h2>
          <form>
            {/* Institutional Form Fields */}
            <div className="mb-4 flex flex-row">
              <label className="block text-gray-700 w-[15%] font-bold">Specialization:</label>
              <input type="text" required className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4 flex flex-row">
              <label className="block text-gray-700 w-[15%] font-bold">Academic level:</label>
              <select
                value=""
                onChange=""
                required
                className="w-full p-2 rounded-lg border border-gray-300 text-black"
              >
                <option value="">Select your qualification</option>
                <option value="Masters">Master</option>
                <option value="Degree">Degree</option>
                <option value="Diploma">Diploma</option>
                <option value="Diploma">Certificate</option>
              </select>
            </div>
           
            <div className="mb-4 flex flex-row">
              <label className="block text-gray-700 w-[15%] font-bold">Specialization:</label>
              <input type="text" required className="w-full p-2 border rounded " />
            </div>
            <div className="mb-4 flex flex-row">
              <label className="block text-gray-700 w-[15%] font-bold">Work Experience: (Company 1)</label>
              <input type="text" required className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4 flex flex-row">
              <label className="block text-gray-700 w-[15%] font-bold">Work Experience: (Company 2)</label>
              <input type="text" required className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4 flex flex-row">
              <label className="block text-gray-700 w-[15%] font-bold">Work Experience: (Company 3)</label>
              <input type="text" required className="w-full p-2 border rounded" />
            </div>
            <div className="mb-4 flex flex-row">
              <label className="block text-gray-700 w-[15%] font-bold">Salary Info:</label>
              <input type="text" required className="w-full p-2 border rounded" />
            </div>
            <button
              type="button"
              className="w-[10%] ml-40 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              onClick={() => navigateToSection("uploadApply")}
            >
              Next
            </button>
          </form>
        </div>
      )}

      {activeSection === "uploadApply" && (
        <div className="w-full bg-white p-6 shadow-lg rounded-lg">
          <h2 className=" font-semibold mb-4">Upload Documents</h2>
          <form>
            {/* Upload and Apply Form Fields */}
            <div className="mb-4 flex flex-row">
              <label className="block text-gray-700 w-[15%] font-bold">Upload CV:</label>
              <input
                  type="file"
                  onChange={(e) => setCv(e.target.files[0])}
                  required
                  className="p-2 rounded-lg border border-gray-300 text-black"
                />
            </div>
            <button
              type="submit"
              className="w-[10%] ml-40 bg-blue-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Apply
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FormLayout;
