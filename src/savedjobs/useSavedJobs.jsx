// hooks/useSavedJobs.js
import { useState, useEffect, useCallback } from "react";

const API = "https://amsol-api-production.up.railway.app";

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
      setSavedJobIds(new Set((data.savedJobs || []).map(j => j._id)));
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
    const isSaved = savedJobIds.has(job._id);
    const method = isSaved ? "DELETE" : "POST";

    // Optimistic update
    setSavedJobIds(prev => {
      const next = new Set(prev);
      isSaved ? next.delete(job._id) : next.add(job._id);
      return next;
    });
    setSavedJobs(prev =>
      isSaved ? prev.filter(j => j._id !== job._id) : [...prev, job]
    );

    try {
      await fetch(`${API}/api/users/${userId}/saved-jobs/${job._id}`, {
        method,
        headers,
        credentials: "include",
      });
    } catch (err) {
      // Rollback on failure
      console.error("Toggle save failed:", err);
      fetchSavedJobs();
    }
  }, [savedJobIds, userId]);

  return { savedJobIds, savedJobs, loading, toggleSave, refetch: fetchSavedJobs };
};