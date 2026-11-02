import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../api/axiosInstance";
import { fmtDate, fmtTime } from "./employerUtils";

const Interviews = () => {
  const [items, setItems] = useState(null);
  const [tab, setTab] = useState("upcoming");

  const load = () => api.get("/api/employer/applicants").then(({ data }) => setItems(data.items)).catch(() => { setItems([]); toast.error("Could not load interviews."); });
  useEffect(() => { load(); }, []);

  const rows = (items || [])
    .flatMap((it) => it.interviews.map((iv) => ({ ...iv, itemId: it.id, name: it.candidate.name, jobTitle: it.jobTitle })))
    .filter((r) => (tab === "upcoming" ? r.status === "scheduled" : r.status !== "scheduled"))
    .sort((a, b) => (tab === "upcoming" ? new Date(a.dateTime) - new Date(b.dateTime) : new Date(b.dateTime) - new Date(a.dateTime)));

  const setStatus = async (r, status) => {
    try { await api.patch(`/api/employer/applicants/${r.itemId}/interviews/${r.id}`, { status }); load(); }
    catch (e) { toast.error(e.response?.data?.message || "Could not update the interview."); }
  };

  return (
    <>
      <div className="ep-head"><div><h2>Interviews</h2><p>Schedule interviews from an applicant's profile. They appear here.</p></div></div>
      <div className="ep-tabs">
        {[["upcoming", "Upcoming"], ["done", "Completed / cancelled"]].map(([k, l]) => (
          <button key={k} className={`ed-tab ${tab === k ? "on" : ""}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {items === null && <div className="ed-empty">Loading…</div>}
      {items && rows.length === 0 && <div className="ep-card ep-center"><p className="ep-sub">No {tab === "upcoming" ? "upcoming" : "past"} interviews.</p></div>}

      {rows.map((r) => (
        <article key={r.id} className="ep-row">
          <div><h3 className="ep-title">{r.name}</h3><p className="ep-sub">{r.title || r.jobTitle}</p></div>
          <div><b>{fmtDate(r.dateTime)}, {fmtTime(r.dateTime)}</b><p className="ep-sub">{r.duration} min · {r.type}{r.meetingUrl ? " · online" : ""}</p></div>
          {r.status === "scheduled" ? (
            <div className="ep-actions">
              <button className="ep-btn sm ghost" onClick={() => setStatus(r, "completed")}>Mark completed</button>
              <button className="ep-btn sm ghost" onClick={() => setStatus(r, "cancelled")}>Cancel</button>
            </div>
          ) : <span className={`ep-chip ${r.status === "completed" ? "ok" : "bad"}`}>{r.status}</span>}
        </article>
      ))}
    </>
  );
};

export default Interviews;