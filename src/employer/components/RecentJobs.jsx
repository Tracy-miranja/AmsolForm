import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import { fmtDate, pad2 } from "../employerUtils";

const RecentJobs = ({ jobs = [], loading }) => {
  const [kebab, setKebab] = useState(null);

  useEffect(() => {
    const close = () => setKebab(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <section className="ed-jobs">
      <h2 className="ed-sec">Recently Posted Jobs</h2>

      {loading ? (
        <div className="ed-empty">Loading…</div>
      ) : jobs.length === 0 ? (
        <div className="ed-job ed-job-empty">
          <div>
            <p>You haven&apos;t posted a job yet.</p>
            <Link to="/employer/post-job" className="ed-post">Post your first job</Link>
          </div>
        </div>
      ) : jobs.slice(0, 5).map((j) => (
        <article key={j.id} className="ed-job">
          <div>
            <h3><i className={String(j.status).toLowerCase() === "open" ? "" : "closed"} /> {j.title}</h3>
            <p>{j.place}</p>
            <p>Created on: {fmtDate(j.created)} &nbsp; Expires: {j.expires ? fmtDate(j.expires) : "—"}</p>
          </div>

          <div className="ed-nums">
            {[["Applicants", j.applicants], ["New", j.fresh], ["Reviewed", j.reviewed], ["Rejected", j.rejected], ["Hired", j.hired]].map(([l, v]) => (
              <div key={l}><span>{l}</span><b>{pad2(v)}</b></div>
            ))}
          </div>

          <div className="ed-jact">
            <Link to={`/employer/jobs/${j.id}/applicants`} className="ed-view">View Applicants</Link>
            <button className="ed-kb" aria-label="More actions"
              onClick={(e) => { e.stopPropagation(); setKebab(kebab === j.id ? null : j.id); }}>
              <FaEllipsisV />
            </button>
            {kebab === j.id && (
              <div className="ed-pop" onClick={(e) => e.stopPropagation()}>
                <Link to={`/jobs/${j.id}`}>View job</Link>
                <Link to={`/employer/jobs/${j.id}/edit`}>Edit</Link>
              </div>
            )}
          </div>
        </article>
      ))}

      {jobs.length > 5 && (
        <div style={{ textAlign: "center" }}><Link to="/employer/jobs" className="ed-view">See all job posts</Link></div>
      )}
    </section>
  );
};

export default RecentJobs;