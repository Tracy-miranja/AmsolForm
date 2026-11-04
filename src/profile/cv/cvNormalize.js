import { ACADEMIC_LEVELS, INDUSTRIES } from "../shared/constants";

const clean = (v) => (typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim());
const key = (s) => clean(s).toLowerCase().replace(/[^a-z0-9]/g, "");
const MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];

export function matchOption(value, options, fallback = "") {
  const k = key(value);
  if (!k) return fallback;
  return (
    options.find((o) => key(o) === k) ||
    options.find((o) => key(o).includes(k) || k.includes(key(o))) ||
    fallback
  );
}

const eq = (s) => (o) => o.toLowerCase() === s;
const has = (s) => (o) => o.toLowerCase().includes(s);
const LEVEL_RULES = [
  [/ph\.?d|doctor/, has("doctor")],
  [/master|msc|m\.sc|mba|\bm\.?a\b|meng/, has("master")],
  [/post.?grad/, has("postgraduate")],
  [/bachelor|bsc|b\.sc|\bb\.?a\b|beng|bcom|b\.com|llb|degree/, has("bachelor")],
  [/associate/, has("associate")],
  [/professional/, has("professional")],
  [/diploma/, eq("diploma")],
  [/certificate|\bcert\b/, eq("certificate")],
];
export function matchEducationLevel(value, options) {
  const v = clean(value).toLowerCase();
  if (!v) return "";
  for (const [re, test] of LEVEL_RULES) {
    if (re.test(v)) {
      const hit = options.find(test);
      if (hit) return hit;
    }
  }
  return options.find(eq("others")) || "";
}

// Accepts "2021-03-15", "2021-03", "Mar 2021", "03/2021", "2021" -> "YYYY-MM-DD" ("" if unknown / present)
export function normalizeDate(v) {
  const s = clean(v);
  if (!s || /present|current|now|ongoing/i.test(s)) return "";
  let m = s.match(/^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${(m[3] || "01").padStart(2, "0")}`;
  m = s.match(/^([A-Za-z]{3,9})\.?\s+(\d{4})$/);
  if (m) {
    const i = MONTHS.indexOf(m[1].slice(0, 3).toLowerCase());
    if (i >= 0) return `${m[2]}-${String(i + 1).padStart(2, "0")}-01`;
  }
  m = s.match(/^(\d{1,2})[/-](\d{4})$/);
  if (m) return `${m[2]}-${m[1].padStart(2, "0")}-01`;
  m = s.match(/^(\d{4})$/);
  if (m) return `${m[1]}-01-01`;
  return "";
}

const arr = (v) => (Array.isArray(v) ? v : []);

export function normalizeCvData(raw = {}) {
  const p = raw.personal || {};
  const sm = raw.summary || {};

  const personal = {
    firstName: clean(p.firstName), secondName: clean(p.secondName), lastName: clean(p.lastName),
    email: clean(p.email), phoneNumber: clean(p.phoneNumber), whatsAppNo: clean(p.whatsAppNo),
    nationality: clean(p.nationality), location: clean(p.location),
    idNumber: clean(p.idNumber), PassportNo: clean(p.passportNo || p.PassportNo),
    dateOfBirth: normalizeDate(p.dateOfBirth),
  };

  const summary = {
    specialization: clean(sm.specialization),
    positionApplied: clean(sm.positionApplied),
    highestEducationLevel: clean(sm.highestEducationLevel),
    salaryInfo: clean(sm.salaryInfo).replace(/[^\d.]/g, ""),
  };

  const skills = [...new Set(arr(raw.skills).map(clean).filter(Boolean))].slice(0, 40);

  const workExperience = arr(raw.workExperience)
    .map((w) => {
      const currentlyWorking = !!w.currentlyWorking || /present|current|now/i.test(clean(w.endDate));
      return {
        industry: matchOption(w.industry, INDUSTRIES, "Other"),
        company: clean(w.company),
        position: clean(w.position),
        startDate: normalizeDate(w.startDate),
        endDate: currentlyWorking ? "" : normalizeDate(w.endDate),
        currentlyWorking,
        responsibilities: arr(w.responsibilities).map(clean).filter(Boolean).slice(0, 8),
        salary: clean(w.salary),
      };
    })
    .filter((w) => w.company || w.position);

  const education = arr(raw.education)
    .map((e) => {
      const currentlyStudying = !!e.currentlyStudying;
      const courseName = clean(e.courseName);
      return {
        academicLevel: matchEducationLevel(e.academicLevel || courseName, ACADEMIC_LEVELS),
        degree: courseName, courseName,
        institution: clean(e.institution),
        dateStart: normalizeDate(e.dateStart),
        dateEnd: currentlyStudying ? "" : normalizeDate(e.dateEnd),
        currentlyStudying,
        certificateFileId: null,
      };
    })
    .filter((e) => e.institution || e.courseName);

  const qualifications = arr(raw.qualifications)
    .map((q) => ({
      name: clean(q.name), institution: clean(q.institution),
      dateObtained: normalizeDate(q.dateObtained), certificateFileId: null,
    }))
    .filter((q) => q.name);

  const memberships = arr(raw.memberships)
    .map((m) => ({
      organization: clean(m.organization), membershipId: clean(m.membershipId),
      startDate: normalizeDate(m.startDate), endDate: normalizeDate(m.endDate), certificateFileId: null,
    }))
    .filter((m) => m.organization);

  return { personal, summary, skills, workExperience, education, qualifications, memberships };
}
