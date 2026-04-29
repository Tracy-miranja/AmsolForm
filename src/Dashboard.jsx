import { useState, useContext } from "react";
import api from "../api/axiosInstance";
import { JobContext } from "./JobContext";
import FormLayout from "./Formlayout";

const API = "/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const stripHtml = (html) => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
};

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
        gap: 4,
        padding: isSmall ? "7px 10px" : "8px 14px",
        borderRadius: 9,
        border: `1.5px solid ${isSaved ? "#fde68a" : "rgba(0,0,0,0.1)"}`,
        background: isSaved ? "#fef3c7" : "#f4f6fb",
        color: isSaved ? "#d97706" : "#9090a8",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.18s",
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = isSaved ? "#fde68a" : "#e8f1fd";
        e.currentTarget.style.color = isSaved ? "#b45309" : "#1a6edb";
        e.currentTarget.style.borderColor = isSaved ? "#fcd34d" : "rgba(26,110,219,0.3)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = isSaved ? "#fef3c7" : "#f4f6fb";
        e.currentTarget.style.color = isSaved ? "#d97706" : "#9090a8";
        e.currentTarget.style.borderColor = isSaved ? "#fde68a" : "rgba(0,0,0,0.1)";
      }}
    >
      {Ico.savedSm}
      {!isSmall && (isSaved ? "Saved" : "Save")}
    </button>
  );
};

// ─── Job List Card (compact, row-style) ───────────────────────────────────────
// NEW props added: onToggleSave, isSaved
const JobListCard = ({ job, onView, onApply, applyingId, isSelected, onToggleSave, isSaved }) => {
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
          onClick={e => { e.stopPropagation(); onApply(job); }}
          disabled={isApplying}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "7px 16px", borderRadius: 9, fontSize: 12.5, fontWeight: 650,
            background: "#1a6edb", color: "#fff", border: "none",
            cursor: isApplying ? "default" : "pointer",
            opacity: isApplying ? 0.6 : 1, transition: "background 0.15s",
          }}
          onMouseEnter={e => { if (!isApplying) e.currentTarget.style.background = "#0d4fa3"; }}
          onMouseLeave={e => { if (!isApplying) e.currentTarget.style.background = "#1a6edb"; }}
        >
          {Ico.lightning}
          {isApplying ? "Applying…" : "Quick Apply"}
        </button>
      </div>
    </div>
  );
};

// ─── Job Detail Side Panel ────────────────────────────────────────────────────
// NEW props added: onToggleSave, isSaved
const JobDetailPanel = ({ job, onClose, onApply, applyingId, onToggleSave, isSaved }) => {
  if (!job) return null;
  const isApplying = applyingId === job.id;

  const raw = job.description || "";
  const liItems = [...raw.matchAll(/<li[^>]*>(.*?)<\/li>/gis)].map(m => stripHtml(m[1]));
  const bodyText = stripHtml(raw.replace(/<ul[\s\S]*?<\/ul>/gi, "").replace(/<ol[\s\S]*?<\/ol>/gi, ""));

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
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {bodyText && (
          <div style={{ marginBottom: liItems.length > 0 ? 20 : 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9090a8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>About This Role</div>
            <p style={{ fontSize: 13.5, color: "#3a3a52", lineHeight: 1.75, margin: 0, whiteSpace: "pre-line" }}>
              {bodyText}
            </p>
          </div>
        )}

        {liItems.length > 0 && (
          <div style={{ marginTop: bodyText ? 0 : 4 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9090a8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
              {bodyText ? "Requirements & Responsibilities" : "About This Role"}
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {liItems.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ flexShrink: 0, width: 18, height: 18, borderRadius: "50%", background: "#e8f1fd", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a6edb", marginTop: 1 }}>
                    <svg viewBox="0 0 16 16" fill="currentColor" width="9" height="9"><path d="M6.293 11.707a1 1 0 010-1.414L8.586 8 6.293 5.707a1 1 0 111.414-1.414l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414 0z"/></svg>
                  </span>
                  <span style={{ fontSize: 13, color: "#3a3a52", lineHeight: 1.65 }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!bodyText && liItems.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#9090a8" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
            <div style={{ fontSize: 13 }}>No detailed description available for this role.</div>
          </div>
        )}
      </div>

      {/* CTA footer */}
      <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(0,0,0,0.07)", flexShrink: 0, background: "#fafbfd" }}>
        <button
          onClick={() => onApply(job)}
          disabled={isApplying}
          style={{
            width: "100%", padding: "13px", borderRadius: 12, border: "none",
            background: isApplying ? "#93c5fd" : "linear-gradient(135deg,#1a6edb,#3b5fc0)",
            color: "#fff", fontSize: 14, fontWeight: 700, cursor: isApplying ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: isApplying ? "none" : "0 4px 16px rgba(26,110,219,0.35)",
            transition: "transform 0.15s",
          }}
          onMouseEnter={e => { if (!isApplying) e.currentTarget.style.transform = "scale(1.015)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; }}
        >
          {Ico.lightning}
          {isApplying ? "Submitting Application…" : "Quick Apply to This Role"}
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
const toggleSave = (job) => onToggleSave(job);
const isJobSaved = (jobId) => savedJobIds.has(jobId);

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

  const openApply = (job) => {
    setApplyModal({ job });
    setApplyError("");
    setApplySuccess(false);
  };

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

    setApplySuccess(true);
    setTimeout(() => {
      setApplyModal(null);
      setApplySuccess(false);
      setApplyingId(null);
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
      `}</style>

      {/* ── Welcome banner ── */}
      <div style={{
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
        <button onClick={() => setShowFormModal(true)} style={{
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
          <QuickLink icon={Ico.profile} label="My Profile"   desc="View & edit details"      color="#1a6edb" bg="#e8f1fd"  onClick={() => onNav("profile")} />
          <QuickLink icon={Ico.cv}      label="Uploaded CV"  desc="Manage your CV file"      color="#7c3aed" bg="#ede9fe"  onClick={() => onNav("cv")} />
          <QuickLink icon={Ico.apply}   label="Quick Apply"  desc="1-click applications"     color="#f26722" bg="#fff0e8"  onClick={onQuickApply} />
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
                  // ── NEW props for save functionality ──
                  onToggleSave={toggleSave}
                  isSaved={isJobSaved(job.id)}
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
              // ── NEW props for save functionality ──
              onToggleSave={toggleSave}
              isSaved={isJobSaved(selectedJob.id)}
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