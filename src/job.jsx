import React, { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const carouselSlides = [
  {
    title: "Find Your Dream Job",
    subtitle: "Discover opportunities that match your skills and passion.",
    image: "https://via.placeholder.com/1500x500?text=Find+Your+Dream+Job",
  },
  {
    title: "Join Top Companies",
    subtitle: "Work with world-class organizations.",
    image: "https://via.placeholder.com/1500x500?text=Join+Top+Companies",
  },
  {
    title: "Start Your Journey Today",
    subtitle: "Browse jobs and take the first step toward your career goals.",
    image: "https://via.placeholder.com/1500x500?text=Start+Your+Journey+Today",
  },
];

const JobPage = () => {
  const [jobs, setJobs] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const fetchJobs = () => {
    const apiUrl = "http://localhost:5000/api/jobs";
  
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        return response.json();
      })
      .then((data) => {
        setJobs(data.jobs || []); 
      })
      .catch((error) => console.error("Error fetching jobs:", error));
  };
  
  const handleSearch = () => {
    let filteredJobs = jobs;
    if (category) {
      filteredJobs = filteredJobs.filter((job) => job.category === category);
    }

    if (location) {
      filteredJobs = filteredJobs.filter((job) =>
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    setJobs(filteredJobs);
  };

  useEffect(() => {
    console.log(fetchJobs()); 
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselSlides.length);
    }, 5000); 
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-blue-500 p-3">
        <Link to="/" className="text-white flex items-center gap-2">
          <FaHome /> Home
        </Link>
      </div>

      {/* Banner with Carousel */}
      <header className="relative w-full h-80 overflow-hidden">
        {carouselSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white p-4">
              <h1 className="text-4xl font-bold">{slide.title}</h1>
              <p className="mt-2 text-lg">{slide.subtitle}</p>
            </div>
          </div>
        ))}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? "bg-white" : "bg-gray-400"
              }`}
              onClick={() => setCurrentSlide(index)}
            ></button>
          ))}
        </div>
      </header>

      {/* Job Filter and Search */}
      <main className="flex-grow bg-gray-100 py-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-6">
            Available Jobs
          </h2>
          <div className="flex justify-center py-4">
            <div className="container mx-auto px-4 flex flex-col md:flex-row gap-4 items-center justify-center">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2"
              >
                <option value="">All Categories</option>
                <option value="IT">IT</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                {/* Add more categories */}
              </select>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search by location"
                className="border border-gray-300 rounded px-4 py-2"
              />

              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white shadow-md rounded-2xl overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-blue-600">
                      {job.title}
                    </h3>
                    <p className="text-gray-700 mt-2">{job.company}</p>
                    <p className="text-gray-600 text-sm mt-1">{job.location}</p>
                    
                    <p className="text-gray-500 mt-4">
                      {job.description.slice(0, 1000)}...
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                      Salary: {job.salary || "Negotiable"}
                    </p>
                  <div className="bg-blue-50 p-4 text-center mb-0">
                    <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">
                No job posts available at the moment.
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-500 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Job Portal. All Rights Reserved.</p>
          <p>Powered by Amsol The Staffing & HR Solutions specialists</p>
        </div>
      </footer>
    </div>
  );
};

export default JobPage;
