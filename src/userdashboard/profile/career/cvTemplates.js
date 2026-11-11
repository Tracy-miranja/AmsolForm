// CV templates. All are single-column (ATS-safe) and use only simple HTML + inline-able CSS,
// so the same HTML works for the on-screen preview, "Save as PDF" and Word.

export const TEMPLATES = [
  { id: "modern", name: "Modern", desc: "Clean, accent-colour headings" },
  { id: "classic", name: "Classic", desc: "Traditional serif, centred header" },
  { id: "minimal", name: "Minimal", desc: "Light and spacious" },
  { id: "executive", name: "Executive", desc: "Bold name, strong header rule" },
];

export const ACCENTS = [
  { value: "#1a6edb", name: "Blue" },
  { value: "#0f766e", name: "Teal" },
  { value: "#1f2937", name: "Charcoal" },
  { value: "#9f1239", name: "Burgundy" },
];

const arr = (v) => (Array.isArray(v) ? v : []);
const str = (v) => (typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim());

export function normalizeCv(raw = {}) {
  return {
    name: str(raw.name), headline: str(raw.headline), email: str(raw.email), phone: str(raw.phone),
    location: str(raw.location), links: arr(raw.links).map(str).filter(Boolean),
    summary: str(raw.summary),
    skills: arr(raw.skills).map(str).filter(Boolean),
    experience: arr(raw.experience).map((e) => ({
      position: str(e.position), company: str(e.company), location: str(e.location),
      startDate: str(e.startDate), endDate: str(e.endDate), bullets: arr(e.bullets).map(str).filter(Boolean),
    })).filter((e) => e.position || e.company),
    education: arr(raw.education).map((e) => ({
      qualification: str(e.qualification), institution: str(e.institution),
      startDate: str(e.startDate), endDate: str(e.endDate), details: str(e.details),
    })).filter((e) => e.qualification || e.institution),
    certifications: arr(raw.certifications).map((c) => ({ name: str(c.name), issuer: str(c.issuer), date: str(c.date) })).filter((c) => c.name),
    memberships: arr(raw.memberships).map(str).filter(Boolean),
  };
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// Escape, then highlight [placeholders] such as [add figure] so the user can't miss them
const t = (s) => esc(s).replace(/\[[^\]]{1,40}\]/g, (m) => `<span class="ph">${m}</span>`);
const range = (a, b) => [a, b].filter(Boolean).join(" – ");

function css(template, accent) {
  const base = `
@page { size: A4; margin: 14mm; }
* { box-sizing: border-box; }
html { background: #fff; }
body { margin: 0 auto; padding: 28px 36px; max-width: 820px; color: #1f2937; font-size: 10.5pt; line-height: 1.45; }
h1, h2, p, ul { margin: 0; padding: 0; }
ul { margin: 3px 0 0 18px; }
li { margin: 2px 0; }
p { margin: 2px 0; }
.job { margin-top: 9px; page-break-inside: avoid; }
.t { font-weight: bold; }
.c { color: #4b5563; }
.contact { margin-top: 4px; color: #4b5563; font-size: 10pt; }
.hl { margin-top: 2px; font-size: 11.5pt; color: #374151; }
.ph { background: #fff3a3; }
@media print { body { padding: 0; max-width: none; } .ph { background: #fff3a3; -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`;

  const variants = {
    modern: `
body { font-family: Calibri, Arial, Helvetica, sans-serif; }
h1 { font-size: 25pt; color: ${accent}; }
h2 { margin-top: 15px; padding-left: 8px; border-left: 4px solid ${accent}; font-size: 11.5pt; color: ${accent}; text-transform: uppercase; letter-spacing: 1px; }
h2 + * { margin-top: 5px; }`,
    classic: `
body { font-family: Georgia, 'Times New Roman', serif; }
.head { text-align: center; }
h1 { font-size: 23pt; color: #111827; }
h2 { margin-top: 15px; padding-bottom: 2px; border-bottom: 1px solid ${accent}; font-size: 11pt; color: #111827; text-transform: uppercase; letter-spacing: 1.5px; }
h2 + * { margin-top: 5px; }`,
    minimal: `
body { font-family: 'Helvetica Neue', Arial, sans-serif; }
h1 { font-size: 22pt; color: #111827; }
h2 { margin-top: 20px; font-size: 9pt; color: ${accent}; text-transform: uppercase; letter-spacing: 3px; }
h2 + * { margin-top: 6px; }
.job { margin-top: 11px; }`,
    executive: `
body { font-family: Arial, Helvetica, sans-serif; }
.head { padding-bottom: 8px; border-bottom: 4px solid ${accent}; }
h1 { font-size: 24pt; color: #111827; text-transform: uppercase; letter-spacing: 3px; }
h2 { margin-top: 15px; font-size: 10pt; color: ${accent}; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; }
h2 + * { margin-top: 5px; }`,
  };
  return base + (variants[template] || variants.modern);
}

