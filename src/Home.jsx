import { useState } from "react";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      firstName,
      lastName,
      gender,
      location,
      academic,
      workExperience: { company1, company2, company3 },
      salaryInfo,
      cv,
    });
  };

  return (
    <div className="conta bg-red-600 flex  h-screen">
      <form onSubmit={handleSubmit} className="bg-blue-600 flex flex-col gap-2 w-[50%] p-6">
        <div className="flex flex-col">
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className=" border rounded"
          />
        </div>

        <div className="flex flex-col">
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
            className=" border rounded"
          />
        </div>

        <div className="flex flex-col">
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className=" border rounded"
          />
        </div>

        <div className="flex flex-col">
          <label>Academic Qualification:</label>
          <select
            value={academic}
            onChange={(e) => setAcademic(e.target.value)}
            required
            className=" border rounded"
          >
            <option value="">Select your qualification</option>
            <option value="Masters">Masters</option>
            <option value="Degree">Degree</option>
            <option value="Diploma">Diploma</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label>Work Experience (Company 1):</label>
          <input
            type="text"
            value={company1}
            onChange={(e) => setCompany1(e.target.value)}
            required
            className=" border rounded"
          />
        </div>

        <div className="flex flex-col">
          <label>Work Experience (Company 2):</label>
          <input
            type="text"
            value={company2}
            onChange={(e) => setCompany2(e.target.value)}
            className=" border rounded"
          />
        </div>

        <div className="flex flex-col">
          <label>Work Experience (Company 3):</label>
          <input
            type="text"
            value={company3}
            onChange={(e) => setCompany3(e.target.value)}
            className=" border rounded"
          />
        </div>

        <div className="flex flex-col">
          <label>Salary Info:</label>
          <input
            type="number"
            value={salaryInfo}
            onChange={(e) => setSalaryInfo(e.target.value)}
            required
            className=" border rounded"
          />
        </div>

        <div className="flex flex-col">
          <label>CV Upload:</label>
          <input
            type="file"
            onChange={(e) => setCv(e.target.files[0])}
            required
            className=" border rounded"
          />
        </div>

        <button type="submit" className="bg-blue-800 text-white  rounded-lg">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Home;
