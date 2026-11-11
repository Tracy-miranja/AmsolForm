import { Icon } from "../shared/Icons";

export default function TopBar({ title, onMenu, onPreviewCv, onQuickApply }) {
  return (
    <div style={{
      background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.08)", padding: "0 16px", height: 60,
      display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, gap: 8,
    }}>
      <button className="hamburger-btn" onClick={onMenu}
        style={{ flexShrink: 0, padding: 6, borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center" }}>
        <svg viewBox="0 0 20 20" fill="#5a5a72" width="20" height="20">
          <path fillRule="evenodd" clipRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z" />
        </svg>
      </button>
      <span style={{ fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 600, color: "#1a1a2e", flex: 1 }}>{title}</span>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button onClick={onPreviewCv}
          className="top-bar-btn flex items-center gap-1.5 px-4 py-2 rounded-[9px] border border-[rgba(0,0,0,0.13)] text-[#5a5a72] text-[13px] font-medium hover:bg-[#f4f6fb] transition">
          {Icon.eye} <span className="top-bar-label">Preview CV</span>
        </button>
        <button onClick={onQuickApply}
          className="top-bar-btn flex items-center gap-1.5 px-4 py-2 rounded-[9px] bg-[#f26722] text-white text-[13px] font-medium hover:bg-[#d95a1a] transition">
          <span className="top-bar-label">Quick Apply</span>
        </button>
      </div>
    </div>
  );
}
