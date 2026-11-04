import { useState } from "react";
import { Icon } from "../shared/Icons";
import { MF, Inp } from "../shared/ui";
import { runQuick, errMsg } from "./careerApi";
import CopyButton from "./CopyButton";

const TOOLS = [
  { id: "cover_letter", emoji: "✉️", title: "Cover letter", desc: "A tailored letter for one job", needs: ["jobTitle", "company", "notes"] },
  { id: "interview_prep", emoji: "🎤", title: "Interview prep", desc: "Likely questions + how to answer", needs: ["jobTitle", "company"] },
  { id: "linkedin", emoji: "💼", title: "LinkedIn headline & About", desc: "Stand out to recruiters", needs: ["jobTitle", "notes"] },
  { id: "elevator_pitch", emoji: "⏱️", title: "Elevator pitch", desc: "Your 30-second intro", needs: ["jobTitle", "notes"] },
  { id: "follow_up", emoji: "📧", title: "Thank-you email", desc: "Follow up after an interview", needs: ["jobTitle", "company", "notes"] },
];
const LABELS = {
  jobTitle: ["Job title", "e.g. Senior Accountant"],
  company: ["Company", "e.g. Safaricom PLC"],
  notes: ["Extra details (optional)", "Paste the job advert, or add things you want mentioned…"],
};

export default function QuickTools({ context }) {
  const [tool, setTool] = useState(null);
  const [input, setInput] = useState({ jobTitle: context?.currentRole || "", company: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const pick = (t) => { setTool(t); setText(""); setError(""); };
  const run = async () => {
    setLoading(true); setError(""); setText("");
    try { setText(await runQuick(tool.id, input, context)); }
    catch (err) { setError(errMsg(err)); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12 }}>
        {TOOLS.map((t) => (
          <button key={t.id} onClick={() => pick(t)}
            style={{ textAlign: "left", padding: 14, borderRadius: 12, cursor: "pointer",
              border: "1.5px solid " + (tool?.id === t.id ? "#1a6edb" : "rgba(0,0,0,0.08)"), background: tool?.id === t.id ? "#f0f5ff" : "#fff" }}>
            <div style={{ fontSize: 20 }}>{t.emoji}</div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1a1a2e", marginTop: 6 }}>{t.title}</div>
            <div style={{ fontSize: 12, color: "#9090a8", marginTop: 2 }}>{t.desc}</div>
          </button>
        ))}
      </div>

      {tool && (
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12, maxWidth: 560 }}>
          {tool.needs.map((k) => (
            <MF key={k} label={LABELS[k][0]}>
              {k === "notes" ? (
                <textarea rows={4} placeholder={LABELS[k][1]} value={input[k]} maxLength={1500}
                  onChange={(e) => setInput((s) => ({ ...s, [k]: e.target.value }))} style={{ resize: "vertical" }} />
              ) : (
                <Inp type="text" placeholder={LABELS[k][1]} value={input[k]} onChange={(e) => setInput((s) => ({ ...s, [k]: e.target.value }))} />
              )}
            </MF>
          ))}
          <p style={{ fontSize: 11.5, color: "#9090a8" }}>We also use your profile skills and experience (not your contact details) to personalise this.</p>
          <button onClick={run} disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a6edb] text-white rounded-xl text-sm font-semibold hover:bg-[#0d4fa3] disabled:opacity-50 transition w-fit">
            {loading ? Icon.spin : Icon.sparkle} {loading ? "Writing…" : `Generate ${tool.title.toLowerCase()}`}
          </button>
          {error && <p style={{ color: "#dc2626", fontSize: 13 }}>{error}</p>}
          {text && (
            <div style={{ background: "#f8f9fc", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}><CopyButton text={text} label="Copy all" /></div>
              <div style={{ whiteSpace: "pre-wrap", fontSize: 13.5, lineHeight: 1.7, color: "#1a1a2e" }}>{text}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
