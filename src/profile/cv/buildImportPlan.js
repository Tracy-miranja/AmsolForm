import { HIGHEST_EDU_LEVELS, ACADEMIC_LEVELS } from "../shared/constants";
import { buildDurationText, computeAge } from "../shared/utils";
import { matchEducationLevel, matchOption } from "./cvNormalize";

const lc = (s) => (s || "").toLowerCase();
const isEmpty = (v) => (Array.isArray(v) ? v.length === 0 : !v);
const more = (arr, n = 3) => arr.slice(0, n).join(", ") + (arr.length > n ? ` +${arr.length - n} more` : "");

function extractDialCode(phone, countries) {
  if (!phone) return "";
  const sorted = [...countries].sort((a, b) => b.dialCode.length - a.dialCode.length);
  for (const c of sorted) if (phone.startsWith(c.dialCode)) return c.dialCode;
  return "";
}
function fmtPhone(raw, fallbackDial, countries) {
  const s = String(raw).replace(/[^\d+\s()-]/g, "").trim();
  const code = extractDialCode(s, countries);
  if (code) return `${code} ${s.slice(code.length).trim()}`;
  const local = s.replace(/^0+/, "").trim();
  return fallbackDial ? `${fallbackDial} ${local}` : local;
}

const toDbEdu = (e) => ({
  level: e.academicLevel || "", courseName: e.courseName || e.degree || "", institution: e.institution || "",
  startDate: e.dateStart ? new Date(e.dateStart) : null,
  endDate: e.currentlyStudying ? null : e.dateEnd ? new Date(e.dateEnd) : null,
  certificateFileId: e.certificateFileId || null,
});

/**
 * Compare what the CV contains with what the profile already has and return
 * the sections that would be added. Existing values are never overwritten.
 * st = { form, skills, workExperience, education, qualifications, memberships }
 */
export function buildImportPlan(cv, st, countries) {
  const sections = [];
  const { form = {} } = st;

  // ── personal ──
  {
    const p = cv.personal || {}, patch = {}, labels = [];
    const fill = (k, v, label) => { if (v && !form[k]) { patch[k] = v; labels.push(label); } };
    fill("firstName", p.firstName, "first name"); fill("secondName", p.secondName, "second name");
    fill("lastName", p.lastName, "last name"); fill("email", p.email, "email");
    fill("idNumber", p.idNumber, "ID number"); fill("PassportNo", p.PassportNo, "passport");

    let country = countries.find((c) => c.name === form.nationality);
    if (!form.nationality && p.nationality) {
      const name = matchOption(p.nationality, countries.map((c) => c.name));
      const found = countries.find((c) => c.name === name);
      if (found) { patch.nationality = found.name; labels.push("nationality"); country = found; }
    }
    const dial = country?.dialCode || "";
    if (p.phoneNumber && !form.phoneNumber) { patch.phoneNumber = fmtPhone(p.phoneNumber, dial, countries); labels.push("phone"); }
    const wa = p.whatsAppNo || p.phoneNumber;
    if (wa && !form.whatsAppNo) { patch.whatsAppNo = fmtPhone(wa, dial, countries); labels.push("WhatsApp"); }
    if (p.location && !form.location) {
      const parts = p.location.split(",").map((x) => x.trim()).filter(Boolean);
      const guess = parts.length > 1 ? matchOption(parts[parts.length - 1], countries.map((c) => c.name)) : "";
      const cName = guess || country?.name || form.nationality || "";
      patch.location = guess || !cName ? parts.join(", ") : `${parts.join(", ")}, ${cName}`;
      labels.push("location");
    }
    if (p.dateOfBirth && !form.dateOfBirth) { patch.dateOfBirth = p.dateOfBirth; patch.age = computeAge(p.dateOfBirth); labels.push("date of birth"); }
    if (labels.length) sections.push({ id: "personal", title: "Personal details", count: labels.length, unit: "field", summary: more(labels, 6), patch });
  }

  // ── professional summary ──
  {
    const s = cv.summary || {}, patch = {}, labels = [];
    const ranks = (cv.education || []).map((e) => ACADEMIC_LEVELS.indexOf(e.academicLevel)).filter((i) => i >= 0);
    const fromEdu = ranks.length ? ACADEMIC_LEVELS[Math.min(...ranks)] : "";
    const level = matchEducationLevel(s.highestEducationLevel, HIGHEST_EDU_LEVELS) || matchEducationLevel(fromEdu, HIGHEST_EDU_LEVELS);
    const fill = (k, v, label) => { if (v && isEmpty(form[k])) { patch[k] = v; labels.push(label); } };
    fill("specialization", s.specialization, "specialization"); fill("positionApplied", s.positionApplied, "job title");
    fill("highestEducationLevel", level, "highest education"); fill("salaryInfo", s.salaryInfo, "current salary");
    if (labels.length) sections.push({ id: "summary", title: "Professional summary", count: labels.length, unit: "field", summary: more(labels), patch });
  }

  // ── skills ──
  {
    const have = new Set((st.skills || []).map(lc));
    const fresh = (cv.skills || []).filter((x) => !have.has(lc(x)));
    if (fresh.length) sections.push({ id: "skills", title: "Skills", count: fresh.length, unit: "skill", summary: more(fresh, 5), patch: { skills: [...(st.skills || []), ...fresh] } });
  }

  // ── work experience ──
  {
    const have = new Set((st.workExperience || []).map((w) => `${lc(w.company)}|${lc(w.position)}`));
    const fresh = (cv.workExperience || []).filter((j) => j.company && !have.has(`${lc(j.company)}|${lc(j.position)}`));
    if (fresh.length) {
      const mapped = fresh.map((j) => ({
        industry: j.industry, company: j.company, position: j.position,
        duration: buildDurationText(j.startDate, j.endDate, j.currentlyWorking),
        responsibilities: j.responsibilities, salary: j.salary,
      }));
      sections.push({ id: "work", title: "Work experience", count: fresh.length, unit: "job",
        summary: more(fresh.map((j) => `${j.position || "Role"} at ${j.company}`), 3), patch: { workExperience: [...(st.workExperience || []), ...mapped] } });
    }
  }

  // ── education ──
  {
    const key = (e) => `${lc(e.institution)}|${lc(e.courseName)}`;
    const have = new Set((st.education || []).map(key));
    const fresh = (cv.education || []).filter((e) => !have.has(key(e)));
    if (fresh.length) {
      sections.push({ id: "education", title: "Education", count: fresh.length, unit: "entry",
        summary: more(fresh.map((e) => [e.courseName || e.academicLevel, e.institution].filter(Boolean).join(", ")), 3),
        patch: { academicLevel: [...(st.education || []), ...fresh].map(toDbEdu) } });
    }
  }

  // ── qualifications & memberships ──
  {
    const hq = new Set((st.qualifications || []).map((q) => lc(q.name)));
    const hm = new Set((st.memberships || []).map((m) => lc(m.organization)));
    const fq = (cv.qualifications || []).filter((q) => !hq.has(lc(q.name)));
    const fm = (cv.memberships || []).filter((m) => !hm.has(lc(m.organization)));
    if (fq.length || fm.length) {
      const patch = {};
      if (fq.length) patch.professionalQualifications = [...(st.qualifications || []), ...fq];
      if (fm.length) patch.professionalMemberships = [...(st.memberships || []), ...fm];
      sections.push({ id: "professional", title: "Qualifications & memberships", count: fq.length + fm.length, unit: "item",
        summary: more([...fq.map((q) => q.name), ...fm.map((m) => m.organization)], 4), patch });
    }
  }

  return sections;
}
