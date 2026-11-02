import React from "react";
import { toast } from "react-hot-toast";
import api from "../../../api/axiosInstance";

const CandidateProfile = ({ c }) => {
  const openCv = async () => {
    const w = window.open("", "_blank"); // open first so the browser doesn't block the pop-up
    try {
      const { data } = await api.get(`/api/employer/candidates/${c.id}/cv`, { responseType: "blob" });
      w.location = URL.createObjectURL(data);
    } catch {
      w?.close();
      toast.error("Could not open the CV.");
    }
  };

  return (
    <div className="ep-prof">
      <div className="ep-contact">
        <div><small>Email</small><b>{c.email || "—"}</b></div>
        <div><small>Phone</small><b>{c.phone || "—"}</b></div>
        <div><small>WhatsApp</small><b>{c.whatsapp || "—"}</b></div>
        <div><small>Nationality</small><b>{c.nationality || "—"}</b></div>
      </div>
      {c.hasCv && <button className="ep-btn sm" onClick={openCv}>View CV{c.cvName ? ` (${c.cvName})` : ""}</button>}

      {c.experience?.length > 0 && (
        <>
          <h4>Experience</h4>
          {c.experience.map((w, i) => (
            <div key={i} className="ep-item">
              <b>{w.position || "Role"}</b> <span>{w.company}</span>
              {w.duration && <small>{w.duration}</small>}
              {w.responsibilities?.length > 0 && <ul>{w.responsibilities.map((r, k) => <li key={k}>{r}</li>)}</ul>}
            </div>
          ))}
        </>
      )}

      {c.educationList?.length > 0 && (
        <>
          <h4>Education</h4>
          {c.educationList.map((e, i) => <div key={i} className="ep-item"><b>{e.level}</b> {e.course} <span>{e.institution}</span></div>)}
        </>
      )}

      {c.qualifications?.length > 0 && (<><h4>Professional qualifications</h4><div className="ep-chips">{c.qualifications.map((q) => <span key={q} className="ep-chip">{q}</span>)}</div></>)}
    </div>
  );
};

export default CandidateProfile;