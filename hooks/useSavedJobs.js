// hooks/useSavedJobs.js
import { useState, useEffect, useCallback } from "react";
import api from "../api/axiosInstance";

export const useSavedJobs = (userId, token) => {
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [savedJobs, setSavedJobs]     = useState([]);
  const [loadingSaved, setLoading]    = useState(false);

  // ─── Fetch saved jobs ──────────────────────────────────────────────────────
  const fetchSavedJobs = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/api/users/${userId}/saved-jobs`);
      const jobs = data.savedJobs || [];
      setSavedJobs(jobs);
      setSavedJobIds(new Set(jobs.map(j => String(j._id ?? j.id))));
    } catch (err) {
      // 401 here means token expired — axiosInstance will redirect to /auth automatically
      console.error("fetchSavedJobs:", err.response?.status, err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchSavedJobs();
  }, [userId, fetchSavedJobs]);

  // ─── Toggle save / unsave ──────────────────────────────────────────────────
  const toggleSave = useCallback(async (job) => {
    const jobId   = String(job._id ?? job.id);
    const isSaved = savedJobIds.has(jobId);

    // Optimistic update — update UI immediately before server responds
    setSavedJobIds(prev => {
      const next = new Set(prev);
      isSaved ? next.delete(jobId) : next.add(jobId);
      return next;
    });
    setSavedJobs(prev =>
      isSaved
        ? prev.filter(j => String(j._id ?? j.id) !== jobId)
        : [...prev, { ...job, _id: jobId }]
    );

    try {
      if (isSaved) {
        await api.delete(`/api/users/${userId}/saved-jobs/${jobId}`);
      } else {
        await api.post(`/api/users/${userId}/saved-jobs/${jobId}`, {
          title:       job.title       || "",
          location:    job.location    || "",
          description: job.description || "",
        });
      }
    } catch (err) {
      console.error("toggleSave:", err.response?.status, err.message);
      // Roll back the optimistic update if server rejected it
      fetchSavedJobs();
    }
  }, [savedJobIds, userId, fetchSavedJobs]);

  return {
    savedJobIds,
    savedJobs,
    loadingSaved,
    loading: loadingSaved,  
    toggleSave,
    refetch: fetchSavedJobs,
  };
};