import { useState } from "react";
import logo from "./assets/amsolJobVacancies.png";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import axios from "axios";
import arrow from "./assets/Vector1.svg";
import HandleLogout from "./logout";
import { useNavigate } from "react-router-dom";
import { useUser } from "./Context/UserContext";

const TermsModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
      <div className="flex items-center justify-between p-5 border-b">
        <div>
          <h2 className="text-xl font-bold text-gray-800">TERMS AND CONDITIONS</h2>
          <p className="text-sm text-gray-500 mt-1">Effective Date: January 1, 2011</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none">&times;</button>
      </div>
      <div className="overflow-y-auto p-5 text-sm text-gray-700 space-y-4">
        <section>
          <h3 className="font-bold text-gray-900 mb-1">1. Introduction</h3>
          <p>Welcome to the website of Africa Management Solutions Limited (AMSOL). These terms and conditions govern your access to and use of the AMSOL website located at https://www.amsol.africa (the "website").</p>
          <p className="mt-2">By accessing or using this website, you agree to comply with and be bound by these terms and conditions. If you do not agree with these terms, you should discontinue using the website immediately.</p>
          <p className="mt-2">AMSOL provides professional services including human resource consulting, recruitment services, payroll outsourcing, and business advisory services to organizations across Africa.</p>
        </section>
        <section>
          <h3 className="font-bold text-gray-900 mb-1">2. Definitions</h3>
          <p>For the purposes of these terms:</p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>"Company", "AMSOL", "we", "us", or "our" refers to Africa Management Solutions Limited.</li>
            <li>"Website" refers to the official AMSOL website and any associated digital platforms operated by the company.</li>
            <li>"User", "you", or "your" refers to any person accessing or using the website.</li>
            <li>"Services" refers to the consulting, recruitment, HR outsourcing, payroll management, advisory services, and related solutions provided by AMSOL.</li>
          </ul>
        </section>
        <section>
          <h3 className="font-bold text-gray-900 mb-1">3. Acceptance of Terms</h3>
          <p>By accessing the website, submitting information through contact forms, applying for job opportunities, or requesting services, you confirm that you:</p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>Have read and understood these terms</li>
            <li>Agree to comply with them</li>
            <li>Are legally capable of entering into binding agreements</li>
          </ul>
          <p className="mt-2">AMSOL reserves the right to deny access to users who violate these terms.</p>
        </section>
        <section>
          <h3 className="font-bold text-gray-900 mb-1">4. Use of the Website</h3>
          <p>The website is intended to provide information about AMSOL's services and allow users to submit service inquiries, apply for job opportunities, contact the company, and access professional resources.</p>
          <p className="mt-2">Users agree to use the website only for lawful purposes. You must not:</p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>Use the website in any way that violates applicable laws</li>
            <li>Attempt unauthorized access to systems or data</li>
            <li>Introduce malware or harmful code</li>
            <li>Interfere with the website's functionality</li>
            <li>Submit false or misleading information</li>
          </ul>
        </section>
        <section>
          <h3 className="font-bold text-gray-900 mb-1">5. Description of Services</h3>
          <p>AMSOL provides a range of professional services including but not limited to:</p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>Human Resource Consulting</li>
            <li>Recruitment and Talent Acquisition</li>
            <li>Payroll Processing and Outsourcing</li>
            <li>HR Outsourcing Services</li>
            <li>Organizational Development</li>
            <li>Business Consulting</li>
            <li>Corporate and advisory services</li>
          </ul>
          <p className="mt-2">Information provided on the website is for general informational purposes and does not constitute a contractual service agreement unless formally executed between AMSOL and the client.</p>
        </section>
        <section>
          <h3 className="font-bold text-gray-900 mb-1">6. User Responsibilities</h3>
          <p>Users who submit information through the website agree that:</p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li>All information provided is accurate and truthful</li>
            <li>They have the authority to submit the information</li>
            <li>They will not impersonate another individual or organization</li>
          </ul>
          <p className="mt-2">Job applicants must ensure that submitted resumes, personal details, and documents are accurate and lawful.</p>
        </section>
        <section>
          <h3 className="font-bold text-gray-900 mb-1">7. Intellectual Property Rights</h3>
          <p>All content on this website including text, graphics, logos, images, software, design elements, and documents are the property of Africa Management Solutions Limited or its licensors and are protected under applicable intellectual property laws.</p>
          <p className="mt-2">Users may not reproduce, distribute, modify, or commercially exploit website content without prior written consent from AMSOL.</p>
        </section>
        <section>
          <h3 className="font-bold text-gray-900 mb-1">8. Confidentiality</h3>
          <p>Any confidential information exchanged between AMSOL and clients through formal engagement agreements will be handled in accordance with applicable confidentiality obligations. However, information submitted through general website forms may not automatically constitute confidential communication unless specified.</p>
        </section>
        <section>
          <h3 className="font-bold text-gray-900 mb-1">9. Third-Party Links</h3>
          <p>The website may contain links to third-party websites or services. AMSOL does not control or endorse these third-party platforms and is not responsible for their content, privacy practices, security standards, or accuracy of information. Users access such links at their own risk.</p>
        </section>
        <section>
          <h3 className="font-bold text-gray-900 mb-1">10. Limitation of Liability</h3>
          <p>To the fullest extent permitted by law, AMSOL shall not be liable for any indirect, incidental, special, consequential, financial or reputational damages arising from use or inability to use the website, reliance on website information, errors or omissions in content, or temporary unavailability of the website.</p>
        </section>
        <section>
          <h3 className="font-bold text-gray-900 mb-1">11. Disclaimer of Warranties</h3>
          <p>The website is provided "as is" and "as available". AMSOL makes no warranties regarding accuracy of information, continuous availability, freedom from errors or interruptions, or security from cyber threats. AMSOL does not guarantee that website content will always be current or complete.</p>
        </section>
        <section>
          <h3 className="font-bold text-gray-900 mb-1">12. Indemnification</h3>
          <p>Users agree to indemnify and hold harmless AMSOL and its employees, partners, and affiliates against any claims, damages, losses, or liabilities resulting from violation of these terms, misuse of the website, or submission of inaccurate or unlawful information.</p>
        </section>
        <section>
          <h3 className="font-bold text-gray-900 mb-1">13. Governing Law and Jurisdiction</h3>
          <p>These terms shall be governed by and interpreted in accordance with the laws of the Republic of Kenya, unless otherwise required by applicable international regulations. Any disputes arising from the use of this website shall be subject to the jurisdiction of Kenyan courts.</p>
        </section>
        <section>
          <h3 className="font-bold text-gray-900 mb-1">14. Amendments to Terms</h3>
          <p>AMSOL reserves the right to update or modify these terms at any time. Changes will become effective upon publication on this page. Continued use of the website after updates constitutes acceptance of the revised terms.</p>
        </section>
        <section>
          <h3 className="font-bold text-gray-900 mb-1">15. Termination of Use</h3>
          <p>AMSOL reserves the right to restrict or terminate access to the website, remove user submissions, or suspend services if users violate these terms or engage in unlawful activity.</p>
        </section>
        <section>
          <h3 className="font-bold text-gray-900 mb-1">16. Contact Information</h3>
          <p>For questions regarding these terms and conditions, please contact:</p>
          <p className="mt-2">
            <strong>Africa Management Solutions Limited (AMSOL)</strong><br />
            Website: <a href="https://www.amsol.africa" className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noreferrer">https://www.amsol.africa</a><br />
            Email: <a href="mailto:info@amsol.africa" className="text-blue-600 underline hover:text-blue-800">info@amsol.africa</a>
          </p>
        </section>
      </div>
      <div className="p-4 border-t flex justify-end">
        <button onClick={onClose} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold">Close</button>
      </div>
    </div>
  </div>
);

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
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  // Terms state — only addition
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsError, setTermsError] = useState("");

  const navigateToSection = (section) => {
    setActiveSection(section);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      setTermsError("You must accept the Terms & Privacy Policy before submitting.");
      return;
    }

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
        "https://amsol-api-production.up.railway.app/api/nurse-applications",
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
      setAlreadySubmitted(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        setError(
          "You have already submitted an application recently. Please wait at least 1 hour before submitting again."
        );
      } else {
        setError(err.response?.data?.message || "Error submitting form");
      }
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
      {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}

      <div className="w-[100%] h-[20px]  flex items-center justify-around shadow-2xl p-8 text-blue-700 gap-5 overflow-fixed">
        <div className="bg-white rounded-full sm:w-[100px] md:w-[200px] flex items-center justify-center">
          <img
            src={logo}
            alt="hrOutsourcing"
            className="sm:w-[50px] md:w-[110px] p-1"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex flex-row items-center gap-5">
            <Link className="text-blue-700 flex flex-row gap-2" to="/">
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
      

          <div className="w-[100%] h-fit shadow-lg rounded-lg flex flex:col md:flex-row text-blue-500">
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
              <h2 className="font-bold ">2. Qualifications Details</h2>
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
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
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

                {/* ── Terms & Policy Checkbox (only addition) ── */}
                <div className="mb-4 mt-2">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="termsCheckbox"
                      checked={termsAccepted}
                      onChange={(e) => {
                        setTermsAccepted(e.target.checked);
                        if (e.target.checked) setTermsError("");
                      }}
                      className="mt-1 w-4 h-4 cursor-pointer flex-shrink-0"
                    />
                    <label htmlFor="termsCheckbox" className="text-sm text-gray-700 cursor-pointer">
                      I have read and agree to the{" "}
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        Terms &amp; Privacy Policy
                      </button>
                      . I confirm that all information provided is accurate and I consent to AMSOL processing my personal data for recruitment purposes.
                    </label>
                  </div>
                  {termsError && (
                    <p className="mt-1 text-sm text-red-500">{termsError}</p>
                  )}
                </div>
                {/* ── End Terms & Policy Checkbox ── */}

                <div className="flex flex-row justify-center mt-6">
                  <button
                    type="submit"
                    disabled={alreadySubmitted || loading || !termsAccepted}
                    className={`py-2 px-4 rounded font-semibold transition-all duration-200 ${
                      alreadySubmitted || loading || !termsAccepted
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {alreadySubmitted
                      ? "✓ Application Submitted"
                      : loading
                      ? "Submitting..."
                      : "Submit Application"}
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