import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import { normJob } from "./employerUtils";

const EMPTY = { stats: {}, jobs: [], interviews: [] };

export default function useEmployerDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const { data: d } = await api.get("/api/employer/dashboard");
        if (off) return;
        const jobs = (d.jobs || []).map(normJob);
        const isOpen = (j) => String(j.status).toLowerCase() === "open";
        setData({
          jobs,
          interviews: d.interviews || [],
          stats: {
            activeJobs: d.stats?.activeJobs ?? jobs.filter(isOpen).length,
            newApplicants: d.stats?.newApplicants ?? jobs.reduce((s, j) => s + j.fresh, 0),
            shortlistedReviewed: d.stats?.shortlistedReviewed ?? jobs.reduce((s, j) => s + j.reviewed, 0),
            candidatesShortlisted: d.stats?.candidatesShortlisted ?? 0,
          },
        });
      } catch (e) {
        if (e.response?.status === 401) { navigate("/auth", { replace: true }); return; }
        if (!off) setError(e.response?.data?.message || "Could not load your dashboard.");
      } finally {
        if (!off) setLoading(false);
      }
    })();
    return () => { off = true; };
  }, [navigate]);

  return { ...data, loading, error };
}