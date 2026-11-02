import React, { useState } from "react";
import { FaBriefcase } from "react-icons/fa";
import { fmtDate, fmtTime, initials, sameDay } from "../employerUtils";

const InterviewsPanel = ({ interviews = [] }) => {
  const [tab, setTab] = useState("today");
  const now = new Date();

  const shown = interviews
    .filter((i) => {
      const done = String(i.status || "").toLowerCase() === "completed";
      if (tab === "completed") return done;
      if (done) return false;
      return tab === "today" ? sameDay(i.date, now) : new Date(i.date) > now && !sameDay(i.date, now);
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <section>
      <h2 className="ed-sec">Upcoming Interviews</h2>
      <div className="ed-card">
        <div className="ed-tabs">
          {[["today", "Today"], ["upcoming", "Upcoming"], ["completed", "Completed"]].map(([k, l]) => (
            <button key={k} className={`ed-tab ${tab === k ? "on" : ""}`} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>

        <div className="ed-scroll">
          {shown.length === 0 ? (
            <div className="ed-empty">No {tab} interviews.</div>
          ) : shown.map((i) => {
            const name = i.candidateName || i.name;
            return (
              <div key={i.id || i._id} className="ed-int">
                {i.avatar ? <img className="ed-av" src={i.avatar} alt="" /> : <span className="ed-av">{initials(name)}</span>}
                <div>
                  <b>{name}</b>
                  <small><FaBriefcase /> For <em>{i.jobTitle || i.job}</em></small>
                </div>
                <time>{tab === "upcoming" ? `${fmtDate(i.date)}, ` : "At "}{fmtTime(i.date)}</time>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InterviewsPanel;