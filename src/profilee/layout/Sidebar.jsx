import { Link } from "react-router-dom";
import { Icon } from "../shared/Icons";
import { NavItem } from "../shared/ui";

const groupLabel = (text, pad) => (
  <div style={{ fontSize: 10, fontWeight: 500, color: "#9090a8", letterSpacing: "0.1em", textTransform: "uppercase", padding: pad }}>{text}</div>
);

export default function Sidebar({ activeNav, onNav, open, onClose, applicationsCount, displayAvatar, initials, fullName, onLogout }) {
  const go = (key) => () => { onNav(key); onClose(); };
  const item = (key, icon, label, extra = {}) => (
    <NavItem icon={icon} label={label} active={activeNav === key} onClick={go(key)} {...extra} />
  );

  return (
    <>
      <div className={`sidebar-overlay${open ? " open" : ""}`} onClick={onClose} />
      <aside className={`sidebar${open ? " open" : ""}`}>
        <div style={{ padding: "0 24px 24px", borderBottom: "1px solid rgba(0,0,0,0.08)", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, background: "#1a6edb", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg viewBox="0 0 16 16" width="14" height="14" fill="white">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 9a5.25 5.25 0 01-4.374-2.344C3.956 9.312 6.391 8.5 8 8.5c1.607 0 4.045.812 4.374 2.156A5.25 5.25 0 018 13z" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, fontWeight: 600, color: "#1a1a2e" }}>
                <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>AMSOL</Link>
              </div>
              <div style={{ fontSize: 10, color: "#9090a8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>Jobs Portal</Link>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "0 12px", flex: 1 }}>
          {groupLabel("Main", "6px 12px 4px")}
          {item("dashboard", Icon.apps, "Dashboard")}
          {item("jobs", Icon.search, "Jobs")}
          {item("profile", Icon.user, "Profile")}
          {item("cv", Icon.file, "Uploaded CV")}
          {item("saved", Icon.bookmark, "Saved Jobs")}
          {groupLabel("Career", "14px 12px 4px")}
          {item("settings", Icon.settings, "Job Settings")}
          {item("applications", Icon.briefcase, "Applications", { badge: applicationsCount })}
          {item("messages", Icon.msg, "Messages")}
        </div>

        {item("terms", Icon.file, "Terms & Conditions")}

        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: displayAvatar ? "transparent" : "linear-gradient(135deg,#1a6edb,#6366f1)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: "white", flexShrink: 0, overflow: "hidden",
            }}>
              {displayAvatar ? <img src={displayAvatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fullName}</div>
              <div style={{ fontSize: 11, color: "#9090a8" }}>Job Seeker</div>
              <div style={{ fontSize: 15, color: "#f30928ff", fontWeight: 500 }}>
                <button onClick={onLogout}>Log out</button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
