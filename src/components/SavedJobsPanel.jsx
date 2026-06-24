import { useState } from "react";
import api from "./../../api/axiosInstance";

const API = "/api";

// ─── Helpers ───────────────────────────────────────────────────────────────────
const isExpired = (job) => {
  if (!job.deadline) return false;
  return new Date(job.deadline) < new Date();
};

const formatMoney = (value) => {
  if (value == null) return null;
  return Number(value).toLocaleString();
};

const formatDate = (value) => {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ─── Icons ─────────────────────────────────────────────────────────────────────
const Ico = {
  lightning: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  ),
  brief: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5z" clipRule="evenodd" />
      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
    </svg>
  ),
  doc: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  ),
  location: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="11" height="11">
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
  ),
};

// ─── Required profile fields ───────────────────────────────────────────────────
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
  { key: "savedCvFileId",         label: "Uploaded CV" },
  { key: "workExperience",        label: "Work Experience (at least one entry)" },
];

const checkProfileMissing = (profile) => {
  if (!profile) return REQUIRED_PROFILE_FIELDS.map((f) => f.label);
  return REQUIRED_PROFILE_FIELDS.filter(({ key }) => {
    if (key === "workExperience") {
      const we = profile[key];
      return !Array.isArray(we) || we.filter((w) => w.company).length === 0;
    }
    const val = profile[key];
    if (Array.isArray(val)) return val.length === 0;
    return !val;
  }).map((f) => f.label);
};

// ─── Qualification checking ────────────────────────────────────────────────────
const htmlToPlainText = (html) => {
  if (!html) return "";
  let s = html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/\s*(p|div|h[1-6]|blockquote|section|article)\s*>/gi, "\n\n")
    .replace(/<\s*li[^>]*>/gi, "\n- ")
    .replace(/<\/\s*li\s*>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
  return s.replace(/[ \t\f\v]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").trim();
};

const EDU_RANK = { certificate: 1, diploma: 2, bachelors: 3, masters: 4, phd: 5 };

const extractJobRequirements = (job) => {
  const text = htmlToPlainText(job.description || "").toLowerCase();
  const combined = `${(job.title || "").toLowerCase()}\n${text}`;
  const lines = combined.split(/\n/);
  const isEduLine = (l) => /years?\s+of\s+(formal\s+)?education|years?\s+of\s+schooling/.test(l);
  const expPatterns = [
    /(?:minimum\s+of|minimum|at\s+least)\s+(\d+)\s*(?:to\s*\d+\s*)?years?(?!\s*of\s*(?:formal\s+)?education)/i,
    /(\d+)\s*[-–]\s*\d+\s*years?\s+(?:of\s+)?(?:experience|exp)/i,
    /(\d+)\+\s*years?\s+(?:of\s+)?(?:experience|exp)/i,
    /(\d+)\s+(?:or\s+more\s+)?years?\s+(?:of\s+)?(?:progressive|proven|relevant|demonstrable|senior)?\s*(?:experience|exp)/i,
    /experience\s*(?:of|:)?\s*(\d+)\s*\+?\s*years?/i,
    /(\d+)\s+years?['']?\s+(?:work|professional|industry|managerial|leadership)\s+experience/i,
  ];
  let minYears = 0;
  for (const line of lines) {
    if (isEduLine(line)) continue;
    if (/\d+\s*months?\s+(?:of\s+)?(?:experience|exp)/i.test(line)) continue;
    if (/(?:minimum|at\s+least)\s+\d+\s*months?/i.test(line)) continue;
    for (const pattern of expPatterns) {
      const m = line.match(pattern);
      if (m) { const p = parseInt(m[1], 10); if (!isNaN(p)) minYears = Math.max(minYears, p); }
    }
  }
  const isOptional = (l) =>
    /\b(?:added?\s+advantage|advantage|preferred?|desirable|bonus|plus|beneficial|an?\s+asset|ideal(?:ly)?|welcome|nice\s+to\s+have|preferred\s+but\s+not\s+required)\b/.test(l);
  let requiredEdu = null;
  const nonOpt = lines.filter((l) => !isOptional(l)).join("\n");
  if (/certificate.*or.*diploma|diploma.*or.*certificate/i.test(nonOpt))       requiredEdu = "certificate";
  else if (/certificate.*or.*bachelor|bachelor.*or.*certificate/i.test(nonOpt)) requiredEdu = "certificate";
  else if (/diploma.*or.*bachelor|bachelor.*or.*diploma/i.test(nonOpt))         requiredEdu = "diploma";
  else if (/master.*or.*bachelor|bachelor.*or.*master/i.test(nonOpt))           requiredEdu = "bachelors";
  else {
    for (const line of lines) {
      if (isOptional(line)) continue;
      if (/phd|doctorate|doctoral/i.test(line))                                              { requiredEdu = "phd";       break; }
      else if (/master['']?s?\s+(?:degree|of)|mba|m\.sc|msc|postgraduate\s+degree/i.test(line)) { requiredEdu = "masters";    break; }
      else if (/bachelor['']?s?\s+(?:degree|of)|b\.sc|bsc|b\.a\b|b\.eng|undergraduate\s+degree|degree\s+in|degree\s+is\s+required/i.test(line)) { requiredEdu = "bachelors";  break; }
      else if (/higher\s+national\s+diploma|hnd|diploma/i.test(line))                       { requiredEdu = "diploma";    break; }
      else if (/certificate/i.test(line))                                                     { requiredEdu = "certificate"; break; }
    }
  }
  return { minYears, requiredEdu };
};

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
    const dr = dur.match(/(\w{3,9}\.?\s+\d{4}|\d{4})\s*[-–—to]+\s*(\w{3,9}\.?\s+\d{4}|\d{4}|present|current|now|date)/i);
    if (dr) {
      const py = (s) => { const y = s.match(/\d{4}/); return y ? parseInt(y[0], 10) : null; };
      const sy = py(dr[1]);
      const ey = /present|current|now|date/i.test(dr[2]) ? new Date().getFullYear() : py(dr[2]);
      if (sy && ey && ey >= sy) total += ey - sy;
      continue;
    }
    if (/\d{4}/.test(dur)) total += 1;
  }
  return Math.round(total * 10) / 10;
};

