// CV templates. All are single-column (ATS-safe) and use only simple HTML + inline-able CSS,
// so the same HTML works for the on-screen preview, "Save as PDF" and Word.

export const TEMPLATES = [
  { id: "professional", name: "Professional", tags: ["two", "photo"], layout: "sidebar", photo: true },
  { id: "split", name: "Split", tags: ["two"], layout: "sidebar", light: true },
  { id: "portrait", name: "Portrait", tags: ["ats", "photo"], photo: true },
  { id: "modern", name: "Modern", tags: ["ats"] },
  { id: "classic", name: "Classic", tags: ["ats"] },
  { id: "traditional", name: "Traditional", tags: ["ats"] },
  { id: "focus", name: "Focus", tags: ["ats"], skillsGrid: true },
  { id: "academic", name: "Academic", tags: ["ats"], datesLeft: true },
  { id: "executive", name: "Executive", tags: ["ats"] },
  { id: "minimal", name: "Minimal", tags: ["ats", "onepage"] },
  { id: "compact", name: "Compact", tags: ["ats", "onepage"] },
];

export const FILTERS = [
  { id: "all", label: "All" },
  { id: "ats", label: "ATS-safe" },
  { id: "two", label: "Two column" },
  { id: "photo", label: "With photo" },
  { id: "onepage", label: "One page" },
];

export const ACCENTS = [
  { value: "#1a6edb", name: "Blue" },
  { value: "#0f766e", name: "Teal" },
  { value: "#166534", name: "Green" },
  { value: "#1e3a8a", name: "Navy" },
  { value: "#5b21b6", name: "Purple" },
  { value: "#9f1239", name: "Burgundy" },
  { value: "#9a3412", name: "Rust" },
  { value: "#1f2937", name: "Charcoal" },
];

export const PLACEHOLDER_PHOTO = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#cbd5e1"/><circle cx="50" cy="38" r="18" fill="#94a3b8"/><path d="M14 100c0-22 16-38 36-38s36 16 36 38z" fill="#94a3b8"/></svg>',
);

