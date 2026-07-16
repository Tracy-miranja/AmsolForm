import { useState, useContext } from "react";
import api from "../api/axiosInstance";
import { JobContext } from "./JobContext";
import FormLayout from "./Formlayout";

const API = "/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────
// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Decode ALL HTML entities using the browser's own parser */
const decodeHtmlEntities = (str) => {
  if (!str) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
};

const stripHtml = (html) => {
  if (!html) return "";
  return decodeHtmlEntities(
    html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
};

/** HTML → plain text with newlines so section headings & lists can be detected */
const htmlToPlainForJobDescription = (html) => {
  if (!html) return "";
  // First decode all entities so &rsquo; → ' etc.
  let s = decodeHtmlEntities(String(html));
  // Then convert block-level tags to newlines
  s = s
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/\s*(p|div|h[1-6]|blockquote|section|article)\s*>/gi, "\n\n")
    .replace(/<\s*li[^>]*>/gi, "\n- ")
    .replace(/<\/\s*li\s*>/gi, "\n")
    .replace(/<\/\s*tr\s*>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
  return s
    .replace(/[ \t\f\v]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Longer phrases first so alternation matches the intended heading
const JOB_DESC_SECTION_HEADINGS = [
  // — exact headings seen in your screenshots —
  "Requirements & Responsibilities",
  "Requirements and Responsibilities",
  "Qualifications & Requirements",
  "Qualifications and Requirements",
  "Key Responsibilities",
  "Roles and Responsibilities",
  "Role Responsibilities",
  "Required Qualifications and Experience",
  "Required Qualifications & Experience",
  "Key Competencies",
  "Key Performance Indicators",
  "Application Process",
  "Application Details",
  // — generic headings —
  "Position Overview",
  "About the Role",
  "Role Overview",
  "Job Purpose",
  "What You'll Do",
  "What You Will Do",
  "Education & Experience",
  "Education and Experience",
  "Required Skills",
  "Nice to Have",
  "Benefits & Perks",
  "Benefits",
  "Company Overview",
  "Who We Are",
  "How to Apply",
];

const parseJobDescriptionSections = (rawHtml) => {
  const text = htmlToPlainForJobDescription(rawHtml);
  if (!text) return [];

  const inner = JOB_DESC_SECTION_HEADINGS.map(escapeRegExp).join("|");
  const re = new RegExp(`(?:^|\\n)\\s*(${inner})\\s*:?\\s*(?=\\n|$)`, "gi");
  const matches = [...text.matchAll(re)];

  if (matches.length === 0) {
    return [{ title: null, body: text }];
  }

  const sections = [];
  const preamble = text.slice(0, matches[0].index).trim();
  if (preamble) {
    sections.push({ title: null, body: preamble });
  }

  for (let i = 0; i < matches.length; i++) {
    const title = matches[i][1].replace(/\s+/g, " ").trim();
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
    sections.push({ title, body: text.slice(start, end).trim() });
  }

  return sections;
};


/** Detect "Key: Value" pairs even when they run together without newlines */
const parseDescriptionHeader = (text) => {
  const headerKeys = [
    "Job Title",
    "Location",
    "Employment Type",
    "Reporting To",
    "Department",
    "Contract Type",
    "Salary",
    "Deadline"
  ];

  // Build regex for known keys
  const keyPattern = new RegExp(
    `(${headerKeys.map(k => k.replace(/\s+/g, "\\s+")).join("|")})\\s*:`,
    "gi"
  );

  const matches = [...text.matchAll(keyPattern)];

  if (matches.length === 0) {
    return { headers: [], remainingText: text };
  }

  const headers = [];
  let remainingStart = 0;

  for (let i = 0; i < matches.length; i++) {
    const key = matches[i][1].replace(/\s+/g, " ").trim();

    const valueStart = matches[i].index + matches[i][0].length;

    const valueEnd =
      i + 1 < matches.length
        ? matches[i + 1].index
        : valueStart + text.slice(valueStart).length;

    const value = text.slice(valueStart, valueEnd).trim();

    // Only keep short header-like values
    if (value.length < 120) {
      headers.push({ key, value });
      remainingStart = valueEnd;
    }
  }

  const remainingText = text.slice(remainingStart).trim();

  return { headers, remainingText };
};

// Reuses the same header keys already used by parseDescriptionHeader
const HEADER_KEY_LIST = [
  "Job Title", "Location", "Employment Type", "Reporting To",
  "Department", "Contract Type", "Salary", "Deadline",
];

/** Pull the Location value out of the description text even when there's no colon
 *  separating the label from the value (e.g. "LocationKampala, Uganda"). */
const extractLocationFromDescription = (rawHtml) => {
  const text = htmlToPlainForJobDescription(rawHtml);
  if (!text) return null;

  const keysPattern = HEADER_KEY_LIST.map(escapeRegExp).join("|");
  const re = new RegExp(
    `Location\\s*:?\\s*(.+?)(?=\\s*(?:${keysPattern})\\b|\\n|$)`,
    "i"
  );
  const m = text.match(re);
  if (!m) return null;

  const value = m[1].trim().replace(/[,;\s]+$/, "");
  return value.length > 0 && value.length < 60 ? value : null;
};

/** Turn one section body into alternating prose blocks and bullet lists */
const chunkSectionBody = (body) => {
  if (!body) return [];
  const lines = body.split(/\n/);
  const chunks = [];
  let i = 0;

  while (i < lines.length) {
    while (i < lines.length && !lines[i].trim()) i++;
    if (i >= lines.length) break;

    const bulletOrNum = (line) =>
      /^\s*[-*•▪·]\s+/.test(line) || /^\s*\d+[\.)]\s+/.test(line);

    if (bulletOrNum(lines[i])) {
      const items = [];
      while (i < lines.length) {
        const L = lines[i];
        if (!L.trim()) break;
        const mDash = L.match(/^\s*[-*•▪·]\s+(.*)$/);
        const mNum = L.match(/^\s*\d+[\.)]\s+(.*)$/);
        const raw = mDash ? mDash[1] : mNum ? mNum[1] : null;
        if (raw == null) break;
        items.push(raw.trim());
        i++;
      }
      if (items.length) chunks.push({ type: "list", items });
    } else {
      const paraLines = [];
      while (i < lines.length && lines[i].trim()) {
        if (bulletOrNum(lines[i])) break;
        paraLines.push(lines[i].trim());
        i++;
      }
      if (paraLines.length) chunks.push({ type: "text", text: paraLines.join(" ") });
    }
  }

  return chunks;
};

const JobDescriptionSectionChunks = ({ chunks }) => (
  <>
    {chunks.map((chunk, idx) =>
      chunk.type === "list" ? (
        <ul
          key={idx}
          style={{
            margin: idx === 0 ? "6px 0 0" : "12px 0 0",
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {chunk.items.map((item, j) => (
            <li key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span
                style={{
                  flexShrink: 0,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#e8f1fd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1a6edb",
                  marginTop: 1,
                }}
              >
                <svg viewBox="0 0 16 16" fill="currentColor" width="9" height="9">
                  <path d="M6.293 11.707a1 1 0 010-1.414L8.586 8 6.293 5.707a1 1 0 111.414-1.414l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414 0z" />
                </svg>
              </span>
              <span style={{ fontSize: 13, color: "#3a3a52", lineHeight: 1.65 }}>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p
          key={idx}
          style={{
            fontSize: 13.5,
            color: "#3a3a52",
            lineHeight: 1.75,
            margin: idx === 0 ? 0 : "12px 0 0",
            whiteSpace: "pre-line",
          }}
        >
          {chunk.text}
        </p>
      )
    )}
  </>
);

// ─── Inline SVG icons ─────────────────────────────────────────────────────────
const Ico = {
  profile:  <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/></svg>,
  cv:       <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/></svg>,
  apply:    <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/></svg>,
  apps:     <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/><path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/></svg>,
  saved:    <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/></svg>,
  savedSm:  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/></svg>,
  msg:      <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd"/></svg>,
  location: <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>,
  search:   <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/></svg>,
  close:    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>,
  check:    <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>,
  arrow:    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>,
  brief:    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5z" clipRule="evenodd"/></svg>,
  eye:      <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg>,
  lightning:<svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/></svg>,
};

// ─── Pill filter ──────────────────────────────────────────────────────────────
const Pill = ({ children, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: "6px 16px", borderRadius: 99, fontSize: 12.5, fontWeight: 500,
    cursor: "pointer", border: active ? "none" : "1px solid rgba(0,0,0,0.12)",
    background: active ? "#1a6edb" : "#fff",
    color: active ? "#fff" : "#5a5a72",
    transition: "all 0.18s",
    boxShadow: active ? "0 2px 8px rgba(26,110,219,0.3)" : "none",
  }}>{children}</button>
);

// ─── Full-width Quick Link card ───────────────────────────────────────────────
const QuickLink = ({ icon, label, desc, color, bg, onClick, badge }) => (
  <button onClick={onClick} style={{
    background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.07)",
    padding: "20px 22px 18px", textAlign: "left", cursor: "pointer", width: "100%",
    transition: "box-shadow 0.18s, transform 0.18s, border-color 0.18s",
    position: "relative", display: "flex", flexDirection: "column", gap: 10,
  }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 24px rgba(0,0,0,0.1)`; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = color + "40"; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.07)"; }}
  >
    {badge && (
      <span style={{ position: "absolute", top: 10, right: 12, background: "#ef4444", color: "#fff", borderRadius: 99, fontSize: 10, fontWeight: 700, padding: "1px 7px" }}>{badge}</span>
    )}
    <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 13.5, fontWeight: 650, color: "#1a1a2e", letterSpacing: "-0.01em" }}>{label}</div>
      <div style={{ fontSize: 11.5, color: "#9090a8", marginTop: 3, lineHeight: 1.5 }}>{desc}</div>
    </div>
    <div style={{ marginTop: "auto", color, opacity: 0.6 }}>{Ico.arrow}</div>
  </button>
);

// ─── Skeleton loader ──────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div style={{ background: "#fff", borderRadius: 14, border: "1px solid rgba(0,0,0,0.07)", padding: "20px" }}>
    {[65, 35, 90, 90, 55].map((w, i) => (
      <div key={i} style={{ height: 11, background: "#f4f6fb", borderRadius: 6, width: `${w}%`, marginBottom: 10, animation: "pulse 1.5s ease-in-out infinite", animationDelay: `${i * 0.1}s` }} />
    ))}
    <div style={{ height: 34, width: 100, background: "#f4f6fb", borderRadius: 10, marginTop: 14, animation: "pulse 1.5s ease-in-out infinite" }} />
  </div>
);

// ─── Save Button ─────────────────────────────────────────────────────────────
// Reusable bookmark button used in both JobListCard and JobDetailPanel
const SaveButton = ({ isSaved, onToggle, size = "normal" }) => {
  const isSmall = size === "small";

  return (
    <button
      onClick={e => { e.stopPropagation(); onToggle(); }}
      title={isSaved ? "Remove from saved jobs" : "Save job for later"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: isSmall ? "6px 10px" : "7px 14px",
        borderRadius: 9,
        border: `1.5px solid ${isSaved ? "#fbbf24" : "rgba(0,0,0,0.1)"}`,
        background: isSaved ? "#fef3c7" : "#f4f6fb",
        color: isSaved ? "#d97706" : "#9090a8",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        if (!isSaved) {
          e.currentTarget.style.background = "#e8f1fd";
          e.currentTarget.style.color = "#1a6edb";
          e.currentTarget.style.borderColor = "rgba(26,110,219,0.35)";
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = isSaved ? "#fef3c7" : "#f4f6fb";
        e.currentTarget.style.color = isSaved ? "#d97706" : "#9090a8";
        e.currentTarget.style.borderColor = isSaved ? "#fbbf24" : "rgba(0,0,0,0.1)";
      }}
    >
      {/* Bookmark icon — filled golden when saved, grey outline when not */}
      <svg
        viewBox="0 0 20 20"
        width={isSmall ? 13 : 14}
        height={isSmall ? 13 : 14}
        fill={isSaved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={isSaved ? 0 : 1.8}
      >
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
      </svg>

      {!isSmall && (
        <span>{isSaved ? "Saved ✓" : "Save"}</span>
      )}
    </button>
  );
};

// ─── Job List Card (compact, row-style) ───────────────────────────────────────
// NEW props added: onToggleSave, isSaved
const JobListCard = ({ job, onView, onApply, applyingId, isSelected, onToggleSave, isSaved, isApplied }) => {
  const plainDesc = stripHtml(job.description);
  const preview = plainDesc.length > 120 ? plainDesc.slice(0, 120) + "…" : plainDesc;
  const isApplying = applyingId === job.id;

  return (
    <div onClick={() => onView(job)} style={{
      background: isSelected ? "#f0f5ff" : "#fff",
      borderRadius: 14,
      border: `1.5px solid ${isSelected ? "#1a6edb" : "rgba(0,0,0,0.07)"}`,
      padding: "16px 18px",
      cursor: "pointer",
      transition: "all 0.18s",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      boxShadow: isSelected ? "0 0 0 3px rgba(26,110,219,0.12)" : "none",
    }}
      onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)"; e.currentTarget.style.borderColor = "rgba(26,110,219,0.3)"; }}}
      onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(0,0,0,0.07)"; }}}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 650, color: "#1a1a2e", lineHeight: 1.3, letterSpacing: "-0.01em" }}>{job.title}</div>
          {job.location && (
            <div style={{ fontSize: 11.5, color: "#9090a8", marginTop: 4, display: "flex", alignItems: "center", gap: 3 }}>
              {Ico.location} {job.location}
            </div>
          )}
        </div>
        {/* Status badge */}
        <span style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 600, color: "#065f46", background: "#d1fae5", padding: "3px 8px", borderRadius: 99 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981" }} />
          Open
        </span>
      </div>

      {/* Description preview */}
      <div style={{ fontSize: 12, color: "#6b6b82", lineHeight: 1.55 }}>{preview}</div>

      {/* Footer — Save + View + Apply buttons */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2, gap: 8 }}>
        {/* Left side: Save + View */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
         
          <SaveButton isSaved={isSaved} onToggle={() => onToggleSave(job)} />

          <button
            onClick={e => { e.stopPropagation(); onView(job); }}
            style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#1a6edb", background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 500 }}
          >
            {Ico.eye} View details
          </button>
        </div>

        {/* Right side: Quick Apply */}
        <button
  onClick={e => { e.stopPropagation(); if (!isApplied) onApply(job); }}
  disabled={isApplying || isApplied}
  style={{
    display: "flex", alignItems: "center", gap: 5,
    padding: "7px 16px", borderRadius: 9, fontSize: 12.5, fontWeight: 650,
    background: isApplied ? "#d1fae5" : "#1a6edb",
    color: isApplied ? "#065f46" : "#fff",
    border: isApplied ? "1.5px solid #6ee7b7" : "none",
    cursor: (isApplying || isApplied) ? "default" : "pointer",
    opacity: isApplying ? 0.6 : 1,
    transition: "all 0.2s ease",
  }}
  onMouseEnter={e => { if (!isApplying && !isApplied) e.currentTarget.style.background = "#0d4fa3"; }}
  onMouseLeave={e => { if (!isApplied) e.currentTarget.style.background = "#1a6edb"; }}
>
  {isApplied
    ? <><svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> Applied</>
    : <>{Ico.lightning}{isApplying ? "Applying…" : "Quick Apply"}</>
  }
</button>
      </div>
    </div>
  );
};

// ─── Job Detail Side Panel ────────────────────────────────────────────────────
// NEW props added: onToggleSave, isSaved
const JobDetailPanel = ({ job, onClose, onApply, applyingId, onToggleSave, isSaved, isApplied }) => {
  if (!job) return null;
  const isApplying = applyingId === job.id;

  const raw = job.description || "";
  const descSections = parseJobDescriptionSections(raw);
  const hasDesc = descSections.some((s) => s.body?.trim());

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 40,
      width: "min(520px, 95vw)",
      background: "#fff",
      boxShadow: "-8px 0 40px rgba(0,0,0,0.13)",
      display: "flex", flexDirection: "column",
      animation: "slideIn 0.25s cubic-bezier(0.22,1,0.36,1)",
    }}>
      <style>{`@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>

      {/* Header */}
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(0,0,0,0.07)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#e8f1fd,#dbeafe)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a6edb", flexShrink: 0 }}>
                {Ico.brief}
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#9090a8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Job Opening</div>
                <div style={{ fontSize: 11.5, fontWeight: 500, color: "#5a5a72" }}>AMSOL Careers</div>
              </div>
            </div>

            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: "#1a1a2e", lineHeight: 1.25, margin: 0 }}>{job.title}</h2>

            {/* Meta chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
              {job.location && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, background: "#f4f6fb", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 99, padding: "4px 10px", color: "#5a5a72" }}>
                  {Ico.location} {job.location}
                </span>
              )}
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, background: "#d1fae5", borderRadius: 99, padding: "4px 10px", color: "#065f46", fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                Open
              </span>

              {/* ── SAVE BUTTON in header ── */}
              <SaveButton isSaved={isSaved} onToggle={() => onToggleSave(job)} size="small" />
            </div>
          </div>

          <button onClick={onClose} style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)", background: "#f4f6fb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#5a5a72" }}>
            {Ico.close}
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      {/* Scrollable body */}
<div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
  {hasDesc && (() => {
    // Pull out key:value header lines from the first section
    const firstBody = descSections[0]?.body || "";
    const { headers, remainingText } = parseDescriptionHeader(firstBody);
    const sectionsToRender = headers.length > 0
      ? [{ title: descSections[0].title, body: remainingText }, ...descSections.slice(1)]
      : descSections;

    return (
      <>
        {/* Structured header block */}
        {headers.length > 0 && (
          <div style={{
            background: "#f8f9fc", borderRadius: 12, padding: "14px 16px",
            marginBottom: 22, border: "1px solid rgba(0,0,0,0.07)",
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            {headers.map(({ key, value }) => (
              <div key={key} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#9090a8", minWidth: 130, flexShrink: 0, textTransform: "uppercase", letterSpacing: "0.05em", paddingTop: 1 }}>{key}</span>
                <span style={{ fontSize: 13, color: "#1a1a2e", lineHeight: 1.5 }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Rest of sections */}
        {sectionsToRender.map((sec, si) => {
          if (!sec.body?.trim()) return null;
          const chunks = chunkSectionBody(sec.body);
          if (!chunks.length) return null;
          return (
            <div key={si} style={{ marginBottom: si < sectionsToRender.length - 1 ? 26 : 0 }}>
              {sec.title ? (
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", letterSpacing: "-0.01em", marginBottom: 10, lineHeight: 1.35 }}>
                  {sec.title}
                </div>
              ) : sec.body?.trim() ? (
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9090a8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
                  {descSections.length === 1 ? "About This Role" : "Overview"}
                </div>
              ) : null}
              <JobDescriptionSectionChunks chunks={chunks} />
            </div>
          );
        })}
      </>
    );
  })()}

  {!hasDesc && (
    <div style={{ textAlign: "center", padding: "32px 0", color: "#9090a8" }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
      <div style={{ fontSize: 13 }}>No detailed description available for this role.</div>
    </div>
  )}
</div>

      {/* CTA footer */}
      <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(0,0,0,0.07)", flexShrink: 0, background: "#fafbfd" }}>
       <button
  onClick={() => { if (!isApplied) onApply(job); }}
  disabled={isApplying || isApplied}
  style={{
    width: "100%", padding: "13px", borderRadius: 12,
    border: isApplied ? "1.5px solid #6ee7b7" : "none",
    background: isApplied
      ? "#d1fae5"
      : isApplying
      ? "#93c5fd"
      : "linear-gradient(135deg,#1a6edb,#3b5fc0)",
    color: isApplied ? "#065f46" : "#fff",
    fontSize: 14, fontWeight: 700,
    cursor: (isApplying || isApplied) ? "default" : "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    boxShadow: (isApplying || isApplied) ? "none" : "0 4px 16px rgba(26,110,219,0.35)",
    transition: "all 0.2s ease",
  }}
  onMouseEnter={e => { if (!isApplying && !isApplied) e.currentTarget.style.transform = "scale(1.015)"; }}
  onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
>
  {isApplied ? (
    <><svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> Application Submitted</>
  ) : isApplying ? (
    <>Submitting Application…</>
  ) : (
    <>{Ico.lightning} Quick Apply to This Role</>
  )}
</button>
        <div style={{ textAlign: "center", fontSize: 11.5, color: "#9090a8", marginTop: 8 }}>
          Your saved profile, CV &amp; work experience will be attached automatically
        </div>
      </div>
    </div>
  );
};

// ─── Confirm Apply Modal ──────────────────────────────────────────────────────
const ApplyConfirmModal = ({ job, profile, onConfirm, onClose, loading, error, success, onViewTerms }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  return (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.52)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 16 }}>
    <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 24px 64px rgba(0,0,0,0.2)", width: "100%", maxWidth: 500, overflow: "hidden", animation: "fadeUp 0.22s ease" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {success ? (
        <div style={{ padding: "52px 32px", textAlign: "center" }}>
          <div style={{ width: 68, height: 68, borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#059669" }}>
            <svg viewBox="0 0 20 20" fill="currentColor" width="30" height="30"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
          </div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, color: "#1a1a2e" }}>Application Sent!</div>
          <div style={{ fontSize: 13.5, color: "#6b6b82", marginTop: 8, lineHeight: 1.6 }}>
            Your application for <strong>{job.title}</strong> has been submitted with your profile, CV, and work experience.
          </div>
        </div>
      ) : (
        <>
          <div style={{ padding: "20px 24px 18px", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", letterSpacing: "-0.01em" }}>Confirm Application</div>
              <div style={{ fontSize: 12, color: "#9090a8", marginTop: 2 }}>Everything below will be sent to the employer</div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9090a8", padding: 4 }}>{Ico.close}</button>
          </div>

          <div style={{ padding: "20px 24px", maxHeight: "60vh", overflowY: "auto" }}>
            <div style={{ padding: "12px 16px", background: "linear-gradient(135deg,#f0f5ff,#eef2ff)", borderRadius: 12, marginBottom: 18, display: "flex", alignItems: "center", gap: 12, border: "1px solid rgba(26,110,219,0.12)" }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: "#e8f1fd", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#1a6edb" }}>
                {Ico.brief}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 650, color: "#1a1a2e" }}>{job.title}</div>
                {job.location && <div style={{ fontSize: 12, color: "#5a5a72", marginTop: 2, display: "flex", alignItems: "center", gap: 3 }}>{Ico.location} {job.location}</div>}
              </div>
            </div>

            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9090a8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Your Profile</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[
                ["Name",           [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "—"],
                ["Email",          profile?.email        || "—"],
                ["Phone",          profile?.phoneNumber  || "—"],
                ["Location",       profile?.location     || "—"],
                ["Specialization", profile?.specialization || "—"],
                ["Nationality",    profile?.nationality  || "—"],
              ].map(([k, v]) => (
                <div key={k} style={{ background: "#f8f9fc", borderRadius: 9, padding: "8px 12px" }}>
                  <div style={{ color: "#9090a8", fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k}</div>
                  <div style={{ color: "#1a1a2e", marginTop: 2, fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9090a8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>CV / Resume</div>
            <div style={{ padding: "10px 14px", borderRadius: 10, marginBottom: 16, display: "flex", alignItems: "center", gap: 10, border: `1px solid ${profile?.savedCvName ? "#bbf7d0" : "#fde68a"}`, background: profile?.savedCvName ? "#f0fdf4" : "#fffbeb" }}>
              <span style={{ fontSize: 16 }}>{profile?.savedCvName ? "📄" : "⚠️"}</span>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: profile?.savedCvName ? "#065f46" : "#92400e" }}>
                  {profile?.savedCvName || "No CV uploaded"}
                </div>
                <div style={{ fontSize: 11.5, color: profile?.savedCvName ? "#059669" : "#b45309", marginTop: 1 }}>
                  {profile?.savedCvName ? "Will be attached to this application" : "Upload a CV on your profile for best results"}
                </div>
              </div>
            </div>

            {profile?.workExperience?.filter(w => w.company).length > 0 && (
              <>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: "#9090a8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Work Experience</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                  {profile.workExperience.filter(w => w.company).map((w, i) => (
                    <div key={i} style={{ background: "#f8f9fc", borderRadius: 9, padding: "9px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 7, background: "#e8f1fd", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a6edb", flexShrink: 0 }}>
                        {Ico.brief}
                      </div>
                      <div style={{ flex: 1, overflow: "hidden" }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1a1a2e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.position || "—"}</div>
                        <div style={{ fontSize: 11.5, color: "#5a5a72", marginTop: 1 }}>{w.company}{w.duration ? ` · ${w.duration}` : ""}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {(!profile?.firstName || !profile?.email) && (
              <div style={{ padding: "10px 14px", background: "#fee2e2", borderRadius: 10, border: "1px solid #fecaca", fontSize: 12.5, color: "#991b1b", marginBottom: 8 }}>
                ✕ Profile incomplete — please fill in your name and email before applying.
              </div>
            )}
          {error && (
              <div style={{ padding: "10px 14px", background: "#fee2e2", borderRadius: 10, fontSize: 12.5, color: "#991b1b" }}>{error}</div>
            )}

            {/* ── Terms checkbox ── */}
            <div style={{
              padding: "12px 16px",
              background: "#f8f9fc",
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.08)",
              marginTop: 4,
            }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  style={{
                    width: 16, height: 16, marginTop: 2,
                    accentColor: "#1a6edb", flexShrink: 0, cursor: "pointer"
                  }}
                />
                <span style={{ fontSize: 12, color: "#5a5a72", lineHeight: 1.6 }}>
                  I confirm all information is accurate and consent to AMSOL processing my personal data for recruitment purposes in accordance with the{" "}
                 <button
                    onClick={() => {
                      onClose();
                      if (onViewTerms) onViewTerms();
                    }}
                    style={{
                      color: "#1a6edb", background: "none", border: "none",
                      cursor: "pointer", fontSize: 12, padding: 0,
                      textDecoration: "underline", fontFamily: "inherit"
                    }}
                  >
                    Terms &amp; Conditions
                  </button>
                </span>
              </label>
            </div>

          </div>

          <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(0,0,0,0.07)", display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.12)", background: "transparent", color: "#5a5a72", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              Cancel
            </button>
          <button
              onClick={onConfirm}
              disabled={loading || !profile?.firstName || !profile?.email || !termsAccepted}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "9px 24px", borderRadius: 10,
                background: loading || !profile?.firstName || !profile?.email || !termsAccepted ? "#93c5fd" : "#1a6edb",
                color: "#fff", fontSize: 13, fontWeight: 650, border: "none",
                cursor: loading || !profile?.firstName || !profile?.email || !termsAccepted ? "default" : "pointer",
                boxShadow: "0 3px 12px rgba(26,110,219,0.3)",
              }}
            >
              {Ico.lightning}
              {loading ? "Submitting…" : "Submit Application"}
            </button>
          </div>
        </>
      )}
    </div>
  </div>
    )};

    // ─── Incomplete Profile Modal ─────────────────────────────────────────────────
const IncompleteProfileModal = ({ missingFields, onClose, onGoToProfile }) => (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.52)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 70, padding: 16,
  }}>
    <div style={{
      background: "#fff", borderRadius: 20,
      boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
      width: "100%", maxWidth: 440, overflow: "hidden",
      animation: "fadeUp 0.22s ease",
    }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <div style={{
        padding: "20px 24px 16px",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "#fee2e2", display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg viewBox="0 0 20 20" fill="#ef4444" width="22" height="22">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>
              Profile Incomplete
            </div>
            <div style={{ fontSize: 12, color: "#9090a8", marginTop: 2 }}>
              Please complete your profile before applying
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#9090a8", padding: 4, flexShrink: 0,
          }}
        >
          {Ico.close}
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 24px" }}>
        <div style={{ fontSize: 13, color: "#5a5a72", marginBottom: 14, lineHeight: 1.6 }}>
          The following required fields are missing from your profile:
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {missingFields.map((field, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 10,
              background: "#fff7ed", border: "1px solid #fed7aa",
            }}>
              <span style={{
                width: 20, height: 20, borderRadius: "50%",
                background: "#fee2e2", display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg viewBox="0 0 20 20" fill="#ef4444" width="11" height="11">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </span>
              <span style={{ fontSize: 13, color: "#7c2d12", fontWeight: 500 }}>
                {field}
              </span>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 16, padding: "12px 14px",
          background: "#eff6ff", borderRadius: 10,
          border: "1px solid rgba(26,110,219,0.15)",
          fontSize: 12, color: "#1e40af", lineHeight: 1.6,
        }}>
          💡 <strong>Note:</strong> Only <em>Professional Qualifications &amp; Memberships</em> is optional. All other sections must be filled in.
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: "16px 24px", borderTop: "1px solid rgba(0,0,0,0.07)",
        display: "flex", gap: 10, justifyContent: "flex-end",
      }}>
        <button
          onClick={onClose}
          style={{
            padding: "9px 20px", borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.12)",
            background: "transparent", color: "#5a5a72",
            fontSize: 13, fontWeight: 500, cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onGoToProfile}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 24px", borderRadius: 10,
            background: "#1a6edb", color: "#fff",
            fontSize: 13, fontWeight: 650, border: "none",
            cursor: "pointer",
            boxShadow: "0 3px 12px rgba(26,110,219,0.3)",
          }}
        >
          {Ico.profile} Complete Profile
        </button>
      </div>
    </div>
  </div>
);
// ─── Required profile fields for apply gate ───────────────────────────────────
// ─── Education completeness check ──────────────────────────────────────────
const isEducationEntryComplete = (entry) => {
  if (!entry) return false;
  const hasCore = entry.level && entry.courseName && entry.institution && entry.startDate;
  const hasEnd = entry.currentlyStudying || entry.endDate;
  return !!(hasCore && hasEnd);
};

const isEducationMissing = (profile) => {
  const edu = profile?.academicLevel || [];
  if (!Array.isArray(edu) || edu.length === 0) return true;
  return !edu.some(isEducationEntryComplete);
};

// ─── Required profile fields for apply gate ───────────────────────────────────
const REQUIRED_PROFILE_FIELDS = [
  { key: "firstName",             label: "First Name" },
  { key: "lastName",              label: "Last Name" },
  { key: "email",                 label: "Email" },
  { key: "phoneNumber",           label: "Phone Number" },
  { key: "whatsAppNo",            label: "WhatsApp Number" },
  { key: "nationality",           label: "Nationality" },
  { key: "location",              label: "Current Location" },
  { key: "idNumber",              label: "ID Number" },
  { key: "specialization",        label: "Specialization (Professional Summary)" },
  { key: "highestEducationLevel", label: "Highest Education Level" },
  { key: "educationDetails",      label: "Complete Education Details (Academic Level, Institution, Course Name & Dates)" },
  { key: "savedCvFileId",         label: "Uploaded CV" },
  { key: "workExperience",        label: "Work Experience (at least one entry)" },
];

const checkProfileMissing = (profile) => {
  if (!profile) return REQUIRED_PROFILE_FIELDS.map(f => f.label);
  return REQUIRED_PROFILE_FIELDS
    .filter(({ key }) => {
      if (key === "workExperience") {
        const we = profile[key];
        return !Array.isArray(we) || we.filter(w => w.company).length === 0;
      }
      if (key === "educationDetails") {
        return isEducationMissing(profile);
      }
      const val = profile[key];
      if (Array.isArray(val)) return val.length === 0;
      return !val;
    })
    .map(f => f.label);
};
<style>{`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,wght@0,400;0,600;1,400&display=swap');
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
  .job-section { transition: margin-right 0.3s ease; }

  @media (max-width: 768px) {
    .dash-banner {
      flex-direction: column !important;
      padding: 20px !important;
      gap: 16px !important;
      align-items: flex-start !important;
    }
    .dash-banner-btn {
      width: 100% !important;
      justify-content: center !important;
      padding: 12px !important;
    }
    .dash-quick-links {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 10px !important;
    }
    .job-card-footer {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 8px !important;
    }
    .job-card-footer > div {
      justify-content: space-between !important;
      width: 100% !important;
    }
    .job-card-footer button:last-child {
      width: 100% !important;
      justify-content: center !important;
    }
  }

  @media (max-width: 480px) {
    .dash-quick-links {
      grid-template-columns: repeat(3, 1fr) !important;
      gap: 8px !important;
    }
  }
`}</style>
// ─── Main Dashboard ───────────────────────────────────────────────────────────
const Dashboard = ({ profile, token, onNav, onQuickApply, savedJobIds = new Set(), onToggleSave, onViewTerms }) => {
  const { jobs, loading: jobsLoading, error: jobsError } = useContext(JobContext);

  const [filter, setFilter]           = useState("All");
  const [search, setSearch]           = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyModal, setApplyModal]   = useState(null);
  const [applying, setApplying]       = useState(false);
  const [applyingId, setApplyingId]   = useState(null);
  const [applyError, setApplyError]   = useState("");
  const [applySuccess, setApplySuccess] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [incompleteModal, setIncompleteModal] = useState(false);
const [missingFields, setMissingFields]     = useState([]);
const [appliedIds, setAppliedIds]           = useState(new Set());
const toggleSave = (job) => onToggleSave({ ...job, _id: String(job._id ?? job.id) });
const isJobSaved = (jobId) => savedJobIds.has(String(jobId));
const [disqualifyModal, setDisqualifyModal]     = useState(false);
const [disqualifyMessage, setDisqualifyMessage] = useState("");

  const locations = [...new Set(jobs.map(j => j.location).filter(Boolean))].slice(0, 6);

  const filteredJobs = jobs.filter(job => {
    const matchFilter = filter === "All" || job.location === filter;
    const q = search.toLowerCase();
    const matchSearch = !search ||
      job.title?.toLowerCase().includes(q) ||
      stripHtml(job.description).toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const missingProfile = !profile?.firstName || !profile?.email;
  const missingCv      = !profile?.savedCvFileId;
  const missingExp     = !(profile?.workExperience?.filter(w => w.company).length);
  const missingSummary = !profile?.specialization;
  const firstName      = profile?.firstName || "there";

  // const openApply = (job) => {
  //   setApplyModal({ job });
  //   setApplyError("");
  //   setApplySuccess(false);
  // };
// ─── Experience extraction helper ────────────────────────────────────────────
const extractJobRequirements = (job) => {
  const text = htmlToPlainForJobDescription(job.description || "").toLowerCase();
  const titleText = (job.title || "").toLowerCase();
  const combined = `${titleText}\n${text}`;

  // ── Experience extraction ──────────────────────────────────────────────────
  // Split into lines and skip any line that talks about "years of education"
  // or uses "months" as the unit (e.g. "12 months experience")
  const isEducationYearsLine = (line) =>
    /years?\s+of\s+(formal\s+)?education/.test(line) ||
    /years?\s+of\s+schooling/.test(line);

  const expPatterns = [
    /(?:minimum\s+of|minimum|at\s+least)\s+(\d+)\s*(?:to\s*\d+\s*)?years?(?!\s*of\s*(?:formal\s+)?education)/i,
    /(\d+)\s*[-–]\s*\d+\s*years?\s+(?:of\s+)?(?:experience|exp)/i,
    /(\d+)\+\s*years?\s+(?:of\s+)?(?:experience|exp)/i,
    /(\d+)\s+(?:or\s+more\s+)?years?\s+(?:of\s+)?(?:progressive|proven|relevant|demonstrable|senior)?\s*(?:experience|exp)/i,
    /experience\s*(?:of|:)?\s*(\d+)\s*\+?\s*years?/i,
    /(\d+)\s+years?['']?\s+(?:work|professional|industry|managerial|leadership)\s+experience/i,
  ];

  let minYears = 0;
  const lines = combined.split(/\n/);

  for (const line of lines) {
    // Skip lines about years of education (e.g. "Minimum of 12 years of formal education")
    if (isEducationYearsLine(line)) continue;

    // Skip lines where the number is followed by "month(s)" — not years
    // e.g. "Minimum 12 months experience"
    if (/\d+\s*months?\s+(?:of\s+)?(?:experience|exp)/i.test(line)) continue;
    if (/(?:minimum|at\s+least)\s+\d+\s*months?/i.test(line)) continue;

    for (const pattern of expPatterns) {
      const match = line.match(pattern);
      if (match) {
        const parsed = parseInt(match[1], 10);
        if (!isNaN(parsed)) minYears = Math.max(minYears, parsed);
      }
    }
  }

  // ── Education extraction ───────────────────────────────────────────────────
  // Helper: returns true if a line is "advantage / preferred / optional" language
  const isOptionalEduLine = (line) =>
    /\b(?:added?\s+advantage|advantage|preferred?|desirable|bonus|plus|beneficial|an?\s+asset|ideal(?:ly)?|welcome|nice\s+to\s+have|preferred\s+but\s+not\s+required)\b/.test(line);

  let requiredEdu = null;

  // Check "A or B" patterns on non-optional lines first
  const nonOptionalLines = lines.filter((l) => !isOptionalEduLine(l)).join("\n");

  const certOrDiploma      = /certificate.*or.*diploma|diploma.*or.*certificate/i.test(nonOptionalLines);
  const certOrBachelors    = /certificate.*or.*bachelor|bachelor.*or.*certificate/i.test(nonOptionalLines);
  const certOrMasters      = /certificate.*or.*master|master.*or.*certificate/i.test(nonOptionalLines);
  const diplomaOrBachelors = /diploma.*or.*bachelor|bachelor.*or.*diploma/i.test(nonOptionalLines);
  const diplomaOrMasters   = /diploma.*or.*master|master.*or.*diploma/i.test(nonOptionalLines);
  const mastersOrBachelors = /master.*or.*bachelor|bachelor.*or.*master/i.test(nonOptionalLines);

  if (certOrDiploma || certOrBachelors || certOrMasters) {
    requiredEdu = "certificate";
  } else if (diplomaOrBachelors || diplomaOrMasters) {
    requiredEdu = "diploma";
  } else if (mastersOrBachelors) {
    requiredEdu = "bachelors";
  } else {
    // Single-level checks — only on lines that aren't "added advantage" etc.
    for (const line of lines) {
      if (isOptionalEduLine(line)) continue; // <-- key fix: skip advantage lines
      if (/phd|doctorate|doctoral/i.test(line)) {
        requiredEdu = "phd"; break;
      } else if (/master['']?s?\s+(?:degree|of)|mba|m\.sc|msc|m\.a\b|postgraduate\s+degree/i.test(line)) {
        requiredEdu = "masters"; break;
      } else if (/bachelor['']?s?\s+(?:degree|of)|b\.sc|bsc|b\.a\b|b\.eng|undergraduate\s+degree|degree\s+in|degree\s+is\s+required/i.test(line)) {
        requiredEdu = "bachelors"; break;
      } else if (/higher\s+national\s+diploma|hnd|diploma/i.test(line)) {
        requiredEdu = "diploma"; break;
      } else if (/certificate/i.test(line)) {
        requiredEdu = "certificate"; break;
      }
    }
  }

  return { minYears, requiredEdu };
};

// ─── Country / nationality requirement extraction ─────────────────────────────
const COUNTRY_ALIASES = {
  "Kenya":          ["kenya", "kenyan"],
  "Uganda":         ["uganda", "ugandan"],
  "Tanzania":       ["tanzania", "tanzanian"],
  "Rwanda":         ["rwanda", "rwandan"],
  "Burundi":        ["burundi", "burundian"],
  "South Sudan":    ["south sudan", "south sudanese"],
  "Ethiopia":       ["ethiopia", "ethiopian"],
  "Somalia":        ["somalia", "somali"],
  "DR Congo":       ["democratic republic of congo", "dr congo", "drc", "congolese"],
  "Nigeria":        ["nigeria", "nigerian"],
  "Ghana":          ["ghana", "ghanaian"],
  "South Africa":   ["south africa", "south african"],
  "Zambia":         ["zambia", "zambian"],
  "Malawi":         ["malawi", "malawian"],
  "Mozambique":     ["mozambique", "mozambican"],
  "Zimbabwe":       ["zimbabwe", "zimbabwean"],
  "Egypt":          ["egypt", "egyptian"],
  "United Kingdom": ["united kingdom", "uk", "british"],
  "United States":  ["united states", "usa", "u.s.", "american"],
  "India":          ["india", "indian"],
};

// City → country lookup, since most profiles/job locations use a city, not a country name
const CITY_TO_COUNTRY = {
  "nairobi": "Kenya", "mombasa": "Kenya", "kisumu": "Kenya", "nakuru": "Kenya",
  "eldoret": "Kenya", "thika": "Kenya", "machakos": "Kenya", "nyeri": "Kenya",
  "kampala": "Uganda", "entebbe": "Uganda", "jinja": "Uganda", "mbarara": "Uganda", "gulu": "Uganda",
  "dar es salaam": "Tanzania", "dodoma": "Tanzania", "arusha": "Tanzania", "mwanza": "Tanzania", "zanzibar": "Tanzania",
  "kigali": "Rwanda",
  "bujumbura": "Burundi",
  "juba": "South Sudan",
  "addis ababa": "Ethiopia",
  "mogadishu": "Somalia", "hargeisa": "Somalia",
  "kinshasa": "DR Congo", "goma": "DR Congo", "lubumbashi": "DR Congo",
  "lagos": "Nigeria", "abuja": "Nigeria", "kano": "Nigeria",
  "accra": "Ghana", "kumasi": "Ghana",
  "johannesburg": "South Africa", "cape town": "South Africa", "pretoria": "South Africa", "durban": "South Africa",
  "lusaka": "Zambia",
  "lilongwe": "Malawi", "blantyre": "Malawi",
  "maputo": "Mozambique",
  "harare": "Zimbabwe", "bulawayo": "Zimbabwe",
  "cairo": "Egypt", "alexandria": "Egypt",
  "london": "United Kingdom",
  "new york": "United States",
};

/** Normalize a free-text nationality/location string to a canonical country name.
 *  Tries country/nationality words first, then falls back to known city names. */
const normalizeToCountry = (text) => {
  if (!text) return null;
  const s = String(text).toLowerCase();

  for (const [country, aliases] of Object.entries(COUNTRY_ALIASES)) {
    for (const alias of aliases) {
      const re = new RegExp(`\\b${escapeRegExp(alias)}\\b`, "i");
      if (re.test(s)) return country;
    }
  }
  for (const [city, country] of Object.entries(CITY_TO_COUNTRY)) {
    const re = new RegExp(`\\b${escapeRegExp(city)}\\b`, "i");
    if (re.test(s)) return country;
  }
  return null;
};

/** Determine which country a job requires candidates to be from/based in.
 *  Priority: 1) explicit nationality language in the description,
 *            2) the job's structured `location` field (most job posts imply this). */
const extractJobCountryRequirement = (job) => {
  const text = htmlToPlainForJobDescription(job.description || "").toLowerCase();
  const titleText = (job.title || "").toLowerCase();
  const combined = `${titleText}\n${text}`;

  // Explicit signal — but skip if the post explicitly welcomes any nationality / is remote
const isOpenToAll = /\b(?:fully\s+remote|remote\s+(?:position|role|job|work)|any\s+nationality|open\s+to\s+all\s+nationalities|international\s+applicants\s+welcome)\b/i.test(combined);

  if (!isOpenToAll) {
    for (const [country, aliases] of Object.entries(COUNTRY_ALIASES)) {
      const aliasPattern = aliases.map(escapeRegExp).join("|");
      const patterns = [
        new RegExp(`\\b(?:must\\s+be\\s+(?:a\\s+)?)?(?:${aliasPattern})\\s+(?:national|nationals|citizen|citizens)\\b`, "i"),
        new RegExp(`\\bbased\\s+in\\s+(?:${aliasPattern})\\b`, "i"),
        new RegExp(`\\bresiding\\s+in\\s+(?:${aliasPattern})\\b`, "i"),
        new RegExp(`\\bopen\\s+(?:only\\s+)?to\\s+(?:${aliasPattern})\\s+(?:nationals|citizens|applicants|candidates)\\b`, "i"),
        new RegExp(`\\b(?:${aliasPattern})\\s+(?:candidates|applicants)\\s+only\\b`, "i"),
        new RegExp(`\\b(?:${aliasPattern})\\s+only\\b`, "i"),
      ];
      if (patterns.some((re) => re.test(combined))) return country;
    }
  }

  // Fallback — use the structured job.location field most postings already have
//   if (!isOpenToAll) {
//     const fromLocation = normalizeToCountry(job.location);
//     if (fromLocation) return fromLocation;
//   }

//   return null;
// };
// Fallback — use the structured job.location field, or extract it from the
  // description header block when the location field itself is empty.
  if (!isOpenToAll) {
    const structuredLocation = extractLocationFromDescription(job.description) || job.location;
    const fromLocation = normalizeToCountry(structuredLocation);
    if (fromLocation) return fromLocation;
}

  return null;
};
// ─── Estimate total years of experience from workExperience array ─────────────
const estimateTotalExperience = (workExperience = []) => {
  let total = 0;
  for (const entry of workExperience.filter((w) => w.company)) {
    const dur = (entry.duration || entry.period || "").toLowerCase();

    const yearMatch  = dur.match(/(\d+)\s*(?:yr|year)/i);
    const monthMatch = dur.match(/(\d+)\s*(?:mo|month)/i);
    if (yearMatch || monthMatch) {
      total += yearMatch  ? parseInt(yearMatch[1],  10) : 0;
      total += monthMatch ? parseInt(monthMatch[1], 10) / 12 : 0;
      continue;
    }

    // "Jan 2019 – Mar 2022" or "2019 - 2023"
    const dateRange = dur.match(
      /(\w{3,9}\.?\s+\d{4}|\d{4})\s*[-–—to]+\s*(\w{3,9}\.?\s+\d{4}|\d{4}|present|current|now|date)/i
    );
    if (dateRange) {
      const parseYear = (s) => { const y = s.match(/\d{4}/); return y ? parseInt(y[0], 10) : null; };
      const startYear = parseYear(dateRange[1]);
      const endStr    = dateRange[2];
      const endYear   = /present|current|now|date/i.test(endStr) ? new Date().getFullYear() : parseYear(endStr);
      if (startYear && endYear && endYear >= startYear) { total += endYear - startYear; }
      continue;
    }

    if (/\d{4}/.test(dur)) total += 1; // bare year — conservative 1yr contribution
  }
  return Math.round(total * 10) / 10;
};

// ─── Education rank map ───────────────────────────────────────────────────────
const EDU_RANK = { certificate: 1, diploma: 2, bachelors: 3, masters: 4, phd: 5 };

const rankApplicantEdu = (profile = {}) => {
  // Primary: education array saved by Edit Education modal
  const eduArray = profile?.education || profile?.educationHistory || [];
  if (Array.isArray(eduArray) && eduArray.length > 0) {
    let highest = 0;
    for (const entry of eduArray) {
      const level = (
        entry.academicLevel || entry.level || entry.qualification || entry.degree || ""
      ).toLowerCase();
      if      (/phd|doctorate|doctoral/.test(level))              highest = Math.max(highest, EDU_RANK.phd);
      else if (/master|mba|msc|m\.sc|postgrad/.test(level))       highest = Math.max(highest, EDU_RANK.masters);
      else if (/bachelor|bsc|b\.sc|degree|undergraduate/.test(level)) highest = Math.max(highest, EDU_RANK.bachelors);
      else if (/diploma|hnd|higher national/.test(level))         highest = Math.max(highest, EDU_RANK.diploma);
      else if (/certificate/.test(level))                         highest = Math.max(highest, EDU_RANK.certificate);
    }
    if (highest > 0) return Object.keys(EDU_RANK).find((k) => EDU_RANK[k] === highest) || null;
  }
  // Fallback: legacy highestEducationLevel string
  const s = (profile?.highestEducationLevel || "").toLowerCase();
  if (/phd|doctorate|doctoral/.test(s))               return "phd";
  if (/master|mba|msc|m\.sc|postgraduate/.test(s))    return "masters";
  if (/bachelor|bsc|b\.sc|degree|undergraduate/.test(s)) return "bachelors";
  if (/diploma|hnd/.test(s))                          return "diploma";
  if (/certificate/.test(s))                          return "certificate";
  return null;
};

// ─── Generic qualification checker — returns array of reason strings ──────────
const checkJobQualification = (job, profile) => {
  const { minYears, requiredEdu } = extractJobRequirements(job);
  const reasons = [];

  // Experience check
  if (minYears > 0) {
    const applicantYears = estimateTotalExperience(profile?.workExperience || []);
    if (applicantYears < minYears) {
      reasons.push({
        icon: "⏱️",
        title: "Insufficient Experience",
        body:
          `This role requires at least ${minYears} year${minYears !== 1 ? "s" : ""} of experience. ` +
          `Based on your profile, we could confirm approximately ${
            applicantYears < 1
              ? "less than 1 year"
              : `${Math.floor(applicantYears)} year${Math.floor(applicantYears) !== 1 ? "s" : ""}`
          } of work experience.`,
      });
    }
  }

  // Education check
  if (requiredEdu) {
    const applicantEduKey = rankApplicantEdu(profile);
    const requiredRank    = EDU_RANK[requiredEdu];
    const applicantRank   = applicantEduKey ? EDU_RANK[applicantEduKey] : 0;

    if (applicantRank < requiredRank) {
      const eduLabels = {
        phd:         "a PhD / Doctoral degree",
        masters:     "a Master's degree or MBA",
        bachelors:   "a Bachelor's degree",
        diploma:     "a Higher National Diploma (HND) or equivalent",
        certificate: "a relevant certificate",
      };
      const applicantLabel = applicantEduKey
        ? `Your highest recorded qualification is ${eduLabels[applicantEduKey]}, which does not meet this requirement.`
        : "We could not find a recognised education level on your profile. Please update your Education section.";

      reasons.push({
        icon: "🎓",
        title: "Education Requirement Not Met",
        body: `This role requires ${eduLabels[requiredEdu]}. ${applicantLabel}`,
      });
    }
  }

  // ── Country / nationality check ──────────────────────────────────────────
  const requiredCountry = extractJobCountryRequirement(job);
  console.log("[country-check]", {
    jobTitle: job.title,
    jobLocationField: job.location,
    descriptionLocation: extractLocationFromDescription(job.description),
    requiredCountry,
    profileNationality: profile?.nationality,
    profileLocation: profile?.location,
    homeCounty: profile?.homeCounty,
  });
  if (requiredCountry) {
    const applicantCountry =
      normalizeToCountry(profile?.nationality) ||
      normalizeToCountry(profile?.location) ||
      (profile?.homeCounty ? "Kenya" : null); // homeCounty field implies Kenya

    if (applicantCountry && applicantCountry !== requiredCountry) {
      reasons.push({
        icon: "🌍",
        title: "Location / Nationality Requirement Not Met",
        body:
          `This role requires candidates who are ${requiredCountry} nationals or based in ${requiredCountry}. ` +
          `Your profile indicates you are from/based in ${applicantCountry}, which does not match this requirement.`,
      });
    }
  }

  // Return null (qualifies) or the array of reason objects
  return reasons.length > 0 ? reasons : null;
};
const openApply = (job) => {
  const reasons = checkJobQualification(job, profile);
  if (reasons) {
    setDisqualifyMessage(reasons);   
    setDisqualifyModal(true);
    return;
  }
  const missing = checkProfileMissing(profile);
  if (missing.length > 0) {
    setMissingFields(missing);
    setIncompleteModal(true);
    return;
  }
  setApplyModal({ job });
  setApplyError("");
  setApplySuccess(false);
};

const [applySuccessData, setApplySuccessData] = useState(null);

const submitApplication = async () => {
  if (!applyModal) return;
  setApplying(true);
  setApplyError("");
  setApplyingId(applyModal.job.id);

  try {
    const job = applyModal.job;
    
    // Debug — confirm these are populated before sending
    console.log("job.id:", job.id, "job.title:", job.title);
    console.log("profile.email:", profile?.email);
    console.log("profile.savedCvFileId:", profile?.savedCvFileId);

    const fd = new FormData();

    // ── Three fields your backend explicitly validates ──
    fd.append("email",    String(profile?.email   || "").trim().toLowerCase());
    fd.append("jobId",    String(job.id           || "").trim());  // e.g. "146"
    fd.append("jobTitle", String(job.title        || "").trim());

    // ── Profile fields used by extractProfileUpdate() ──
    fd.append("firstName",    profile?.firstName    || "");
    fd.append("lastName",     profile?.lastName     || "");
    fd.append("secondName",   profile?.secondName   || "");
    fd.append("idNumber",     profile?.idNumber     || "");
    fd.append("PassportNo",   profile?.PassportNo   || "");
    fd.append("whatsAppNo",   profile?.whatsAppNo   || "");
    fd.append("phoneNumber",  profile?.phoneNumber  || "");
    fd.append("nationality",  profile?.nationality  || "");
    fd.append("location",     profile?.location     || "");
    fd.append("homeCounty",   profile?.homeCounty   || "");
    fd.append("salaryInfo",   profile?.salaryInfo   || "");
    fd.append("coverLetter",  "");

    // specialization is String[] in UserProfile
    fd.append("specialization", Array.isArray(profile?.specialization)
      ? profile.specialization.join(", ")
      : profile?.specialization || "");

    // ── CV: backend already falls back to profile.savedCvFileId ──
    // So CV file is optional — only attach if you want to override saved CV
    // If profile.savedCvFileId exists, backend will use it automatically
    // If you want to force-attach it anyway:
    if (!profile?.savedCvFileId) {
      setApplyError("No CV found on your profile. Please upload a CV first.");
      return;
    }

    await api.post(`${API}/applications`, fd, {
  headers: { "Content-Type": "multipart/form-data" },
});


setApplySuccessData({ aiScore: res.data.aiScore, aiVerdict: res.data.aiVerdict });
    setApplySuccess(true);

setAppliedIds(prev => new Set([...prev, String(applyModal.job.id)]));
setTimeout(() => {
  setApplyModal(null);
  setApplySuccess(false);
  setApplyingId(null);
  setApplySuccessData(null);
}, 2800);

  } catch (err) {
    const msg = err.response?.data?.message || "Error submitting. Please try again.";
    setApplyError(msg);
  } finally {
    setApplying(false);
  }
};
 return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,wght@0,400;0,600;1,400&display=swap');
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        .job-section { transition: margin-right 0.3s ease; }

        @media (max-width: 768px) {
          .dash-banner {
            flex-direction: column !important;
            padding: 20px !important;
            gap: 16px !important;
            align-items: flex-start !important;
          }
          .dash-banner-btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 12px !important;
          }
          .dash-quick-links {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 10px !important;
          }
          .job-card-footer {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 8px !important;
          }
          .job-card-footer > div {
            justify-content: space-between !important;
            width: 100% !important;
          }
          .job-card-footer button:last-child {
            width: 100% !important;
            justify-content: center !important;
          }
        }

        @media (max-width: 480px) {
          .dash-quick-links {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
        }
      `}</style>

      {/* ── Welcome banner ── */}
      <div className="dash-banner" style={{
        background: "linear-gradient(135deg, #1054b8 0%, #1a6edb 40%, #4f46e5 100%)",
        borderRadius: 18, padding: "26px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        color: "#fff", overflow: "hidden", position: "relative",
      }}>
        <div style={{ position: "absolute", right: -50, top: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", right: 100, bottom: -80, width: 170, height: 170, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", left: "35%", top: -30, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.7, marginBottom: 6 }}>Welcome back</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 25, fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.01em" }}>Hello, {firstName}!</div>
          <div style={{ fontSize: 13.5, opacity: 0.82, marginTop: 7, maxWidth: 440, lineHeight: 1.55 }}>
            {missingCv
              ? "Upload your CV to start applying to jobs with one click."
              : `${filteredJobs.length} job${filteredJobs.length !== 1 ? "s" : ""} available — apply instantly using your saved profile & CV.`}
          </div>
        </div>
       <button className="dash-banner-btn" 
          onClick={() => {
            const missing = checkProfileMissing(profile);
            if (missing.length > 0) {
              setMissingFields(missing);
              setIncompleteModal(true);
              return;
            }
            setShowFormModal(true);
          }}
          style={{
            flexShrink: 0, padding: "12px 26px", borderRadius: 13,
            background: "#f26722", color: "#fff", border: "none",
            fontSize: 13.5, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 18px rgba(242,103,34,0.45)",
            transition: "transform 0.15s, box-shadow 0.15s",
            display: "flex", alignItems: "center", gap: 7,
            position: "relative",
            zIndex: 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(242,103,34,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(242,103,34,0.45)"; }}
        >
          {Ico.lightning} Apply using form
        </button>
      </div>

      {/* ── Completion alerts ── */}
      {(missingProfile || missingCv || missingExp || missingSummary) && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px,1fr))", gap: 12, animation: "fadeIn 0.3s ease" }}>
          {missingProfile && (
            <div style={{ padding: "14px 16px", background: "#fff7ed", borderRadius: 12, border: "1px solid #fed7aa", display: "flex", gap: 10 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>👤</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 650, color: "#7c2d12" }}>Complete profile</div>
                <div style={{ fontSize: 12, color: "#9a3412", marginTop: 2, lineHeight: 1.5 }}>Add personal details to get found.</div>
                <button onClick={() => onNav("profile")} style={{ marginTop: 7, fontSize: 12, fontWeight: 650, color: "#ea580c", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Go to Profile →</button>
              </div>
            </div>
          )}
          {missingSummary && (
            <div style={{ padding: "14px 16px", background: "#eff6ff", borderRadius: 12, border: "1px solid #bfdbfe", display: "flex", gap: 10 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>📝</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 650, color: "#1e3a8a" }}>Add specialization</div>
                <div style={{ fontSize: 12, color: "#1d4ed8", marginTop: 2, lineHeight: 1.5 }}>Tell employers what role you seek.</div>
                <button onClick={() => onNav("profile")} style={{ marginTop: 7, fontSize: 12, fontWeight: 650, color: "#2563eb", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Add now →</button>
              </div>
            </div>
          )}
          {missingExp && (
            <div style={{ padding: "14px 16px", background: "#f0fdf4", borderRadius: 12, border: "1px solid #bbf7d0", display: "flex", gap: 10 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>💼</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 650, color: "#14532d" }}>Add work experience</div>
                <div style={{ fontSize: 12, color: "#166534", marginTop: 2, lineHeight: 1.5 }}>3× more views with experience.</div>
                <button onClick={() => onNav("profile")} style={{ marginTop: 7, fontSize: 12, fontWeight: 650, color: "#16a34a", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Add experience →</button>
              </div>
            </div>
          )}
          {missingCv && (
            <div style={{ padding: "14px 16px", background: "#fefce8", borderRadius: 12, border: "1px solid #fef08a", display: "flex", gap: 10 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>📄</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 650, color: "#713f12" }}>Upload your CV</div>
                <div style={{ fontSize: 12, color: "#92400e", marginTop: 2, lineHeight: 1.5 }}>Required for Quick Apply.</div>
                <button onClick={() => onNav("cv")} style={{ marginTop: 7, fontSize: 12, fontWeight: 650, color: "#d97706", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Upload CV →</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Quick Links ── */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#9090a8", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>Quick Links</div>
        <div  className="dash-quick-links" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
          <QuickLink icon={Ico.profile} label="My Profile"   desc="View & edit details"      color="#1a6edb" bg="#e8f1fd"  onClick={() => onNav("profile")} />
          <QuickLink icon={Ico.cv}      label="Uploaded CV"  desc="Manage your CV file"      color="#7c3aed" bg="#ede9fe"  onClick={() => onNav("cv")} />
          {/* <QuickLink icon={Ico.apply}   label="Quick Apply"  desc="1-click applications"     color="#f26722" bg="#fff0e8"  onClick={onQuickApply} /> */}
          <QuickLink icon={Ico.apps}    label="Applications" desc="Track your submissions"   color="#0d9488" bg="#ccfbf1"  onClick={() => onNav("applications")} badge="" />
          {/* Saved Jobs quick link — shows count badge when jobs are saved */}
          <QuickLink
            icon={Ico.saved}
            label="Saved Jobs"
            desc="Jobs you bookmarked"
            color="#d97706"
            bg="#fef3c7"
            onClick={() => onNav("saved")}
            badge={savedJobIds.size > 0 ? savedJobIds.size : undefined}
          />
          <QuickLink icon={Ico.msg}     label="Messages"     desc="Recruiter conversations"  color="#6366f1" bg="#eef2ff"  onClick={() => onNav("messages")} />
        </div>
      </div>

      {/* ── Job Listings ── */}
      <div style={{ display: "flex", gap: 0, position: "relative" }}>
        <div style={{ flex: 1, minWidth: 0, transition: "all 0.3s ease", marginRight: selectedJob ? 540 : 0 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9090a8", textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Available Jobs
              {!jobsLoading && (
                <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 500, color: "#b0b0c0", textTransform: "none", letterSpacing: 0 }}>
                  — {filteredJobs.length} listing{filteredJobs.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9090a8", pointerEvents: "none" }}>{Ico.search}</span>
              <input
                type="text" placeholder="Search jobs…" value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                  borderRadius: 10, border: "1px solid rgba(0,0,0,0.12)",
                  fontSize: 13, color: "#1a1a2e", background: "#fff",
                  outline: "none", width: 210,
                  transition: "border-color 0.18s, box-shadow 0.18s",
                }}
                onFocus={e => { e.target.style.borderColor = "#1a6edb"; e.target.style.boxShadow = "0 0 0 3px rgba(26,110,219,0.12)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(0,0,0,0.12)"; e.target.style.boxShadow = "none"; }}
              />
            </div>
          </div>

          {locations.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {["All", ...locations].map(loc => (
                <Pill key={loc} active={filter === loc} onClick={() => setFilter(loc)}>{loc}</Pill>
              ))}
            </div>
          )}

          {jobsLoading ? (
            <div style={{ display: "grid", gridTemplateColumns: selectedJob ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
              {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : jobsError ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#9090a8" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>⚠️</div>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>Could not load jobs. Please try again later.</div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#9090a8" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>🔍</div>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>No jobs match your search</div>
              <button onClick={() => { setSearch(""); setFilter("All"); }}
                style={{ marginTop: 10, fontSize: 13, color: "#1a6edb", background: "none", border: "none", cursor: "pointer" }}>
                Clear filters
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: selectedJob ? "1fr" : "repeat(auto-fill, minmax(300px, 1fr))", gap: 12, animation: "fadeIn 0.2s ease" }}>
              {filteredJobs.map(job => (
               <JobListCard
  key={job.id}
  job={job}
  onView={(j) => setSelectedJob(prev => prev?.id === j.id ? null : j)}
  onApply={openApply}
  applyingId={applyingId}
  isSelected={selectedJob?.id === job.id}
  onToggleSave={toggleSave}
  isSaved={isJobSaved(job.id)}
  isApplied={appliedIds.has(String(job.id))}
/>
              ))}
            </div>
          )}
        </div>

        {selectedJob && (
          <>
            <div
              onClick={() => setSelectedJob(null)}
              style={{ position: "fixed", inset: 0, zIndex: 39, background: "transparent" }}
            />
            <JobDetailPanel
  job={selectedJob}
  onClose={() => setSelectedJob(null)}
  onApply={openApply}
  applyingId={applyingId}
  onToggleSave={toggleSave}
  isSaved={isJobSaved(selectedJob.id)}
  isApplied={appliedIds.has(String(selectedJob.id))}
/>
          </>
        )}
      </div>

     {applyModal && (
        <ApplyConfirmModal
          job={applyModal.job}
          profile={profile}
          onConfirm={submitApplication}
          onClose={() => { setApplyModal(null); setApplyingId(null); setApplyError(""); }}
          loading={applying}
          error={applyError}
          success={applySuccess}
          onViewTerms={onViewTerms}
        />
      )}
      {incompleteModal && (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.52)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 70, padding: 16,
  }}>
    <div style={{
      background: "#fff", borderRadius: 20,
      boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
      width: "100%", maxWidth: 440, overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 24px 16px",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "#fee2e2", display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <svg viewBox="0 0 20 20" fill="#ef4444" width="22" height="22">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>
              Profile Incomplete
            </div>
            <div style={{ fontSize: 12, color: "#9090a8", marginTop: 2 }}>
              Please complete your profile before applying
            </div>
          </div>
        </div>
        <button onClick={() => setIncompleteModal(false)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#9090a8", padding: 4 }}>
          {Ico.close}
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 24px" }}>
        <div style={{ fontSize: 13, color: "#5a5a72", marginBottom: 14, lineHeight: 1.6 }}>
          These required fields are missing from your profile:
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {missingFields.map((field, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 10,
              background: "#fff7ed", border: "1px solid #fed7aa",
            }}>
              <span style={{
                width: 20, height: 20, borderRadius: "50%",
                background: "#fee2e2", display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg viewBox="0 0 20 20" fill="#ef4444" width="11" height="11">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </span>
              <span style={{ fontSize: 13, color: "#7c2d12", fontWeight: 500 }}>{field}</span>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: 16, padding: "12px 14px",
          background: "#eff6ff", borderRadius: 10,
          border: "1px solid rgba(26,110,219,0.15)",
          fontSize: 12, color: "#1e40af", lineHeight: 1.6,
        }}>
          💡 <strong>Note:</strong> Only <em>Professional Qualifications &amp; Memberships</em> is optional. Everything else must be filled in.
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: "16px 24px", borderTop: "1px solid rgba(0,0,0,0.07)",
        display: "flex", gap: 10, justifyContent: "flex-end",
      }}>
        <button onClick={() => setIncompleteModal(false)}
          style={{
            padding: "9px 20px", borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.12)",
            background: "transparent", color: "#5a5a72",
            fontSize: 13, fontWeight: 500, cursor: "pointer",
          }}>
          Cancel
        </button>
        <button onClick={() => { setIncompleteModal(false); onNav("profile"); }}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 24px", borderRadius: 10,
            background: "#1a6edb", color: "#fff",
            fontSize: 13, fontWeight: 650, border: "none", cursor: "pointer",
            boxShadow: "0 3px 12px rgba(26,110,219,0.3)",
          }}>
          Go to Profile →
        </button>
      </div>
    </div>
  </div>
)}
{disqualifyModal && (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 70, padding: 16,
  }}>
    <div style={{
      background: "#fff", borderRadius: 20,
      boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
      width: "100%", maxWidth: 460, overflow: "hidden",
      animation: "fadeUp 0.22s ease",
    }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <div style={{
        padding: "20px 24px 16px", borderBottom: "1px solid rgba(0,0,0,0.07)",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fee2e2",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg viewBox="0 0 20 20" fill="#ef4444" width="22" height="22">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>Not Eligible to Apply</div>
            <div style={{ fontSize: 12, color: "#9090a8", marginTop: 2 }}>
              Your profile does not meet the requirements for this role
            </div>
          </div>
        </div>
        <button onClick={() => setDisqualifyModal(false)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#9090a8", padding: 4 }}>
          {Ico.close}
        </button>
      </div>

      {/* Body — one card per failing requirement */}
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {Array.isArray(disqualifyMessage) && disqualifyMessage.map((reason, i) => (
          <div key={i} style={{
            borderRadius: 12, border: "1px solid #fecaca",
            background: "#fff5f5", padding: "14px 16px",
            display: "flex", gap: 12, alignItems: "flex-start",
          }}>
            <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{reason.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#991b1b", marginBottom: 4 }}>
                {reason.title}
              </div>
              <div style={{ fontSize: 12.5, color: "#7f1d1d", lineHeight: 1.65 }}>
                {reason.body}
              </div>
            </div>
          </div>
        ))}

        <div style={{
          marginTop: 4, padding: "12px 14px", background: "#eff6ff",
          borderRadius: 10, border: "1px solid rgba(26,110,219,0.15)",
          fontSize: 12, color: "#1e40af", lineHeight: 1.6,
        }}>
          💡 We encourage you to apply for other roles that match your current qualifications. Your profile has been saved.
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: "16px 24px", borderTop: "1px solid rgba(0,0,0,0.07)",
        display: "flex", gap: 10, justifyContent: "flex-end",
      }}>
        <button onClick={() => setDisqualifyModal(false)}
          style={{ padding: "9px 20px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.12)",
            background: "transparent", color: "#5a5a72", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
          Close
        </button>
        <button onClick={() => { setDisqualifyModal(false); }}
          style={{ padding: "9px 24px", borderRadius: 10, background: "#1a6edb", color: "#fff",
            fontSize: 13, fontWeight: 650, border: "none", cursor: "pointer",
            boxShadow: "0 3px 12px rgba(26,110,219,0.3)" }}>
          Browse Other Jobs
        </button>
      </div>
    </div>
  </div>
)}
      {showFormModal && (

<div
  style={{
    position: "fixed", inset: 0, zIndex: 80,
  background: "rgba(0,0,0,0.6)",
  display: "flex", alignItems: "flex-start", justifyContent: "center",
  padding: "10px 16px",
  overflowY: "auto",
  fontFamily: "'DM Sans', sans-serif",
  }}
    onClick={(e) => { if (e.target === e.currentTarget) setShowFormModal(false); }}
  >
 <div style={{
  background: "#fff", borderRadius: 16,
  width: "100%", maxWidth: 860,
  minHeight: "90vh",
  position: "relative",
  boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 13,
}}>
      {/* Close button */}
      <button
        onClick={() => setShowFormModal(false)}
        style={{
          position: "sticky", top: 12, right: 12, float: "right",
          zIndex: 10, width: 32, height: 32, borderRadius: 8,
          border: "1px solid rgba(0,0,0,0.1)", background: "#f4f6fb",
          cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", color: "#5a5a72", margin: "12px 12px 0 0",
        }}
      >
        {Ico.close}
      </button>

      <FormLayout onClose={() => setShowFormModal(false)} />
    </div>
  </div>
)}
    </div>
  );
};

export { ApplyConfirmModal };
export default Dashboard;