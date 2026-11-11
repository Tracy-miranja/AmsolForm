import { useMemo, useRef, useState } from "react";
import { Icon } from "../shared/Icons";
import CopyButton from "./CopyButton";
import TemplatePanel from "./TemplatePanel";
import { ACCENTS, buildCvHtml, cvToText, normalizeCv } from "./cvTemplates";

const WORD_NS = `<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">`;

export default function CvBuilder({ cv }) {
  const [template, setTemplate] = useState("modern");
  const [accent, setAccent] = useState(ACCENTS[0].value);
  const [photo, setPhoto] = useState("");
  const [height, setHeight] = useState(1000);
  const frameRef = useRef();
  const previewRef = useRef();

  const clean = useMemo(() => normalizeCv(cv), [cv]);
  const html = useMemo(() => buildCvHtml(clean, { template, accent, photo }), [clean, template, accent, photo]);
  const fileBase = (clean.name || "My").trim().replace(/[^\w]+/g, "_") + "_CV";

  const pickTemplate = (id) => {
    setTemplate(id);
    if (window.innerWidth < 1000) previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Make the preview directly editable and size the frame to its content
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
    <div>
      <style>{`.cvb-grid{display:grid;grid-template-columns:minmax(0,460px) minmax(0,1fr);gap:18px;align-items:start}
        .cvb-left{position:sticky;top:76px}
        @media (max-width:1100px){.cvb-grid{grid-template-columns:minmax(0,1fr)}.cvb-left{position:static}}`}</style>

      <div className="cvb-grid">
        <div className="cvb-left">
          <TemplatePanel cv={clean} template={template} onTemplate={pickTemplate} accent={accent} onAccent={setAccent} photo={photo} onPhoto={setPhoto} />
        </div>

        <div ref={previewRef} style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, padding: 16, scrollMarginTop: 80 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginBottom: 10 }}>
            <button onClick={downloadPdf} className={`${btn} bg-[#1a6edb] text-white hover:bg-[#0d4fa3]`}>{Icon.download} Download PDF</button>
            <button onClick={downloadWord} className={`${btn} border border-[rgba(0,0,0,0.13)] text-[#5a5a72] hover:bg-[#f4f6fb]`}>{Icon.download} Download Word</button>
            <CopyButton text={cvToText(clean)} label="Copy as text" />
          </div>
          <p style={{ fontSize: 11.5, color: "#9090a8", marginBottom: 10 }}>
            Click anywhere in the CV to edit the text. Yellow [placeholders] need your real details. Changing template, colour or photo resets your edits.
            For PDF, choose "Save as PDF" in the print window and turn off "Headers and footers".
          </p>
          <div style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 8, overflow: "hidden", background: "#f4f6fb", padding: 10 }}>
            <iframe ref={frameRef} title="CV preview" srcDoc={html} onLoad={onLoad}
              style={{ width: "100%", height, border: "none", background: "#fff", display: "block", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }} />
          </div>
          <p style={{ fontSize: 11.5, color: "#9090a8", marginTop: 8 }}>Check every detail is true before you apply.</p>
        </div>
      </div>
    </div>
  );
}
