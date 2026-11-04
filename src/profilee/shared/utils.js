import { completionFields, MONTHS_SHORT, REQUIRED_FOR_APPLY } from "./constants";

export function calcCompletion(profile) {
  if (!profile) return 0;
  const filled = completionFields.filter((f) => profile[f]).length;
  return Math.round((filled / completionFields.length) * 100);
}

export const toDateInput = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");

export function computeAge(dob) {
  if (!dob) return "";
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const md = today.getMonth() - birth.getMonth();
  if (md < 0 || (md === 0 && today.getDate() < birth.getDate())) age--;
  return age > 0 ? age : "";
}

// DB academicLevel[] -> the shape the Education UI works with
export const mapAcademicToEdu = (academicLevel = []) =>
  academicLevel.map((e) => ({
    academicLevel: e.level || "",
    degree: e.courseName || "",
    courseName: e.courseName || "",
    institution: e.institution || "",
    dateStart: toDateInput(e.startDate),
    dateEnd: toDateInput(e.endDate),
    currentlyStudying: false,
    certificateFileId: e.certificateFileId || null,
  }));

// "YYYY-MM-DD" -> "Mar 2021"
export const formatMonthYear = (yyyyMmDd) => {
  if (!yyyyMmDd) return "";
  const [year, month] = yyyyMmDd.split("-");
  const idx = Number(month) - 1;
  return idx >= 0 && idx <= 11 ? `${MONTHS_SHORT[idx]} ${year}` : "";
};

export function totalWorkedText(startDate, endDate, currentlyWorking) {
  if (!startDate) return "";
  const start = new Date(`${startDate}T00:00:00`);
  const end = currentlyWorking ? new Date() : endDate ? new Date(`${endDate}T00:00:00`) : null;
  if (!end) return "";
  let diff = end.getFullYear() * 12 + end.getMonth() - (start.getFullYear() * 12 + start.getMonth());
  if (end.getDate() < start.getDate()) diff -= 1;
  diff = Math.max(0, diff);
  const years = Math.floor(diff / 12);
  const months = diff % 12;
  const y = `${years} year${years === 1 ? "" : "s"}`;
  const m = `${months} month${months === 1 ? "" : "s"}`;
  return years && months ? `${y} ${m}` : years ? y : m;
}

export function buildDurationText(startDate, endDate, currentlyWorking) {
  const startTxt = formatMonthYear(startDate);
  if (!startTxt) return "";
  const worked = totalWorkedText(startDate, endDate, currentlyWorking);
  if (currentlyWorking) return `${startTxt} – Present${worked ? ` | ${worked}` : ""}`;
  const endTxt = formatMonthYear(endDate);
  if (!endTxt) return `${startTxt} –`;
  return `${startTxt} – ${endTxt}${worked ? ` | ${worked}` : ""}`;
}

export function getMissingRequired(profile) {
  return REQUIRED_FOR_APPLY.filter(({ key }) => {
    if (key === "workExperience") {
      const we = profile?.[key];
      return !Array.isArray(we) || we.filter((w) => w.company).length === 0;
    }
    const val = profile?.[key];
    return Array.isArray(val) ? val.length === 0 : !val;
  }).map((f) => f.label);
}
