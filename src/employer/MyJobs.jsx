import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../api/axiosInstance";
import { fmtDate, pad2 } from "./employerUtils";

const CHIP = { open: "ok", draft: "warn", closed: "bad" };

const MyJobs = () => {
  const [jobs, setJobs] = useState(null);
  const load = () => api.get("/api/employer/jobs").then(({ data }) => setJobs(data)).catch(() => { setJobs([]); toast.error("Could not load your jobs."); });
  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    try { await api.patch(`/api/employer/jobs/${id}/status`, { status }); toast.success(`Job ${status === "open" ? "published" : "closed"}.`); load(); }
    catch (e) { toast.error(e.response?.data?.message || "Could not update the job."); }
  };

  return (
    <>
      <div className="ep-head">
        <div><h2>My job posts</h2><p>Everything you have posted, with live applicant counts.</p></div>
        <Link to="/employer/post-job" className="ep-btn amber">Post a job</Link>
      </div>

      {jobs === null && <div className="ed-empty">Loading…</div>}
      {jobs?.length === 0 && (
        <div className="ep-card ep-center"><p className="ep-sub">You haven't posted a job yet.</p><Link to="/employer/post-job" className="ep-btn amber">Post your first job</Link></div>
      )}

      {jobs?.map((j) => (
        <article key={j.id} className="ep-row">
          <div>
            <h3 className="ep-title">{j.title} <span className={`ep-chip ${CHIP[j.status]}`}>{j.status}</span></h3>
            <p className="ep-sub">{j.place || "Location not set"} · Posted {fmtDate(j.createdAt)}{j.closingDate ? ` · Closes ${fmtDate(j.closingDate)}` : ""}</p>
          </div>
          <div className="ep-stats">
            <span><b>{pad2(j.counts.applicants)}</b>Applicants</span>
            <span><b>{pad2(j.counts.new)}</b>New</span>
            <span><b>{pad2(j.counts.hired)}</b>Hired</span>
          </div>
          <div className="ep-actions">
            <Link className="ep-btn sm" to={`/employer/applicants?job=${j.id}`}>Applicants</Link>
            <Link className="ep-btn sm amber" to={`/employer/find-talent?job=${j.id}`}>Find matches</Link>
            <Link className="ep-btn sm ghost" to={`/employer/jobs/${j.id}/edit`}>Edit</Link>
            {j.status === "open"
              ? <button className="ep-btn sm ghost" onClick={() => setStatus(j.id, "closed")}>Close</button>
              : <button className="ep-btn sm ghost" onClick={() => setStatus(j.id, "open")}>{j.status === "draft" ? "Publish" : "Reopen"}</button>}
          </div>
        </article>
      ))}
    </>
  );
};

export default MyJobs;