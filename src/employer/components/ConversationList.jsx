import React, { useState } from "react";
import { initials } from "../employerUtils";

const ConversationList = ({ convs, active, onPick }) => {
  const [q, setQ] = useState("");
  const shown = (convs || []).filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <aside className="ep-convs">
      <div className="ep-convs-top"><input className="ep-in" placeholder="Search candidates" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <div className="ep-convs-list">
        {convs === null && <div className="ed-empty">Loading…</div>}
        {shown.map((c) => (
          <button key={c.profileId} className={`ep-conv ${active === c.profileId ? "on" : ""}`} onClick={() => onPick(c.profileId)}>
            <span className="ep-av">{initials(c.name)}</span>
            <span className="ep-conv-t">
              <b>{c.name}</b>
              <small>{c.lastText ? `${c.lastSender === "employer" ? "You: " : ""}${c.lastText}` : c.headline || "No messages yet"}</small>
            </span>
            {c.unread > 0 && <span className="ed-badge">{c.unread}</span>}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default ConversationList;