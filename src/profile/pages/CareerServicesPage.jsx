import { useMemo, useState } from "react";
import { SectionCard } from "../shared/ui";
import { buildCareerContext } from "../career/careerApi";
import CareerCoach from "../career/CareerCoach";
import CvRevamp from "../career/CvRevamp";
import QuickTools from "../career/QuickTools";

const TABS = [
  { id: "coach", label: "🧭 AI Career Coach", dot: "#1a6edb" },
  { id: "cv", label: "📄 CV Revamp", dot: "#7c3aed" },
  { id: "quick", label: "⚡ Quick Tools", dot: "#f26722" },
];

export default function CareerServicesPage({ profile, skills, workExperience }) {
  const [tab, setTab] = useState("coach");
  const context = useMemo(() => buildCareerContext(profile, skills, workExperience), [profile, skills, workExperience]);
  const active = TABS.find((t) => t.id === tab);

  return (
    <div className="page-padding" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: "9px 16px", borderRadius: 10, fontSize: 13.5, fontWeight: 500, cursor: "pointer",
              border: "1.5px solid " + (tab === t.id ? t.dot : "rgba(0,0,0,0.1)"),
              background: tab === t.id ? "#fff" : "transparent", color: tab === t.id ? "#1a1a2e" : "#5a5a72" }}>{t.label}</button>
        ))}
      </div>

      <SectionCard dotColor={active.dot} title={active.label.replace(/^\S+\s/, "")}>
        {tab === "coach" && <CareerCoach context={context} />}
        {tab === "cv" && <CvRevamp profile={profile} />}
        {tab === "quick" && <QuickTools context={context} />}
      </SectionCard>
    </div>
  );
}
