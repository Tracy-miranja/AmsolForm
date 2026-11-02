import React, { useState } from "react";
import { FaLock, FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "../../../api/axiosInstance";
import CandidateProfile from "./CandidateProfile";
import ScreeningPanel from "./ScreeningPanel";
import ScheduleInterviewModal from "./ScheduleInterviewModal";
import { STAGE_LABEL, kes, startCheckout } from "../employerShared";
import { fmtDate, fmtTime } from "../employerUtils";

const NEXT = {
  applied: [["shortlisted", "Shortlist"], ["rejected", "Reject"]],
  shortlisted: [["rejected", "Reject"]],
  interview: [["offer", "Make offer"], ["rejected", "Reject"]],
  offer: [["hired", "Mark hired"], ["rejected", "Reject"]],
  hired: [],
  rejected: [["applied", "Reopen"]],
};

const ApplicantDrawer = ({ item, price, onClose, onItem }) => {
  const [busy, setBusy] = useState("");
  const [sched, setSched] = useState(false);
  const c = item.candidate;
  const [label, tone] = STAGE_LABEL[item.stage] || ["", ""];

  const act = async (key, fn) => {
    setBusy(key);
    try { onItem((await fn()).data); }
    catch (e) { toast.error(e.response?.data?.message || "Something went wrong."); }
    finally { setBusy(""); }
  };
  const setStage = (stage) => act(stage, () => api.patch(`/api/employer/applicants/${item.id}/stage`, { stage }));
  const screen = () => act("screen", () => api.post(`/api/employer/applicants/${item.id}/screen`));
  const setIv = (ivId, status) => act(ivId, () => api.patch(`/api/employer/applicants/${item.id}/interviews/${ivId}`, { status }));

  return (
    <>
      <div className="ep-over" onClick={onClose} />
      <aside className="ep-drawer">
        <header>
          <div>
            <h3>{c.locked ? c.label : c.name}</h3>
            <p>{c.headline} · {item.jobTitle}</p>
            <div className="ep-chips"><span className="ep-chip info">{item.matchScore}% match</span><span className={`ep-chip ${tone}`}>{label}</span></div>
          </div>
          <button className="ep-x" onClick={onClose} aria-label="Close"><FaTimes /></button>
        </header>

        <div className="ep-drawer-body">
          {c.locked ? (
            <div className="ep-card ep-center">
              <FaLock size={22} />
              <h4>Unlock this candidate</h4>
              <p className="ep-sub">See their name, contact details and CV, and use AI screening and interview scheduling.</p>
              <p className="ep-sub">{c.years ? `${c.years} yrs experience` : ""}{c.education ? ` · ${c.education}` : ""}{c.location ? ` · ${c.location}` : ""}</p>
              <button className="ep-btn amber" onClick={() => startCheckout([c.id])}>Unlock · {kes(price)}</button>
            </div>
          ) : (
            <>
              <div className="ep-actions">
                {(NEXT[item.stage] || []).map(([s, l]) => (
                  <button key={s} className={`ep-btn sm ${s === "rejected" ? "ghost" : ""}`} disabled={!!busy} onClick={() => setStage(s)}>{busy === s ? "…" : l}</button>
                ))}
                <button className="ep-btn sm amber" onClick={() => setSched(true)}>Schedule interview</button>
              </div>

              <ScreeningPanel screening={item.screening} busy={busy === "screen"} onRun={screen} />

              {item.interviews.length > 0 && (
                <>
                  <h4>Interviews</h4>
                  {item.interviews.map((iv) => (
                    <div key={iv.id} className="ep-item">
                      <b>{iv.title || iv.type}</b> <span className={`ep-chip ${iv.status === "scheduled" ? "warn" : iv.status === "completed" ? "ok" : "bad"}`}>{iv.status}</span>
                      <small>{fmtDate(iv.dateTime)} at {fmtTime(iv.dateTime)} · {iv.duration} min · {iv.type}</small>
                      {iv.status === "scheduled" && (
                        <div className="ep-actions">
                          <button className="ep-btn sm ghost" disabled={!!busy} onClick={() => setIv(iv.id, "completed")}>Mark completed</button>
                          <button className="ep-btn sm ghost" disabled={!!busy} onClick={() => setIv(iv.id, "cancelled")}>Cancel</button>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}

              <CandidateProfile c={c} />
            </>
          )}
        </div>
      </aside>

      {sched && <ScheduleInterviewModal item={item} onItem={onItem} onClose={() => setSched(false)} />}
    </>
  );
};

export default ApplicantDrawer;