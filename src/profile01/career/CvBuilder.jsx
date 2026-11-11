import { useMemo, useRef, useState } from "react";
import { Icon } from "../shared/Icons";
import { FL } from "../shared/ui";
import CopyButton from "./CopyButton";
import { ACCENTS, TEMPLATES, buildCvHtml, cvToText, normalizeCv } from "./cvTemplates";

const WORD_NS = `<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">`;

export default function CvBuilder({ cv }) {
  const [template, setTemplate] = useState("modern");
  const [accent, setAccent] = useState(ACCENTS[0].value);
  const [height, setHeight] = useState(900);
  const frameRef = useRef();

  const clean = useMemo(() => normalizeCv(cv), [cv]);
  const html = useMemo(() => buildCvHtml(clean, { template, accent }), [clean, template, accent]);
  const fileBase = (clean.name || "My").trim().replace(/[^\w]+/g, "_") + "_CV";

  // Make the preview directly editable, and size the frame to its content
  const onLoad = () => {
    const doc = frameRef.current?.contentDocument;
    if (!doc) return;
    doc.designMode = "on";
    const fit = () => setHeight(Math.max(700, doc.documentElement.scrollHeight + 8));
    fit();
    doc.addEventListener("input", fit);
  };

  const currentHtml = () => "<!DOCTYPE html>" + frameRef.current.contentDocument.documentElement.outerHTML;

  const downloadPdf = () => {
    const win = frameRef.current?.contentWindow;
    if (!win) return;
    win.focus();
    win.print(); // in the print window choose "Save as PDF"
  };

  const downloadWord = () => {
    const doc = currentHtml()
      .replace(/<html[^>]*>/i, WORD_NS)
      .replace("</head>", "<style>@page Section1 { size: 595.3pt 841.9pt; margin: 40pt 42pt; } div.Section1 { page: Section1; }</style></head>")
      .replace(/<body([^>]*)>/i, '<body$1><div class="Section1">').replace("</body>", "</div></body>");
    const url = URL.createObjectURL(new Blob(["\ufeff", doc], { type: "application/msword" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileBase}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const btn = "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12.5px] font-medium transition";

  return (
    <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: 16 }}>
      <FL label="Your revamped CV" />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
        {TEMPLATES.map((tp) => (
          <button key={tp.id} onClick={() => setTemplate(tp.id)} title={tp.desc}
            style={{ padding: "7px 14px", borderRadius: 9, fontSize: 12.5, fontWeight: 500, cursor: "pointer",
              border: "1.5px solid " + (template === tp.id ? accent : "rgba(0,0,0,0.12)"),
              background: template === tp.id ? "#f8f9fc" : "#fff", color: "#1a1a2e" }}>{tp.name}</button>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 6 }}>
          {ACCENTS.map((a) => (
            <button key={a.value} onClick={() => setAccent(a.value)} title={a.name} aria-label={a.name}
              style={{ width: 22, height: 22, borderRadius: "50%", background: a.value, cursor: "pointer",
                border: accent === a.value ? "2px solid #fff" : "2px solid transparent",
                boxShadow: accent === a.value ? `0 0 0 2px ${a.value}` : "none" }} />
          ))}
        </div>
      </div>

      <p style={{ fontSize: 11.5, color: "#9090a8", margin: "10px 0" }}>
        Click anywhere in the preview to edit the text. Yellow [placeholders] need your real details. Changing the template or colour resets your edits.
      </p>

      <div style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 8, overflow: "hidden", background: "#f4f6fb", padding: 10 }}>
        <iframe ref={frameRef} title="CV preview" srcDoc={html} onLoad={onLoad}
          style={{ width: "100%", height, border: "none", background: "#fff", display: "block", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }} />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12, alignItems: "center" }}>
        <button onClick={downloadPdf} className={`${btn} bg-[#1a6edb] text-white hover:bg-[#0d4fa3]`}>{Icon.download} Download PDF</button>
        <button onClick={downloadWord} className={`${btn} border border-[rgba(0,0,0,0.13)] text-[#5a5a72] hover:bg-[#f4f6fb]`}>{Icon.download} Download Word</button>
        <CopyButton text={cvToText(clean)} label="Copy as text" />
      </div>
      <p style={{ fontSize: 11.5, color: "#9090a8", marginTop: 8 }}>
        PDF: in the print window choose "Save as PDF" and turn off "Headers and footers". Check every detail is true before you apply.
      </p>
    </div>
  );
}
