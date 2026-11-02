import React, { useState } from "react";
import { FaLock, FaCheckCircle } from "react-icons/fa";
import CandidateProfile from "./CandidateProfile";

const CandidateCard = ({ c, picked, onPick, jobs, defaultJobId, onAdd }) => {
  const [open, setOpen] = useState(false);
  const [jobId, setJobId] = useState(defaultJobId || "");

  return (
    <article className={`ep-cand ${picked ? "picked" : ""}`}>
      {c.locked
        ? <input type="checkbox" checked={picked} onChange={() => onPick(c.id)} aria-label={`Select ${c.label}`} />
        : <FaCheckCircle className="ep-ok" title="Unlocked" />}

      <div className="ep-score" style={{ "--p": c.score }}><b>{c.score}%</b></div>

      <div className="ep-cand-main">
        <h3>{c.locked ? <><FaLock /> {c.label}</> : c.name}</h3>
        <p>
          {c.headline} · {c.years ? `${c.years} yrs experience` : "experience not stated"}
          {c.education ? ` · ${c.education}` : ""}{c.location ? ` · ${c.location}` : ""}
        </p>
        {c.reason && <p className="ep-reason">AI: {c.reason}</p>}
        <div className="ep-chips">{(c.skills || []).map((s) => <span key={s} className="ep-chip info">{s}</span>)}</div>
        {c.locked && <p className="ep-blur" aria-hidden="true">Jane Doe · name@email.com · +254 700 000 000</p>}
      </div>

      <div className="ep-cand-act">
        {c.locked ? (
          <span className="ep-chip warn">Locked</span>
        ) : (
          <>
            <select className="ep-in" value={jobId} onChange={(e) => setJobId(e.target.value)} aria-label="Add to job">
              <option value="">Talent pool (no job)</option>
              {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>
            <button className="ep-btn sm" onClick={() => onAdd(c, jobId)}>Add to applicants</button>
            <button className="ep-btn sm ghost" onClick={() => setOpen((o) => !o)}>{open ? "Hide details" : "Details"}</button>
          </>
        )}
      </div>

      {open && !c.locked && <div className="ep-cand-detail"><CandidateProfile c={c} /></div>}
    </article>
  );
};

export default CandidateCard;