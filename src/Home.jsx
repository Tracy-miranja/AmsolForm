import { useState } from "react";
import axios from "axios"; 


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
  const [cv, setCv] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
      formData.append("cv", cv); 

      const response = await axios.post("http://localhost:5000/Api/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      
      setMessage(response.data.message);
      setFirstName("")
      setLastName("")
      setGender("")
      setLocation("")
      setAcademic("")
      setCompany1("")
      setCompany2("")
      setCompany3("")
      setSalaryInfo("")
      setCv("")
      setError(""); 
    } catch (err) {
      
      setError(err.response?.data?.message || "Error submitting form");
      setMessage(""); 
    }
  };

  return (
    <div className="conta  flex h-screen p-6 ">
        <div className="bg-white w-[90%] flex flex-row p-4">
        <div className="w-[40%] p-3 blur-sm bg-grey">
            <p>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available. </p>
        </div>
        <div className="w-[50%] ">
      <form onSubmit={handleSubmit} className="  bg-blue-600 rounded-tl-[50px] text-white flex flex-col gap-2 p-4 ">
        <div className="flex flex-col">
          <label>First Name:</label>
          <input
          
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="border rounded"
          />
        </div>

        <div className="flex flex-col ">
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="border rounded"
          />
        </div>

        <div className="flex flex-col">
          <label>Gender:</label>
          <input
            type="text"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className="border rounded"
          />
        </div>

        <div className="flex flex-col ">
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="border rounded"
          />
        </div>

        <div className="flex flex-col ">
          <label>Academic Qualification:</label>
          <select
          
            value={academic}
            onChange={(e) => setAcademic(e.target.value)}
            required
            className="border rounded text-black-500"
          >
            <option value="">Select your qualification</option>
            <option value="Masters" className="border rounded text-black-500">Masters</option>
            <option value="Degree">Degree</option>
            <option value="Diploma">Diploma</option>
          </select>
        </div>

        <div className="flex flex-col ">
          <label>Work Experience (Company 1):</label>
          <input
            type="text"
            value={company1}
            onChange={(e) => setCompany1(e.target.value)}
            required
            className="border rounded"
          />
        </div>

        <div className="flex flex-col ">
          <label>Work Experience (Company 2):</label>
          <input
            type="text"
            value={company2}
            onChange={(e) => setCompany2(e.target.value)}
            className="border rounded"
          />
        </div>

        <div className="flex flex-col ">
          <label>Work Experience (Company 3):</label>
          <input
            type="text"
            value={company3}
            onChange={(e) => setCompany3(e.target.value)}
            className="border rounded"
          />
        </div>

        <div className="flex flex-col ">
          <label>Salary Info:</label>
          <input
            type="number"
            value={salaryInfo}
            onChange={(e) => setSalaryInfo(e.target.value)}
            required
            className="border rounded"
          />
        </div>

        <div className="flex flex-col ">
          <label>CV Upload:</label>
          <input
            type="file"
            onChange={(e) => setCv(e.target.files[0])}
            required
            className="border rounded"
          />
        </div>

        <button type="submit" className="bg-blue-800 text-white rounded-lg">
          Submit
        </button>
        <p>{message}</p>
        <p>{error}</p>
      </form>
      </div>
      </div>
    </div>
  );
};

export default Home;
