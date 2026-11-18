import { useMemo, useRef, useState } from "react";
import { Icon } from "../shared/Icons";
import { ACCENTS, FILTERS, PLACEHOLDER_PHOTO, TEMPLATES, buildCvHtml } from "./cvTemplates";

const PAGE_W = 794, PAGE_H = 1123, THUMB_W = 196, SCALE = THUMB_W / PAGE_W;

function Thumb({ cv, tpl, accent, selected, onPick }) {
  // Live mini-preview of the applicant's own CV in this template
  const html = useMemo(
    () => buildCvHtml(cv, { template: tpl.id, accent, photo: tpl.photo ? PLACEHOLDER_PHOTO : "" }),
    [cv, tpl.id, tpl.photo, accent],
  );
  const [hover, setHover] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ fontSize: 13, fontWeight: selected ? 600 : 500, color: "#1a1a2e" }}>{tpl.name}</div>
      <div onClick={onPick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ position: "relative", width: THUMB_W, height: Math.round(PAGE_H * SCALE), overflow: "hidden", cursor: "pointer", background: "#fff", borderRadius: 4,
          outline: selected ? "3px solid #1a6edb" : "1px solid rgba(0,0,0,0.12)", boxShadow: hover ? "0 6px 18px rgba(0,0,0,0.15)" : "0 1px 4px rgba(0,0,0,0.08)", transition: "box-shadow .15s" }}>
        <iframe title={tpl.name} srcDoc={html} scrolling="no" tabIndex={-1}
          style={{ width: PAGE_W, height: PAGE_H, border: "none", transform: `scale(${SCALE})`, transformOrigin: "0 0", pointerEvents: "none", background: "#fff" }} />
        {selected && (
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 44, height: 44, borderRadius: "50%", background: "#1a6edb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.25)" }}>
            <svg viewBox="0 0 20 20" width="24" height="24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" /></svg>
          </div>
        )}
        {hover && !selected && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(15,21,35,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ background: "#1a6edb", color: "#fff", fontSize: 12.5, fontWeight: 600, padding: "8px 14px", borderRadius: 8 }}>Use this template</span>
          </div>
        )}
        <div style={{ position: "absolute", right: 6, bottom: 6, display: "flex", gap: 4 }}>
          {["PDF", "WORD"].map((b) => <span key={b} style={{ background: "#f59e0b", color: "#1f2937", fontSize: 9.5, fontWeight: 700, padding: "3px 6px", borderRadius: 3 }}>{b}</span>)}
        </div>
      </div>
    </div>
  );
}

// Crop to a centred square and shrink so the photo stays small inside the CV file
function readPhoto(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const side = Math.min(img.width, img.height), size = 300;
      const c = document.createElement("canvas");
      c.width = c.height = size;
      c.getContext("2d").drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("bad image")); };
    img.src = url;
  });
}

export default function TemplatePanel({ cv, template, onTemplate, accent, onAccent, photo, onPhoto }) {
  const [filter, setFilter] = useState("all");
  const [err, setErr] = useState("");
  const fileRef = useRef();
  const current = TEMPLATES.find((t) => t.id === template);
  const list = TEMPLATES.filter((t) => filter === "all" || t.tags.includes(filter));

  const pickPhoto = async (e) => {
    const f = e.target.files[0];
    e.target.value = "";
    if (!f) return;
    setErr("");
    try { onPhoto(await readPhoto(f)); } catch { setErr("Couldn't read that image. Try a JPG or PNG."); }
  };

  const chip = (active) => ({
    padding: "7px 14px", borderRadius: 99, fontSize: 12.5, fontWeight: 500, cursor: "pointer",
    border: "1px solid " + (active ? "#1a6edb" : "rgba(0,0,0,0.15)"), background: active ? "#eaf3ff" : "#fff", color: active ? "#1a6edb" : "#1a1a2e",
  });

  return (
    <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(0,0,0,0.08)", fontSize: 13.5, fontWeight: 600, color: "#1a1a2e" }}>Template & colours</div>

      <div style={{ padding: "12px 16px", background: "#f6f7fa", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12.5, color: "#4a5068", marginRight: 4 }}>Main colour</span>
        {ACCENTS.map((a) => (
          <button key={a.value} onClick={() => onAccent(a.value)} title={a.name} aria-label={a.name}
            style={{ width: 24, height: 24, borderRadius: "50%", background: a.value, cursor: "pointer", border: "2px solid #fff", boxShadow: accent === a.value ? `0 0 0 2px ${a.value}` : "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
            {accent === a.value && <svg viewBox="0 0 20 20" width="13" height="13" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" /></svg>}
          </button>
        ))}
        <label title="Custom colour" style={{ width: 24, height: 24, borderRadius: "50%", cursor: "pointer", overflow: "hidden", position: "relative", background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)", border: "2px solid #fff", boxShadow: "0 0 0 1px rgba(0,0,0,0.2)" }}>
          <input type="color" value={accent} onChange={(e) => onAccent(e.target.value)} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%", padding: 0, border: "none" }} />
        </label>
      </div>

      {current?.photo && (
        <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {photo ? <img src={photo} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} /> : <span style={{ width: 36, height: 36, borderRadius: "50%", background: "#e5e8f0" }} />}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickPhoto} />
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(0,0,0,0.13)] text-[#5a5a72] text-[12.5px] hover:bg-[#f4f6fb] transition">
            {Icon.upload} {photo ? "Change photo" : "Add photo"}
          </button>
          {photo && <button onClick={() => onPhoto("")} style={{ fontSize: 12, color: "#9090a8", textDecoration: "underline", cursor: "pointer" }}>Remove</button>}
          <span style={{ fontSize: 11, color: "#9090a8", flexBasis: "100%" }}>Optional. Many employers prefer CVs without photos. The photo shows in PDF; in Word you may need to insert it yourself.</span>
          {err && <span style={{ fontSize: 12, color: "#dc2626" }}>{err}</span>}
        </div>
      )}

      <div style={{ padding: "12px 16px", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {FILTERS.map((f) => <button key={f.id} onClick={() => setFilter(f.id)} style={chip(filter === f.id)}>{f.label}</button>)}
      </div>

      <div style={{ padding: "4px 16px 18px", maxHeight: 640, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(196px, 1fr))", gap: 18, justifyItems: "center" }}>
        {list.map((tpl) => (
          <Thumb key={tpl.id} cv={cv} tpl={tpl} accent={accent} selected={tpl.id === template} onPick={() => onTemplate(tpl.id)} />
        ))}
        {list.length === 0 && <p style={{ fontSize: 13, color: "#9090a8" }}>No templates match this filter.</p>}
      </div>
    </div>
  );
}
