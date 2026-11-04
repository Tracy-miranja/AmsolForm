import { useMemo, useState } from "react";
import { Icon } from "../shared/Icons";
import { Inp } from "../shared/ui";
import { COURSES, CATEGORIES } from "../data/courses";
import useLearnProgress from "../hooks/useLearnProgress";
import CourseModal from "../learn/CourseModal";

const levelColor = { Beginner: ["#e8f7ee", "#16a34a"], Intermediate: ["#fff4e5", "#d97706"], Advanced: ["#fde8e8", "#dc2626"] };

export default function LearnPage({ userId }) {
  const { done, toggle, progress } = useLearnProgress(userId);
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);

  const list = useMemo(() => COURSES.filter((c) =>
    (cat === "All" || c.category === cat) &&
    (!q.trim() || (c.title + c.description).toLowerCase().includes(q.toLowerCase()))), [cat, q]);

  const active = COURSES.find((c) => c.id === open);

  return (
    <div className="page-padding" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "linear-gradient(135deg,#0F1523,#1a3a6e)", borderRadius: 20, padding: "24px 28px", color: "#fff" }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600 }}>Learn & grow</div>
        <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>Short, practical courses to help you get hired faster. Learn at your own pace.</div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "1 1 220px", maxWidth: 320 }}><Inp type="text" placeholder="Search courses…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              style={{ padding: "6px 13px", borderRadius: 99, fontSize: 12, fontWeight: 500, cursor: "pointer",
                border: "1px solid " + (cat === c ? "#1a6edb" : "rgba(0,0,0,0.1)"),
                background: cat === c ? "#e8f1fd" : "#fff", color: cat === c ? "#1a6edb" : "#5a5a72" }}>{c}</button>
          ))}
        </div>
      </div>

      {list.length === 0 && <p style={{ fontSize: 13, color: "#9090a8" }}>No courses match your search.</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 16 }}>
        {list.map((c) => {
          const p = progress(c);
          const soon = c.status === "soon";
          const [bg, fg] = levelColor[c.level] || levelColor.Beginner;
          return (
            <div key={c.id} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 14, padding: 18, display: "flex", flexDirection: "column", gap: 10, opacity: soon ? 0.75 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 99, background: bg, color: fg, fontWeight: 600 }}>{c.level}</span>
                <span style={{ fontSize: 11.5, color: "#9090a8" }}>{c.minutes} min</span>
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: "#1a1a2e" }}>{c.title}</div>
              <div style={{ fontSize: 12.5, color: "#5a5a72", lineHeight: 1.55, flex: 1 }}>{c.description}</div>
              <div style={{ fontSize: 11.5, color: "#9090a8" }}>{c.category}{!soon && ` · ${c.lessons.length} lessons`}</div>
              {soon ? (
                <div style={{ fontSize: 12.5, color: "#9090a8", fontWeight: 500 }}>Coming soon</div>
              ) : (
                <>
                  {p.done > 0 && (
                    <div style={{ height: 6, background: "#e8edf5", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${p.pct}%`, background: "#1a6edb" }} />
                    </div>
                  )}
                  <button onClick={() => setOpen(c.id)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#1a6edb] text-white text-[12.5px] font-medium hover:bg-[#0d4fa3] transition">
                    {Icon.book} {p.pct === 100 ? "Review course" : p.done > 0 ? `Continue (${p.pct}%)` : "Start course"}
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {active && <CourseModal course={active} completed={done[active.id] || []} onToggle={(lid) => toggle(active.id, lid)} onClose={() => setOpen(null)} />}
    </div>
  );
}
