import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../api/axiosInstance";

const BLANK = {
  title: "", place: "", employmentType: "full-time", workMode: "on-site", salaryRange: "",
  numberOfPositions: 1, closingDate: "", description: "", requirements: "",
};

const PostJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [f, setF] = useState(BLANK);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  useEffect(() => {
    if (!id) return;
    api.get(`/api/employer/jobs/${id}`)
      .then(({ data }) => setF({ ...BLANK, ...data, closingDate: data.closingDate ? data.closingDate.slice(0, 10) : "" }))
      .catch(() => toast.error("Could not load this job."));
  }, [id]);

  const save = async (status) => {
    if (!f.title.trim() || f.description.trim().length < 50) {
      return toast.error("Add a job title and a description of at least 50 characters.");
    }
    setBusy(true);
    try {
      const body = { ...f, status, numberOfPositions: Number(f.numberOfPositions) || 1, closingDate: f.closingDate || null };
      const { data } = id ? await api.put(`/api/employer/jobs/${id}`, body) : await api.post("/api/employer/jobs", body);
      setDone(data);
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not save the job.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="ep-card ep-center">
        <h2 className="ed-sec">{done.status === "open" ? "Your job is live" : "Draft saved"}</h2>
        <p className="ep-sub">
          {done.status === "open"
            ? "Candidates can now apply. You can also have AI find matching candidates in our database right away."
            : "Publish it from My Job Posts when you're ready."}
        </p>
        <div className="ep-actions ep-center">
          <button className="ep-btn amber" onClick={() => navigate(`/employer/find-talent?job=${done.id}`)}>Find matching candidates</button>
          <Link className="ep-btn ghost" to="/employer/jobs">View my job posts</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="ep-head">
        <div>
          <h2>{id ? "Edit job" : "Post a job"}</h2>
          <p>Describe the role. Our AI reads it to score every applicant and to find matching candidates in our database.</p>
        </div>
      </div>

      <div className="ep-card">
        <div className="ep-grid2">
          <label className="ep-field">Job title *<input className="ep-in" value={f.title} onChange={set("title")} placeholder="e.g. Senior Accountant" /></label>
          <label className="ep-field">Location<input className="ep-in" value={f.place} onChange={set("place")} placeholder="e.g. Nairobi, Kenya" /></label>
          <label className="ep-field">Employment type
            <select className="ep-in" value={f.employmentType} onChange={set("employmentType")}>
              <option value="full-time">Full-time</option><option value="part-time">Part-time</option>
              <option value="contract">Contract</option><option value="internship">Internship</option>
            </select>
          </label>
          <label className="ep-field">Work arrangement
            <select className="ep-in" value={f.workMode} onChange={set("workMode")}>
              <option value="on-site">On-site</option><option value="hybrid">Hybrid</option><option value="remote">Remote</option>
            </select>
          </label>
          <label className="ep-field">Salary range<input className="ep-in" value={f.salaryRange} onChange={set("salaryRange")} placeholder="e.g. KES 80,000 – 120,000 or Competitive" /></label>
          <label className="ep-field">Number of positions<input className="ep-in" type="number" min="1" value={f.numberOfPositions} onChange={set("numberOfPositions")} /></label>
          <label className="ep-field">Closing date<input className="ep-in" type="date" value={f.closingDate} onChange={set("closingDate")} /></label>
        </div>
      </div>

      <div className="ep-card">
        <label className="ep-field">Job description * <small>(at least 50 characters)</small>
          <textarea className="ep-in" rows={9} value={f.description} onChange={set("description")} placeholder="What will this person do? What does success look like?" />
        </label>
        <label className="ep-field" style={{ marginTop: 14 }}>Requirements
          <textarea className="ep-in" rows={6} value={f.requirements} onChange={set("requirements")} placeholder="Qualifications, years of experience, skills and tools…" />
        </label>
      </div>

      <div className="ep-actions">
        <button className="ep-btn amber" disabled={busy} onClick={() => save("open")}>{busy ? "Saving…" : id ? "Save and publish" : "Publish job"}</button>
        <button className="ep-btn ghost" disabled={busy} onClick={() => save("draft")}>Save as draft</button>
      </div>
    </>
  );
};

export default PostJob;