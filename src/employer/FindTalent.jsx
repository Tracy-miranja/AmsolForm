import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../api/axiosInstance";
import CandidateCard from "./components/CandidateCard";
import { kes, startCheckout } from "./employerShared";

const FindTalent = () => {
  const [params] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState(params.get("job") || "");
  const [jd, setJd] = useState("");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState(null);
  const [picked, setPicked] = useState(new Set());

  const run = async (opts = {}) => {
    const body = { jdText: opts.jdText ?? jd, jobId: opts.jobId ?? jobId };
    setBusy(true);
    try {
      const { data } = await api.post("/api/employer/match", body);
      setRes(data); setPicked(new Set());
      if (!data.total) toast("No close matches yet. Try a fuller description.");
    } catch (e) {
      toast.error(e.response?.data?.message || "The search failed.");
    } finally { setBusy(false); }
  };

  useEffect(() => {
    api.get("/api/employer/jobs").then(({ data }) => setJobs(data.filter((j) => j.status !== "draft"))).catch(() => {});
    const sid = params.get("search");
    if (sid) {
      setBusy(true);
      api.get(`/api/employer/searches/${sid}`).then(({ data }) => setRes(data)).catch(() => toast.error("Could not load that search.")).finally(() => setBusy(false));
    } else if (params.get("job")) {
      run({ jobId: params.get("job"), jdText: "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id) => setPicked((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const locked = res?.candidates.filter((c) => c.locked) || [];

  const unlock = async () => { await startCheckout([...picked], res.searchId); };

  const add = async (c, jid) => {
    try {
      await api.post("/api/employer/pipeline", { profileId: c.id, jobId: jid || res.jobId || "", searchId: res.searchId, matchScore: c.score });
      toast.success("Added to Applicants.");
    } catch (e) { toast.error(e.response?.data?.message || "Could not add the candidate."); }
  };

  return (
    <>
      <div className="ep-head">
        <div>
          <h2>Find talent</h2>
          <p>Paste or write a job description. AI scans our candidate database and ranks people by how well they match. Pay only for the candidates you want to contact.</p>
        </div>
      </div>

      <div className="ep-card">
        <label className="ep-field">Use one of your posted jobs
          <select className="ep-in" value={jobId} onChange={(e) => setJobId(e.target.value)}>
            <option value="">None: I'll paste a job description</option>
            {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
        </label>
        {!jobId && (
          <label className="ep-field" style={{ marginTop: 14 }}>Job description
            <textarea className="ep-in" rows={8} value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste the full job description, or write what you're looking for…" />
          </label>
        )}
        <div className="ep-actions" style={{ marginTop: 14 }}>
          <button className="ep-btn amber" disabled={busy} onClick={() => run()}>{busy ? "Matching…" : "Find matching candidates"}</button>
        </div>
      </div>

      {res && (
        <>
          <div className="ep-bar-top">
            <div>
              <b>{res.total} candidate{res.total === 1 ? "" : "s"}</b> matched “{res.title}” · {kes(res.unlockPrice)} to unlock each
              {res.criteria?.skills?.length > 0 && <div className="ep-chips" style={{ marginTop: 8 }}>{res.criteria.skills.slice(0, 10).map((s) => <span key={s} className="ep-chip">{s}</span>)}</div>}
            </div>
            {locked.length > 0 && (
              <div className="ep-actions">
                <button className="ep-btn sm ghost" onClick={() => setPicked(new Set(locked.slice(0, 10).map((c) => c.id)))}>Select top 10</button>
                <button className="ep-btn amber" disabled={!picked.size} onClick={unlock}>
                  {picked.size ? `Unlock ${picked.size} · ${kes(picked.size * res.unlockPrice)}` : "Select candidates to unlock"}
                </button>
              </div>
            )}
          </div>

          {res.candidates.map((c) => (
            <CandidateCard key={c.id} c={c} picked={picked.has(c.id)} onPick={toggle} jobs={jobs} defaultJobId={res.jobId} onAdd={add} />
          ))}
        </>
      )}
    </>
  );
};

export default FindTalent;