const rankApplicantEdu = (profile = {}) => {
  const arr = profile?.education || profile?.educationHistory || [];
  if (Array.isArray(arr) && arr.length > 0) {
    let highest = 0;
    for (const e of arr) {
      const l = (e.academicLevel || e.level || e.qualification || e.degree || "").toLowerCase();
      if (/phd|doctorate|doctoral/.test(l))                    highest = Math.max(highest, EDU_RANK.phd);
      else if (/master|mba|msc|m\.sc|postgrad/.test(l))        highest = Math.max(highest, EDU_RANK.masters);
      else if (/bachelor|bsc|b\.sc|degree|undergraduate/.test(l)) highest = Math.max(highest, EDU_RANK.bachelors);
      else if (/diploma|hnd|higher national/.test(l))           highest = Math.max(highest, EDU_RANK.diploma);
      else if (/certificate/.test(l))                           highest = Math.max(highest, EDU_RANK.certificate);
    }
    if (highest > 0) return Object.keys(EDU_RANK).find((k) => EDU_RANK[k] === highest) || null;
  }
  const s = (profile?.highestEducationLevel || "").toLowerCase();
  if (/phd|doctorate|doctoral/.test(s))                 return "phd";
  if (/master|mba|msc|m\.sc|postgraduate/.test(s))      return "masters";
  if (/bachelor|bsc|b\.sc|degree|undergraduate/.test(s)) return "bachelors";
  if (/diploma|hnd/.test(s))                            return "diploma";
  if (/certificate/.test(s))                            return "certificate";
  return null;
};

