import { Icon } from "../shared/Icons";

const ITEMS = [
  { key: "dashboard", icon: Icon.apps, label: "Home" },
  { key: "profile", icon: Icon.user, label: "Profile" },
  { key: "applications", icon: Icon.briefcase, label: "Apply" },
  { key: "saved", icon: Icon.bookmark, label: "Saved" },
  { key: "messages", icon: Icon.msg, label: "Messages" },
];

export default function BottomNav({ activeNav, onNav }) {
  return (
    <nav className="bottom-nav">
      {ITEMS.map(({ key, icon, label }) => (
        <button key={key} onClick={() => onNav(key)}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 12px",
            border: "none", background: "transparent", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            color: activeNav === key ? "#1a6edb" : "#9090a8", fontSize: 10, fontWeight: activeNav === key ? 600 : 400,
          }}>
          {icon}
          {label}
        </button>
      ))}
    </nav>
  );
}