export function buildCvHtml(cvIn, { template = "modern", accent = "#1a6edb" } = {}) {
  const cv = normalizeCv(cvIn);
  const contact = [cv.email, cv.phone, cv.location, ...cv.links].filter(Boolean).map(esc).join(" &nbsp;|&nbsp; ");
  const sec = (title, body) => (body ? `<h2>${title}</h2>${body}` : "");

  const exp = cv.experience.map((e) => {
    const line = [e.company, e.location].filter(Boolean).map(t).join(", ");
    const d = range(e.startDate, e.endDate);
    return `<div class="job"><div class="t">${t(e.position)}</div>` +
      `<div class="c">${line}${line && d ? " &nbsp;|&nbsp; " : ""}${esc(d)}</div>` +
      (e.bullets.length ? `<ul>${e.bullets.map((b) => `<li>${t(b)}</li>`).join("")}</ul>` : "") + `</div>`;
  }).join("");

  const edu = cv.education.map((e) => {
    const d = range(e.startDate, e.endDate);
    return `<div class="job"><div class="t">${t(e.qualification)}</div>` +
      `<div class="c">${t(e.institution)}${e.institution && d ? " &nbsp;|&nbsp; " : ""}${esc(d)}</div>` +
      (e.details ? `<p>${t(e.details)}</p>` : "") + `</div>`;
  }).join("");

  const certs = cv.certifications.map((c) =>
    `<p>${t(c.name)}${c.issuer ? ` — ${t(c.issuer)}` : ""}${c.date ? ` (${esc(c.date)})` : ""}</p>`).join("");

  const body =
    `<div class="head"><h1>${t(cv.name || "Your Name")}</h1>` +
    (cv.headline ? `<div class="hl">${t(cv.headline)}</div>` : "") +
    (contact ? `<div class="contact">${contact}</div>` : "") + `</div>` +
    sec("Professional Summary", cv.summary ? `<p>${t(cv.summary)}</p>` : "") +
    sec("Skills", cv.skills.length ? `<p>${cv.skills.map(t).join(" &bull; ")}</p>` : "") +
    sec("Work Experience", exp) +
    sec("Education", edu) +
    sec("Certifications", certs) +
    sec("Professional Memberships", cv.memberships.length ? `<ul>${cv.memberships.map((m) => `<li>${t(m)}</li>`).join("")}</ul>` : "");

  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${esc(cv.name || "CV")}</title><style>${css(template, accent)}</style></head><body>${body}</body></html>`;
}

export function cvToText(cvIn) {
  const cv = normalizeCv(cvIn);
  const L = [];
  L.push(cv.name, cv.headline, [cv.email, cv.phone, cv.location, ...cv.links].filter(Boolean).join(" | "), "");
  if (cv.summary) L.push("PROFESSIONAL SUMMARY", cv.summary, "");
  if (cv.skills.length) L.push("SKILLS", cv.skills.join(", "), "");
  if (cv.experience.length) {
    L.push("WORK EXPERIENCE");
    cv.experience.forEach((e) => {
      L.push(e.position, [[e.company, e.location].filter(Boolean).join(", "), range(e.startDate, e.endDate)].filter(Boolean).join(" | "));
      e.bullets.forEach((b) => L.push(`- ${b}`));
      L.push("");
    });
  }
  if (cv.education.length) {
    L.push("EDUCATION");
    cv.education.forEach((e) => L.push(e.qualification, [e.institution, range(e.startDate, e.endDate)].filter(Boolean).join(" | "), e.details, ""));
  }
  if (cv.certifications.length) L.push("CERTIFICATIONS", ...cv.certifications.map((c) => [c.name, c.issuer, c.date].filter(Boolean).join(" - ")), "");
  if (cv.memberships.length) L.push("PROFESSIONAL MEMBERSHIPS", ...cv.memberships.map((m) => `- ${m}`));
  return L.filter((x, i, a) => x !== undefined && !(x === "" && a[i - 1] === "")).join("\n").trim();
}