const checkJobQualification = (job, profile) => {
  const { minYears, requiredEdu } = extractJobRequirements(job);
  const reasons = [];
  if (minYears > 0) {
    const applicantYears = estimateTotalExperience(profile?.workExperience || []);
    if (applicantYears < minYears) {
      reasons.push({
        icon: "⏱️",
        title: "Insufficient Experience",
        body: `This role requires at least ${minYears} year${minYears !== 1 ? "s" : ""} of experience. Based on your profile, we could confirm approximately ${applicantYears < 1 ? "less than 1 year" : `${Math.floor(applicantYears)} year${Math.floor(applicantYears) !== 1 ? "s" : ""}`} of work experience.`,
      });
    }
  }
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
      reasons.push({
        icon: "🎓",
        title: "Education Requirement Not Met",
        body: `This role requires ${eduLabels[requiredEdu]}. ${applicantEduKey ? `Your highest recorded qualification is ${eduLabels[applicantEduKey]}, which does not meet this requirement.` : "We could not find a recognised education level on your profile. Please update your Education section."}`,
      });
    }
  }
  return reasons.length > 0 ? reasons : null;
};

// ─── Section label ─────────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9090a8", marginBottom: 8 }}>
    {children}
  </div>
);

// ─── ApplyConfirmModal (inlined) ───────────────────────────────────────────────
const ApplyConfirmModal = ({ job, profile, onConfirm, onClose, loading, error, success, onViewTerms }) => {
  const [termsAccepted, setTermsAccepted] = useState(false);

  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "—";
  const canSubmit = !loading && !!profile?.firstName && !!profile?.email && termsAccepted;

  if (success) {
    return (
      <div style={ms.overlay}>
        <div style={{ ...ms.modal, maxWidth: 460 }}>
          <div style={{ padding: "52px 32px", textAlign: "center" }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", color: "#059669" }}>
              <svg viewBox="0 0 20 20" fill="currentColor" width="30" height="30"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            </div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: "#1a1a2e" }}>Application Sent!</div>
            <div style={{ fontSize: 13.5, color: "#6b6b82", marginTop: 10, lineHeight: 1.65 }}>
              Your application for <strong>{job.title}</strong> has been submitted with your profile, CV, and work experience.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={ms.overlay}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={ms.modal}>

        {/* Header */}
        <div style={ms.header}>
          <div>
            <div style={ms.headerTitle}>Confirm Application</div>
            <div style={ms.headerSub}>Everything below will be sent to the employer</div>
          </div>
          <button onClick={onClose} style={ms.closeBtn}>{Ico.close}</button>
        </div>

        {/* Scrollable body */}
        <div style={ms.body}>

          {/* Job card — blue gradient */}
          <div style={ms.jobCard}>
            <div style={ms.jobIcon}>{Ico.brief}</div>
            <span style={ms.jobTitle}>{job.title}</span>
            {job.location && (
              <span style={ms.jobLocation}>{Ico.location}&nbsp;{job.location}</span>
            )}
          </div>

          {/* YOUR PROFILE */}
          <SectionLabel>Your Profile</SectionLabel>
          <div style={ms.profileGrid}>
            {[
              ["Name",           fullName],
              ["Email",          profile?.email        || "—"],
              ["Phone",          profile?.phoneNumber  || "—"],
              ["Location",       profile?.location     || "—"],
              ["Specialization", Array.isArray(profile?.specialization) ? profile.specialization.join(", ") : profile?.specialization || "—"],
              ["Nationality",    profile?.nationality  || "—"],
            ].map(([label, value]) => (
              <div key={label} style={ms.profileCell}>
                <div style={ms.profileCellLabel}>{label}</div>
                <div style={ms.profileCellValue}>{value}</div>
              </div>
            ))}
          </div>

          {/* CV / RESUME */}
          <SectionLabel>CV / Resume</SectionLabel>
          {profile?.savedCvName ? (
            <div style={ms.cvCardGreen}>
              <div style={ms.cvIcon}>{Ico.doc}</div>
              <div>
                <div style={ms.cvName}>{profile.savedCvName}</div>
                <div style={ms.cvSub}>Will be attached to this application</div>
              </div>
            </div>
          ) : (
            <div style={ms.cvCardAmber}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#92400e" }}>No CV uploaded</div>
                <div style={{ fontSize: 11.5, color: "#b45309", marginTop: 2 }}>Upload a CV on your profile for best results</div>
              </div>
            </div>
          )}

          {/* WORK EXPERIENCE */}
          {profile?.workExperience?.filter((w) => w.company).length > 0 && (
            <>
              <SectionLabel>Work Experience</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                {profile.workExperience.filter((w) => w.company).map((w, i) => (
                  <div key={i} style={ms.expRow}>
                    <div style={ms.expIcon}>{Ico.brief}</div>
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <div style={ms.expPosition}>{w.position || "—"}</div>
                      <div style={ms.expMeta}>
                        {w.company}{w.duration ? ` · ${w.duration}` : ""}{w.period ? ` · ${w.period}` : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Incomplete warning */}
          {(!profile?.firstName || !profile?.email) && (
            <div style={ms.errorBanner}>✕ Profile incomplete — please fill in your name and email before applying.</div>
          )}

          {/* API error */}
          {error && <div style={ms.errorBanner}>{error}</div>}

          {/* Terms checkbox */}
          <div style={ms.termsBox}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                style={{ width: 16, height: 16, marginTop: 2, accentColor: "#1a6edb", flexShrink: 0, cursor: "pointer" }}
              />
              <span style={{ fontSize: 12.5, color: "#5a5a72", lineHeight: 1.65 }}>
                I confirm all information is accurate and consent to AMSOL processing my personal data for recruitment purposes in accordance with the{" "}
                <button
                  onClick={() => { onClose(); if (onViewTerms) onViewTerms(); }}
                  style={{ color: "#1a6edb", background: "none", border: "none", cursor: "pointer", fontSize: 12.5, padding: 0, textDecoration: "underline", fontFamily: "inherit" }}
                >
                  Terms &amp; Conditions
                </button>
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div style={ms.footer}>
          <button onClick={onClose} style={ms.cancelBtn}>Cancel</button>
          <button
            onClick={onConfirm}
            disabled={!canSubmit}
            style={{ ...ms.submitBtn, background: canSubmit ? "#1a6edb" : "#93c5fd", cursor: canSubmit ? "pointer" : "default", boxShadow: canSubmit ? "0 4px 14px rgba(26,110,219,0.35)" : "none" }}
          >
            {Ico.lightning}
            {loading ? "Submitting…" : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal styles object
const ms = {
  overlay:          { position: "fixed", inset: 0, background: "rgba(0,0,0,0.52)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 16 },
  modal:            { background: "#fff", borderRadius: 20, boxShadow: "0 24px 64px rgba(0,0,0,0.2)", width: "100%", maxWidth: 520, overflow: "hidden", animation: "fadeUp 0.22s ease", display: "flex", flexDirection: "column", maxHeight: "90vh" },
  header:           { padding: "20px 24px 16px", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 },
  headerTitle:      { fontSize: 16, fontWeight: 700, color: "#1a1a2e", letterSpacing: "-0.01em" },
  headerSub:        { fontSize: 12, color: "#9090a8", marginTop: 3 },
  closeBtn:         { width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)", background: "#f4f6fb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#5a5a72", flexShrink: 0 },
  body:             { flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 0 },
  jobCard:          { background: "linear-gradient(135deg,#e8f1fd 0%,#dbeafe 100%)", border: "1px solid rgba(26,110,219,0.14)", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, marginBottom: 20 },
  jobIcon:          { width: 36, height: 36, borderRadius: 9, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a6edb", flexShrink: 0, boxShadow: "0 1px 4px rgba(26,110,219,0.15)" },
  jobTitle:         { fontSize: 14.5, fontWeight: 700, color: "#1a3a6e", flex: 1, letterSpacing: "-0.01em" },
  jobLocation:      { fontSize: 11.5, color: "#4b72b0", display: "flex", alignItems: "center", gap: 3, flexShrink: 0 },
  profileGrid:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 },
  profileCell:      { background: "#f8f9fc", borderRadius: 9, padding: "9px 12px" },
  profileCellLabel: { fontSize: 10, fontWeight: 700, color: "#9090a8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 },
  profileCellValue: { fontSize: 12.5, color: "#1a1a2e", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  cvCardGreen:      { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: "#f0fdf4", border: "1px solid #bbf7d0", marginBottom: 20 },
  cvIcon:           { width: 34, height: 34, borderRadius: 8, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", color: "#16a34a", flexShrink: 0 },
  cvName:           { fontSize: 13, fontWeight: 600, color: "#14532d" },
  cvSub:            { fontSize: 11.5, color: "#16a34a", marginTop: 2 },
  cvCardAmber:      { display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: "#fffbeb", border: "1px solid #fde68a", marginBottom: 20 },
  expRow:           { background: "#f8f9fc", borderRadius: 10, padding: "10px 13px", display: "flex", alignItems: "center", gap: 10 },
  expIcon:          { width: 30, height: 30, borderRadius: 8, background: "#e8f1fd", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a6edb", flexShrink: 0 },
  expPosition:      { fontSize: 12.5, fontWeight: 600, color: "#1a1a2e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  expMeta:          { fontSize: 11.5, color: "#5a5a72", marginTop: 2 },
  errorBanner:      { padding: "10px 14px", background: "#fee2e2", borderRadius: 10, border: "1px solid #fecaca", fontSize: 12.5, color: "#991b1b", marginBottom: 14 },
  termsBox:         { padding: "12px 14px", background: "#f8f9fc", borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)", marginTop: 4 },
  footer:           { padding: "16px 24px", borderTop: "1px solid rgba(0,0,0,0.07)", display: "flex", gap: 10, justifyContent: "flex-end", flexShrink: 0, background: "#fafbfd" },
  cancelBtn:        { padding: "9px 22px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.12)", background: "transparent", color: "#5a5a72", fontSize: 13, fontWeight: 500, cursor: "pointer" },
  submitBtn:        { display: "flex", alignItems: "center", gap: 7, padding: "9px 24px", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 650, border: "none", transition: "all 0.2s ease" },
};

// ─── Disqualify Modal (inlined) ────────────────────────────────────────────────
const DisqualifyModal = ({ reasons, onClose }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 70, padding: 16 }}>
    <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 24px 64px rgba(0,0,0,0.22)", width: "100%", maxWidth: 460, overflow: "hidden", animation: "fadeUp 0.22s ease" }}>
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg viewBox="0 0 20 20" fill="#ef4444" width="22" height="22"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>Not Eligible to Apply</div>
            <div style={{ fontSize: 12, color: "#9090a8", marginTop: 2 }}>Your profile does not meet the requirements for this role</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9090a8", padding: 4 }}>{Ico.close}</button>
      </div>
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {reasons.map((reason, i) => (
          <div key={i} style={{ borderRadius: 12, border: "1px solid #fecaca", background: "#fff5f5", padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{reason.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#991b1b", marginBottom: 4 }}>{reason.title}</div>
              <div style={{ fontSize: 12.5, color: "#7f1d1d", lineHeight: 1.65 }}>{reason.body}</div>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 4, padding: "12px 14px", background: "#eff6ff", borderRadius: 10, border: "1px solid rgba(26,110,219,0.15)", fontSize: 12, color: "#1e40af", lineHeight: 1.6 }}>
          💡 We encourage you to apply for other roles that match your current qualifications.
        </div>
      </div>
      <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(0,0,0,0.07)", display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={{ padding: "9px 24px", borderRadius: 10, background: "#1a6edb", color: "#fff", fontSize: 13, fontWeight: 650, border: "none", cursor: "pointer", boxShadow: "0 3px 12px rgba(26,110,219,0.3)" }}>Close</button>
      </div>
    </div>
  </div>
);

// ─── Incomplete Profile Modal (inlined) ────────────────────────────────────────
const IncompleteModal = ({ missingFields, onClose, onGoToProfile }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.52)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 70, padding: 16 }}>
    <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 24px 64px rgba(0,0,0,0.2)", width: "100%", maxWidth: 440, overflow: "hidden", animation: "fadeUp 0.22s ease" }}>
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg viewBox="0 0 20 20" fill="#ef4444" width="22" height="22"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>Profile Incomplete</div>
            <div style={{ fontSize: 12, color: "#9090a8", marginTop: 2 }}>Please complete your profile before applying</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9090a8", padding: 4 }}>{Ico.close}</button>
      </div>
      <div style={{ padding: "20px 24px" }}>
        <div style={{ fontSize: 13, color: "#5a5a72", marginBottom: 14, lineHeight: 1.6 }}>The following required fields are missing:</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {missingFields.map((field, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "#fff7ed", border: "1px solid #fed7aa" }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg viewBox="0 0 20 20" fill="#ef4444" width="11" height="11"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </span>
              <span style={{ fontSize: 13, color: "#7c2d12", fontWeight: 500 }}>{field}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: "12px 14px", background: "#eff6ff", borderRadius: 10, border: "1px solid rgba(26,110,219,0.15)", fontSize: 12, color: "#1e40af", lineHeight: 1.6 }}>
          💡 <strong>Note:</strong> Only <em>Professional Qualifications &amp; Memberships</em> is optional. All other sections must be filled in.
        </div>
      </div>
      <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(0,0,0,0.07)", display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button onClick={onClose} style={{ padding: "9px 20px", borderRadius: 10, border: "1px solid rgba(0,0,0,0.12)", background: "transparent", color: "#5a5a72", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Cancel</button>
        <button onClick={onGoToProfile} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 24px", borderRadius: 10, background: "#1a6edb", color: "#fff", fontSize: 13, fontWeight: 650, border: "none", cursor: "pointer", boxShadow: "0 3px 12px rgba(26,110,219,0.3)" }}>
          {Ico.profile} Complete Profile
        </button>
      </div>
    </div>
  </div>
);

// ─── SavedJobsPanel ────────────────────────────────────────────────────────────
// Props: savedJobs, loading, onUnsave, profile, onNav, onViewTerms
export const SavedJobsPanel = ({ savedJobs, loading, onUnsave, profile, onNav, onViewTerms }) => {
  const activeJobs  = savedJobs.filter((job) => !isExpired(job));
  const expiredJobs = savedJobs.filter((job) => isExpired(job));

  const [applyModal,      setApplyModal]      = useState(null);
  const [applying,        setApplying]        = useState(false);
  const [applyingId,      setApplyingId]      = useState(null);
  const [applyError,      setApplyError]      = useState("");
  const [applySuccess,    setApplySuccess]    = useState(false);
  const [appliedIds,      setAppliedIds]      = useState(new Set());
  const [disqualifyModal, setDisqualifyModal] = useState(false);
  const [disqualifyMsg,   setDisqualifyMsg]   = useState([]);
  const [incompleteModal, setIncompleteModal] = useState(false);
  const [missingFields,   setMissingFields]   = useState([]);

  const openApply = (job) => {
    const reasons = checkJobQualification(job, profile);
    if (reasons) { setDisqualifyMsg(reasons); setDisqualifyModal(true); return; }
    const missing = checkProfileMissing(profile);
    if (missing.length > 0) { setMissingFields(missing); setIncompleteModal(true); return; }
    setApplyModal({ job });
    setApplyError("");
    setApplySuccess(false);
  };

  const submitApplication = async () => {
    if (!applyModal) return;
    setApplying(true);
    setApplyError("");
    const job   = applyModal.job;
    const jobId = String(job.id || job._id || "").trim();
    setApplyingId(jobId);
    try {
      if (!profile?.savedCvFileId) { setApplyError("No CV found on your profile. Please upload a CV first."); return; }
      const fd = new FormData();
      fd.append("email",          String(profile?.email   || "").trim().toLowerCase());
      fd.append("jobId",          jobId);
      fd.append("jobTitle",       String(job.title        || "").trim());
      fd.append("firstName",      profile?.firstName      || "");
      fd.append("lastName",       profile?.lastName       || "");
      fd.append("secondName",     profile?.secondName     || "");
      fd.append("idNumber",       profile?.idNumber       || "");
      fd.append("PassportNo",     profile?.PassportNo     || "");
      fd.append("whatsAppNo",     profile?.whatsAppNo     || "");
      fd.append("phoneNumber",    profile?.phoneNumber    || "");
      fd.append("nationality",    profile?.nationality    || "");
      fd.append("location",       profile?.location       || "");
      fd.append("homeCounty",     profile?.homeCounty     || "");
      fd.append("salaryInfo",     profile?.salaryInfo     || "");
      fd.append("coverLetter",    "");
      fd.append("specialization", Array.isArray(profile?.specialization) ? profile.specialization.join(", ") : profile?.specialization || "");
      await api.post(`${API}/applications`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setApplySuccess(true);
      setAppliedIds((prev) => new Set([...prev, jobId]));
      setTimeout(() => { setApplyModal(null); setApplySuccess(false); setApplyingId(null); }, 2800);
    } catch (err) {
      setApplyError(err.response?.data?.message || "Error submitting. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  const isApplied   = (job) => appliedIds.has(String(job._id ?? job.id));
  const isApplying_ = (job) => applyingId === String(job._id ?? job.id);

  // Loading skeleton
  if (loading) {
    return (
      <div className="p-8">
        <div className="grid gap-4">
          <div style={{ height: 190, borderRadius: 24, background: "radial-gradient(circle at top right,rgba(59,130,246,0.14),transparent 28%),linear-gradient(135deg,#f8fbff,#eef4ff)", border: "1px solid rgba(59,130,246,0.14)", animation: "pulse 1.5s ease-in-out infinite" }} />
          <div className="grid lg:grid-cols-2 gap-4">
            {[1, 2].map((i) => <div key={i} style={{ height: 170, borderRadius: 20, background: "#f8fafc", border: "1px solid rgba(0,0,0,0.06)", animation: "pulse 1.5s ease-in-out infinite" }} />)}
          </div>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}`}</style>
      </div>
    );
  }

  // Empty state
  if (!savedJobs.length) {
    return (
      <div className="p-8">
        <div style={{ background: "radial-gradient(circle at top right,rgba(245,158,11,0.18),transparent 28%),linear-gradient(135deg,#fffdf8,#fff7e8)", border: "1px solid rgba(245,158,11,0.18)", borderRadius: 24, padding: 32, textAlign: "center" }}>
          <div className="w-16 h-16 rounded-[18px] bg-white mx-auto flex items-center justify-center shadow-sm">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.6"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
          </div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 26, color: "#1a1a2e", marginTop: 18 }}>Your saved roles will show up here</h2>
          <p className="text-[#6b7280] text-sm max-w-[460px] mx-auto mt-3 leading-7">Bookmark interesting openings while browsing jobs. This space stays calm and easy to scan so you can return later without losing track.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col gap-6">
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}`}</style>

      {/* Hero banner */}
      <div style={{ borderRadius: 24, padding: 24, background: "radial-gradient(circle at top right,rgba(245,158,11,0.18),transparent 30%),linear-gradient(135deg,#0f172a 0%,#334155 56%,#1f2937 100%)", color: "#fff", boxShadow: "0 18px 40px rgba(15,23,42,0.12)" }}>
        <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-white/70">Saved jobs</div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, lineHeight: 1.15, marginTop: 10 }}>Keep strong opportunities in one focused space</h2>
        <p className="text-sm text-white/80 leading-7 mt-3 max-w-[680px]">Active roles stay front and center, while expired ones move into a lighter archive so the page feels modern, breathable, and easy to use.</p>
        <div className="flex flex-wrap gap-3 mt-5">
          <span className="px-3 py-2 rounded-full bg-white/10 border border-white/15 text-xs font-semibold">{savedJobs.length} saved total</span>
          <span className="px-3 py-2 rounded-full bg-white/10 border border-white/15 text-xs font-semibold">{activeJobs.length} active</span>
          <span className="px-3 py-2 rounded-full bg-white/10 border border-white/15 text-xs font-semibold">{expiredJobs.length} expired</span>
        </div>
      </div>

      {/* Active jobs */}
      {activeJobs.length > 0 && (
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#9090a8]">Ready to act</div>
            <h3 className="text-[#1a1a2e] font-semibold text-[22px] mt-1">Active saved jobs</h3>
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            {activeJobs.map((job) => {
              const applied  = isApplied(job);
              const applying = isApplying_(job);
              return (
                <div key={job._id} className="bg-white rounded-[22px] p-5 border border-[rgba(0,0,0,0.07)] shadow-sm flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#1a1a2e] text-[16px] leading-6">{job.title}</h3>
                      {job.category_id && <p className="text-[#9090a8] text-sm mt-1">{job.category_id.category_name}</p>}
                    </div>
                    {applied ? (
                      <span className="text-[11px] font-semibold text-[#065f46] bg-[#d1fae5] px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1">{Ico.check} Applied</span>
                    ) : (
                      <span className="text-[11px] font-semibold text-[#166534] bg-[#ecfdf3] px-3 py-1 rounded-full whitespace-nowrap">Open</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.salary_range && (
                      <span className="px-3 py-1.5 rounded-full bg-[#e8f1fd] text-[#1a6edb] text-xs font-semibold">
                        KES {formatMoney(job.salary_range.min)} – {formatMoney(job.salary_range.max)}
                      </span>
                    )}
                    {job.deadline && (
                      <span className="px-3 py-1.5 rounded-full bg-[#f8fafc] text-[#64748b] text-xs font-semibold">
                        Deadline {formatDate(job.deadline)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => { if (!applied && !applying) openApply(job); }}
                      disabled={applied || applying}
                      style={{
                        flex: 1, padding: "10px 0", borderRadius: 12,
                        border: applied ? "1.5px solid #6ee7b7" : "none",
                        background: applied ? "#d1fae5" : applying ? "#93c5fd" : "linear-gradient(135deg,#1a6edb,#3b5fc0)",
                        color: applied ? "#065f46" : "#fff",
                        fontSize: 13, fontWeight: 700,
                        cursor: (applied || applying) ? "default" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        boxShadow: (applied || applying) ? "none" : "0 4px 14px rgba(26,110,219,0.3)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {applied ? <>{Ico.check} Applied</> : applying ? <>Applying…</> : <>{Ico.lightning} Quick Apply</>}
                    </button>
                    <button onClick={() => onUnsave(job)} className="py-2.5 px-4 rounded-xl border border-[rgba(0,0,0,0.1)] text-sm font-semibold text-[#64748b] hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition">
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expired jobs */}
      {expiredJobs.length > 0 && (
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#9090a8]">Archive</div>
            <h3 className="text-[#1a1a2e] font-semibold text-[20px] mt-1">Expired saved jobs</h3>
          </div>
          <div className="grid gap-3">
            {expiredJobs.map((job) => (
              <div key={job._id} className="bg-white rounded-xl p-4 border border-red-100 opacity-75 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-[#1a1a2e] text-sm">{job.title}</h3>
                    {job.category_id && <p className="text-[#9090a8] text-xs mt-0.5">{job.category_id.category_name}</p>}
                  </div>
                  <span className="text-[10px] font-medium text-red-400 bg-red-50 px-2 py-0.5 rounded-full whitespace-nowrap">Expired</span>
                </div>
                {job.deadline && <p className="text-xs text-red-400">Closed: {formatDate(job.deadline)}</p>}
                <button onClick={() => onUnsave(job)} className="py-1.5 px-3 rounded-lg border text-xs font-medium transition border-[rgba(0,0,0,0.1)] text-[#9090a8] hover:bg-[#f4f6fb] w-fit">Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
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
      {disqualifyModal && <DisqualifyModal reasons={disqualifyMsg} onClose={() => setDisqualifyModal(false)} />}
      {incompleteModal && (
        <IncompleteModal
          missingFields={missingFields}
          onClose={() => setIncompleteModal(false)}
          onGoToProfile={() => { setIncompleteModal(false); onNav?.("profile"); }}
        />
      )}
    </div>
  );
};