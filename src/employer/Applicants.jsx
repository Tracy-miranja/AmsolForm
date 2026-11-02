import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "../../api/axiosInstance";
import ApplicantDrawer from "./components/ApplicantDrawer";
import { STAGE_LABEL, kes, startCheckout } from "./employerShared";
import { initials } from "./employerUtils";

const TABS = [["", "All"], ["applied", "New"], ["shortlisted", "Shortlisted"], ["interview", "Interview"], ["offer", "Offer"], ["hired", "Hired"], ["rejected", "Rejected"]];

const Applicants = () => {
  const [params, setParams] = useSearchParams();
  const job = params.get("job") || "";
  const [jobs, setJobs] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState("");
  const [openId, setOpenId] = useState(null);
  const [price, setPrice] = useState(0);

  const load = useCallback(() => {
    setLoading(true);
    api.get("/api/employer/applicants", { params: job ? { jobId: job } : {} })
      .then(({ data }) => setItems(data.items))
      .catch(() => toast.error("Could not load applicants."))
      .finally(() => setLoading(false));
  }, [job]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    api.get("/api/employer/jobs").then(({ data }) => setJobs(data)).catch(() => {});
    api.get("/api/employer/pricing").then(({ data }) => setPrice(data.unlockPrice)).catch(() => {});
  }, []);

  const shown = items.filter((i) => !stage || i.stage === stage);
  const lockedIds = [...new Set(shown.filter((i) => i.candidate.locked).map((i) => i.candidate.id))];
  const open = items.find((i) => i.id === openId);
  const replace = (next) => setItems((list) => list.map((i) => (i.id === next.id ? next : i)));

  return (
    <>
      <div className="ep-head">
        <div><h2>Applicants</h2><p>People who applied to your jobs and candidates you added from Find Talent. Unlock a candidate to see their details, then screen and interview with AI.</p></div>
        <select className="ep-in" style={{ width: 240 }} value={job} onChange={(e) => setParams(e.target.value ? { job: e.target.value } : {})}>
          <option value="">All jobs</option>
          <option value="none">Talent pool (no job)</option>
          {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
      </div>

      <div className="ep-tabs">
        {TABS.map(([k, l]) => (
          <button key={k} className={`ed-tab ${stage === k ? "on" : ""}`} onClick={() => setStage(k)}>
            {l} {k ? items.filter((i) => i.stage === k).length : items.length}
          </button>
        ))}
      </div>

      {lockedIds.length > 0 && (
        <div className="ep-bar-top">
          <span>{lockedIds.length} locked candidate{lockedIds.length === 1 ? "" : "s"} in this view</span>
          <button className="ep-btn amber" onClick={() => startCheckout(lockedIds)}>Unlock all · {kes(lockedIds.length * price)}</button>
        </div>
      )}

      {loading && <div className="ed-empty">Loading…</div>}
      {!loading && shown.length === 0 && <div className="ep-card ep-center"><p className="ep-sub">No applicants here yet.</p></div>}

      {shown.map((i) => {
        const c = i.candidate;
        const [label, tone] = STAGE_LABEL[i.stage] || ["", ""];
        return (
          <article key={i.id} className="ep-row" onClick={() => setOpenId(i.id)}>
            <div className="ep-who">
              <span className="ep-av">{c.locked ? <FaLock /> : initials(c.name)}</span>
              <div><b>{c.locked ? c.label : c.name}</b><small>{c.headline} · {i.jobTitle}</small></div>
            </div>
            <div className="ep-chips">
              <span className="ep-chip info">{i.matchScore}% match</span>
              <span className={`ep-chip ${tone}`}>{label}</span>
              {i.screening && <span className={`ep-chip ${i.screening.verdict === "Strong match" ? "ok" : i.screening.verdict === "Weak match" ? "bad" : "warn"}`}>{i.screening.verdict}</span>}
              {c.locked && <span className="ep-chip warn">Locked</span>}
            </div>
            <button className="ep-btn sm ghost">Open</button>
          </article>
        );
      })}

      {open && <ApplicantDrawer item={open} price={price} onClose={() => setOpenId(null)} onItem={replace} />}
    </>
  );
};

export default Applicants;