const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
};
const safeHex = (c) => (/^#[0-9a-f]{6}$/i.test(c) ? c : "#1a6edb");

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

function sidebarCss(accent, sideBg, sideFg, sideHead) {
  return `
@page { size: A4; margin: 10mm; }
body { padding: 0; max-width: 820px; font-family: Calibri, Arial, Helvetica, sans-serif; }
table.lay { width: 100%; height: 1020px; }
td.side { width: 33%; vertical-align: top; background-color: ${sideBg}; color: ${sideFg}; padding: 26px 16px; }
td.main { vertical-align: top; padding: 26px 22px; }
.avatar { text-align: center; margin-bottom: 16px; }
.avatar img { width: 110px; height: 110px; border-radius: 55px; border: 3px solid ${sideHead}; }
.side h2 { margin: 0 0 6px; padding-bottom: 2px; border-bottom: 1px solid ${sideHead}; font-size: 10pt; color: ${sideHead}; text-transform: uppercase; letter-spacing: 1.5px; }
.side div.blk { margin-bottom: 16px; }
.side p, .side li { color: ${sideFg}; font-size: 9.5pt; word-break: break-word; }
.side .ph { color: #111827; }
.main h1 { font-size: 24pt; color: ${accent}; }
.main h2 { margin-top: 15px; padding-bottom: 2px; border-bottom: 2px solid ${accent}; font-size: 11.5pt; color: ${accent}; text-transform: uppercase; letter-spacing: 1px; }
.main h2 + * { margin-top: 5px; }
@media print { table.lay { height: 269mm; } }`;
}

function css(template, accentIn) {
  const raw = safeHex(accentIn);
  const light = lum(raw) > 0.6;
  const onAccent = light ? "#111827" : "#ffffff";
  const accent = light ? "#374151" : raw; // text/lines use a readable shade when the chosen colour is very light
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
.ph { background: #fff3a3; color: #111827; }
table { border-collapse: collapse; }
@media print { body { padding: 0; max-width: none; } .ph, h2, td { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`;

  const v = {
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
    traditional: `
body { font-family: Georgia, 'Times New Roman', serif; }
.head { text-align: center; }
h1 { font-size: 22pt; color: #111827; }
h2 { margin-top: 14px; padding: 3px 0; background: #e9edf1; text-align: center; font-size: 10pt; letter-spacing: 2px; text-transform: uppercase; color: #111827; }
h2 + * { margin-top: 6px; }`,
    focus: `
body { font-family: Calibri, Arial, Helvetica, sans-serif; }
h1 { font-size: 24pt; color: #111827; }
.hl { color: ${accent}; font-weight: bold; }
h2 { margin-top: 14px; padding-bottom: 2px; border-bottom: 2px solid ${accent}; font-size: 11.5pt; font-weight: bold; color: #111827; }
h2 + * { margin-top: 6px; }
table.sg { width: 100%; } table.sg td { width: 33%; padding: 1px 6px 1px 0; vertical-align: top; }`,
    academic: `
body { font-family: Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif; }
h1 { font-size: 22pt; color: ${accent}; }
h2 { margin-top: 15px; padding-bottom: 2px; border-bottom: 1px solid #9ca3af; font-size: 12pt; color: ${accent}; font-variant: small-caps; letter-spacing: 1px; }
h2 + * { margin-top: 4px; }
table.tl { width: 100%; margin-top: 4px; }
td.dl { width: 26%; padding: 7px 10px 0 0; vertical-align: top; color: #4b5563; font-size: 9.5pt; }
td.dc { padding-top: 7px; vertical-align: top; }`,
    professional: sidebarCss(accent, raw, onAccent, onAccent),
    split: sidebarCss(accent, "#f1f3f6", "#1f2937", accent),
    portrait: `
body { font-family: Arial, Helvetica, sans-serif; }
h1 { font-size: 20pt; color: ${accent}; text-transform: uppercase; letter-spacing: 1px; }
h2 { margin-top: 15px; padding-bottom: 2px; border-bottom: 1px solid ${accent}; font-size: 10.5pt; color: ${accent}; text-transform: uppercase; letter-spacing: 1.5px; }
h2 + * { margin-top: 5px; }
table.phh { width: 100%; }
td.phl { vertical-align: top; }
td.pic { width: 104px; text-align: right; vertical-align: top; }
td.pic img { width: 92px; height: 92px; border-radius: 4px; }`,
    executive: `
body { font-family: Arial, Helvetica, sans-serif; }
.head { padding-bottom: 8px; border-bottom: 4px solid ${accent}; }
h1 { font-size: 24pt; color: #111827; text-transform: uppercase; letter-spacing: 3px; }
h2 { margin-top: 15px; font-size: 10pt; color: ${accent}; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; }
h2 + * { margin-top: 5px; }`,
    minimal: `
body { font-family: 'Helvetica Neue', Arial, sans-serif; }
h1 { font-size: 22pt; color: #111827; }
h2 { margin-top: 20px; font-size: 9pt; color: ${accent}; text-transform: uppercase; letter-spacing: 3px; }
h2 + * { margin-top: 6px; }
.job { margin-top: 11px; }`,
    compact: `
body { padding: 20px 30px; font-family: Arial, Helvetica, sans-serif; font-size: 9.5pt; line-height: 1.35; }
h1 { font-size: 20pt; color: ${accent}; }
h2 { margin-top: 10px; padding-bottom: 1px; border-bottom: 1px solid #d1d5db; font-size: 10pt; font-weight: bold; text-transform: uppercase; color: #111827; }
h2 + * { margin-top: 4px; }
.job { margin-top: 6px; }`,
  };
  return base + (v[template] || v.modern);
}

export function buildCvHtml(cvIn, { template = "modern", accent = "#1a6edb", photo = "" } = {}) {
  const cv = normalizeCv(cvIn);
  const m = TEMPLATES.find((x) => x.id === template) || {};
  const pic = m.photo && /^data:image\//.test(photo || "") ? photo : "";
  const contactArr = [cv.email, cv.phone, cv.location, ...cv.links].filter(Boolean);
  const sec = (title, body) => (body ? `<h2>${title}</h2>${body}` : "");

  const bulletsHtml = (b) => (b.length ? `<ul>${b.map((x) => `<li>${t(x)}</li>`).join("")}</ul>` : "");
  const item = (title, sub, d, extra) => {
    if (m.datesLeft) {
      return `<tr><td class="dl">${esc(d)}</td><td class="dc"><div class="t">${t(title)}</div><div class="c">${sub}</div>${extra}</td></tr>`;
    }
    return `<div class="job"><div class="t">${t(title)}</div><div class="c">${sub}${sub && d ? " &nbsp;|&nbsp; " : ""}${esc(d)}</div>${extra}</div>`;
  };
  const list = (items) => (items.length ? (m.datesLeft ? `<table class="tl">${items.join("")}</table>` : items.join("")) : "");

  const exp = list(cv.experience.map((e) =>
    item(e.position, [e.company, e.location].filter(Boolean).map(t).join(", "), range(e.startDate, e.endDate), bulletsHtml(e.bullets))));
  const edu = list(cv.education.map((e) =>
    item(e.qualification, t(e.institution), range(e.startDate, e.endDate), e.details ? `<p>${t(e.details)}</p>` : "")));
  const certs = cv.certifications.map((c) =>
    `<p>${t(c.name)}${c.issuer ? ` — ${t(c.issuer)}` : ""}${c.date ? ` (${esc(c.date)})` : ""}</p>`).join("");
  const mems = cv.memberships.length ? `<ul>${cv.memberships.map((x) => `<li>${t(x)}</li>`).join("")}</ul>` : "";
  const summary = cv.summary ? `<p>${t(cv.summary)}</p>` : "";

  let skills = "";
  if (cv.skills.length) {
    if (m.skillsGrid) {
      const rows = [];
      for (let i = 0; i < cv.skills.length; i += 3) {
        rows.push(`<tr>${[0, 1, 2].map((k) => `<td>${cv.skills[i + k] ? "&bull; " + t(cv.skills[i + k]) : ""}</td>`).join("")}</tr>`);
      }
      skills = `<table class="sg">${rows.join("")}</table>`;
    } else {
      skills = `<p>${cv.skills.map(t).join(" &bull; ")}</p>`;
    }
  }

  const nameBlock = (withContact) =>
    `<div class="head"><h1>${t(cv.name || "Your Name")}</h1>` +
    (cv.headline ? `<div class="hl">${t(cv.headline)}</div>` : "") +
    (withContact && contactArr.length ? `<div class="contact">${contactArr.map(esc).join(" &nbsp;|&nbsp; ")}</div>` : "") + `</div>`;

  let body;
  if (m.layout === "sidebar") {
    const blk = (title, html) => (html ? `<div class="blk"><h2>${title}</h2>${html}</div>` : "");
    const side =
      (pic ? `<div class="avatar"><img src="${esc(pic)}" alt=""></div>` : "") +
      blk("Contact", contactArr.map((x) => `<p>${esc(x)}</p>`).join("")) +
      blk("Skills", cv.skills.map((x) => `<p>${t(x)}</p>`).join("")) +
      blk("Certifications", certs) + blk("Memberships", mems);
    const main = nameBlock(false) + sec("Professional Summary", summary) + sec("Work Experience", exp) + sec("Education", edu);
    body = `<table class="lay" cellspacing="0" cellpadding="0"><tr><td class="side">${side}</td><td class="main">${main}</td></tr></table>`;
  } else if (template === "portrait" && pic) {
    body = `<table class="phh" cellspacing="0" cellpadding="0"><tr><td class="phl">${nameBlock(true)}</td><td class="pic"><img src="${esc(pic)}" alt=""></td></tr></table>` +
      sec("Professional Summary", summary) + sec("Skills", skills) + sec("Work Experience", exp) +
      sec("Education", edu) + sec("Certifications", certs) + sec("Professional Memberships", mems);
  } else {
    body = nameBlock(true) + sec("Professional Summary", summary) + sec("Skills", skills) + sec("Work Experience", exp) +
      sec("Education", edu) + sec("Certifications", certs) + sec("Professional Memberships", mems);
  }

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
