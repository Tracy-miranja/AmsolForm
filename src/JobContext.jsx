import { createContext, useEffect, useState } from "react";

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("https://hrsystem.amsol.africa/api/jobs/openings");
        if (!response.ok) throw new Error(`Failed to fetch jobs: ${response.statusText}`);

        const data = await response.json();
        setJobs(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (jobs.length === 0) { 
      fetchJobs();
    }
  }, []); 

  return (
    <JobContext.Provider value={{ jobs, loading, error }}>
      {children}
    </JobContext.Provider>
  );
};
