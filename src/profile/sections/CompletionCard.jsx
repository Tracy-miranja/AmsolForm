import { calcCompletion } from "../shared/utils";

const chip = (bg, color) => ({ fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 500, background: bg, color });

export default function CompletionCard({ profile, hasWorkExperience }) {
  const pct = calcCompletion(profile);
  const barColor = pct < 50 ? "#ef4444" : pct < 80 ? "#f59e0b" : "#1a6edb";
  const hasSummary = Array.isArray(profile?.specialization) ? profile.specialization.length : profile?.specialization;

  return (
    <div className="completion-card" style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.08)", padding: "18px 24px" }}>
      <div style={{ flex: "0 0 auto" }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a2e", marginBottom: 3 }}>Complete your profile</div>
        <div style={{ fontSize: 12, color: "#9090a8" }}>Employers find you 4× faster with a complete profile</div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: barColor }}>{pct}%</span>
          {pct < 80 && <span style={{ fontSize: 12, color: "#1a6edb", fontWeight: 500 }}>+{Math.round((100 - pct) / 2)}% — add experience</span>}
        </div>
        <div style={{ height: 7, background: "#e8edf5", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${barColor}, #6366f1)`, borderRadius: 99, transition: "width 0.7s" }} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end", flexShrink: 0 }}>
        {!hasWorkExperience && <span style={chip("#fef0e8", "#f26722")}>Missing: work experience</span>}
        {!hasSummary && <span style={chip("#e8f1fd", "#1a6edb")}>Missing: summary</span>}
        {!profile?.savedCvFileId && <span style={chip("#fef9c3", "#854d0e")}>Missing: CV</span>}
      </div>
    </div>
  );
}
