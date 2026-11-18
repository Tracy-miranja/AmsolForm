import { useState } from "react";
import { Icon } from "../shared/Icons";

// Shown on the Profile page when a CV is saved but key sections are still empty
export default function CvImportBanner({ onImport }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", padding: "14px 18px", borderRadius: 14, background: "#f0f5ff", border: "1px solid rgba(26,110,219,0.2)" }}>
      <div style={{ flex: "1 1 240px" }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1a1a2e" }}>Your CV is uploaded. Fill your profile from it in one click.</div>
        <div style={{ fontSize: 12.5, color: "#5a5a72", marginTop: 2 }}>We'll show you what we found and you confirm before anything is saved.</div>
      </div>
      <button onClick={onImport} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1a6edb] text-white text-[12.5px] font-medium hover:bg-[#0d4fa3] transition">
        {Icon.sparkle} Fill my profile
      </button>
      <button onClick={() => setHidden(true)} style={{ fontSize: 12, color: "#9090a8", cursor: "pointer" }}>Hide</button>
    </div>
  );
}
