// hooks/useSavedJobs.js
import { useState, useEffect, useCallback } from "react";

const API = "http://localhost:5001";

export const useSavedJobs = (userId, token) => {
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Fetch saved jobs on mount
  const fetchSavedJobs = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/users/${userId}/saved-jobs`, {
        headers,
        credentials: "include",
      });
      const data = await res.json();
      setSavedJobs(data.savedJobs || []);
      setSavedJobIds(new Set((data.savedJobs || []).map(j => j._id || j.id)));
    } catch (err) {
      console.error("Failed to fetch saved jobs:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  // Toggle save/unsave
const toggleSave = useCallback(async (job) => {
  const jobId = job._id || job.id; // ← handle both _id and id
  const isSaved = savedJobIds.has(jobId);
  const method = isSaved ? "DELETE" : "POST";

  // Optimistic update
  setSavedJobIds(prev => {
    const next = new Set(prev);
    isSaved ? next.delete(jobId) : next.add(jobId);
    return next;
  });
  setSavedJobs(prev =>
    isSaved ? prev.filter(j => (j._id || j.id) !== jobId) : [...prev, { ...job, _id: jobId }]
  );

  try {
    await fetch(`${API}/api/users/${userId}/saved-jobs/${jobId}`, {
      method,
      headers,
      credentials: "include",
      body: method === "POST" ? JSON.stringify(job) : undefined,
    });
  } catch (err) {
    console.error("Toggle save failed:", err);
    fetchSavedJobs();
  }
}, [savedJobIds, userId, fetchSavedJobs]);

  return { savedJobIds, savedJobs, loading, toggleSave, refetch: fetchSavedJobs };
};