import { useRef, useState } from "react";
import { Icon } from "../shared/Icons";
import { MF, Inp, FL } from "../shared/ui";
import { revampCv, downloadSavedCv, errMsg } from "./careerApi";
import CopyButton from "./CopyButton";

const list = (arr) => (Array.isArray(arr) ? arr.filter(Boolean) : []);

// Word opens HTML saved as .doc — simple way to give a downloadable, editable CV
function downloadAsWord(text) {
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const body = text.split("\n").map((ln) => {
    const t = ln.trim();
    if (!t) return "<br/>";
    if (/^[A-Z][A-Z &/,-]{3,}$/.test(t)) return `<h3 style="margin:14px 0 4px;border-bottom:1px solid #999">${esc(t)}</h3>`;
    if (t.startsWith("- ")) return `<p style="margin:2px 0 2px 18px">• ${esc(t.slice(2))}</p>`;
    return `<p style="margin:2px 0">${esc(t)}</p>`;
  }).join("");
  const html = `<html><head><meta charset="utf-8"></head><body style="font-family:Calibri,Arial;font-size:11pt">${body}</body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: "application/msword" }));
  const a = document.createElement("a");
  a.href = url; a.download = "Revamped_CV.doc"; a.click();
  URL.revokeObjectURL(url);
}

const Block = ({ title, children, copy }) => (
  <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
      <FL label={title} />{copy && <CopyButton text={copy} />}
    </div>
    {children}
  </div>
);

export default function CvRevamp({ profile }) {
  const hasSaved = !!profile?.savedCvFileId;
  const [source, setSource] = useState(hasSaved ? "saved" : "upload");
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [r, setR] = useState(null);
  const fileRef = useRef();

  const run = async () => {
    setError(""); setR(null);
    if (source === "upload" && !file) return setError("Please choose a CV file (PDF or DOCX).");
    setLoading(true);
    try {
      const cv = source === "saved" ? await downloadSavedCv(profile.savedCvFileId, profile.savedCvName) : file;
      setR(await revampCv(cv, jobTitle.trim(), jd.trim()));
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  const score = Math.max(0, Math.min(100, Number(r?.score) || 0));
  const scoreColor = score < 50 ? "#ef4444" : score < 75 ? "#f59e0b" : "#16a34a";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <p style={{ fontSize: 13.5, color: "#5a5a72" }}>Get an honest score, clear fixes and a rewritten version of your CV. We never add experience you don't have.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 560 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <FL label="Which CV?" />
          {hasSaved && (
            <label style={{ display: "flex", gap: 8, fontSize: 13, color: "#5a5a72", cursor: "pointer" }}>
              <input type="radio" checked={source === "saved"} onChange={() => setSource("saved")} />
              My saved CV: <strong style={{ color: "#1a6edb" }}>{profile.savedCvName}</strong>
            </label>
          )}
          <label style={{ display: "flex", gap: 8, fontSize: 13, color: "#5a5a72", cursor: "pointer" }}>
            <input type="radio" checked={source === "upload"} onChange={() => setSource("upload")} /> Upload a different CV
          </label>
          {source === "upload" && (
            <>
              <input ref={fileRef} type="file" accept=".pdf,.docx" className="hidden" onChange={(e) => setFile(e.target.files[0] || null)} />
              <button type="button" onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 border-[1.5px] border-dashed border-[#1a6edb60] rounded-lg text-[#1a6edb] hover:bg-[#e8f1fd] transition text-[12.5px] font-medium w-fit">
                {Icon.upload} {file ? file.name : "Choose CV (PDF or DOCX)"}
              </button>
            </>
          )}
        </div>

        <MF label="Job you're applying for (optional)">
          <Inp type="text" placeholder="e.g. Accountant" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
        </MF>
        <MF label="Paste the job advert (optional, gives better keywords)">
          <textarea rows={4} value={jd} maxLength={4000} onChange={(e) => setJd(e.target.value)} style={{ resize: "vertical" }} placeholder="Paste the job description here…" />
        </MF>
        <button onClick={run} disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a6edb] text-white rounded-xl text-sm font-semibold hover:bg-[#0d4fa3] disabled:opacity-50 transition w-fit">
          {loading ? Icon.spin : Icon.sparkle} {loading ? "Reviewing your CV… (about 20 seconds)" : "Revamp my CV"}
        </button>
        {error && <p style={{ color: "#dc2626", fontSize: 13 }}>{error}</p>}
      </div>

      {r && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Block title="CV score">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 34, fontWeight: 600, color: scoreColor }}>{score}<span style={{ fontSize: 16, color: "#9090a8" }}>/100</span></div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 8, background: "#e8edf5", borderRadius: 99, overflow: "hidden" }}><div style={{ height: "100%", width: `${score}%`, background: scoreColor }} /></div>
                <div style={{ fontSize: 12.5, color: "#5a5a72", marginTop: 6 }}>{r.scoreReason}</div>
              </div>
            </div>
          </Block>

          <div className="profile-grid-2col" style={{ gap: 14 }}>
            {list(r.strengths).length > 0 && (
              <Block title="What's working">
                {list(r.strengths).map((s, i) => <p key={i} style={{ fontSize: 13, color: "#166534", marginBottom: 4 }}>✓ {s}</p>)}
              </Block>
            )}
            {list(r.issues).length > 0 && (
              <Block title="Fix these">
                {list(r.issues).map((s, i) => <p key={i} style={{ fontSize: 13, color: "#92400e", marginBottom: 4 }}>• {s}</p>)}
              </Block>
            )}
          </div>

          {r.rewrittenSummary && (
            <Block title="Stronger professional summary" copy={r.rewrittenSummary}>
              <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "#1a1a2e" }}>{r.rewrittenSummary}</p>
            </Block>
          )}

          {list(r.improvedBullets).length > 0 && (
            <Block title="Better bullet points">
              {r.improvedBullets.map((b, i) => (
                <div key={i} style={{ padding: "8px 0", borderBottom: i < r.improvedBullets.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none", fontSize: 13 }}>
                  <div style={{ color: "#9090a8", textDecoration: "line-through" }}>{b.before}</div>
                  <div style={{ color: "#16a34a", marginTop: 3, display: "flex", justifyContent: "space-between", gap: 8 }}><span>→ {b.after}</span><CopyButton text={b.after} /></div>
                </div>
              ))}
            </Block>
          )}

          {list(r.missingKeywords).length > 0 && (
            <Block title="Keywords to add (only if true for you)">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {r.missingKeywords.map((k) => <span key={k} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 99, background: "#f0f0ff", color: "#6366f1", fontWeight: 500 }}>{k}</span>)}
              </div>
            </Block>
          )}

          {list(r.atsTips).length > 0 && (
            <Block title="Beat the CV scanners">{r.atsTips.map((s, i) => <p key={i} style={{ fontSize: 13, color: "#3a3a52", marginBottom: 4 }}>• {s}</p>)}</Block>
          )}

          {r.revampedCvText && (
            <Block title="Your revamped CV (review before using!)" copy={r.revampedCvText}>
              <div style={{ whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.65, color: "#1a1a2e", maxHeight: 380, overflowY: "auto", background: "#f8f9fc", padding: 12, borderRadius: 8 }}>{r.revampedCvText}</div>
              <button onClick={() => downloadAsWord(r.revampedCvText)}
                className="flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-lg border border-[rgba(0,0,0,0.13)] text-[#5a5a72] text-[12.5px] hover:bg-[#f4f6fb] transition">
                {Icon.download} Download as Word
              </button>
              <p style={{ fontSize: 11.5, color: "#9090a8", marginTop: 8 }}>Replace any [add figure] placeholders with your real numbers and check every detail is correct before you apply.</p>
            </Block>
          )}
        </div>
      )}
    </div>
  );
}
