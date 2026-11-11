import { useState } from "react";
import { Icon } from "../shared/Icons";
import { INDUSTRIES } from "../shared/constants";
import { buildDurationText, formatMonthYear, totalWorkedText } from "../shared/utils";
import { Modal, MF, FL, Inp, Sel, AddBtn, FieldError, inputCls } from "../shared/ui";
import CvAutofillBanner from "../cv/CvAutofillBanner";

const MONTH_IDX = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];

const parseMonthYearToDateInput = (txt) => {
  const m = String(txt || "").trim().match(/([A-Za-z]{3,9})\s+(\d{4})/);
  if (!m) return "";
  const idx = MONTH_IDX.indexOf(m[1].slice(0, 3).toLowerCase());
  return idx < 0 ? "" : `${m[2]}-${String(idx + 1).padStart(2, "0")}-01`;
};

const parseDuration = (durationStr) => {
  const s = String(durationStr || "");
  const isPresent = /present|current|now/i.test(s);
  const parts = s.split(/[-–]/).map((p) => p.trim()).filter(Boolean);
  return {
    startDate: parseMonthYearToDateInput(parts[0] || ""),
    endDate: isPresent ? "" : parseMonthYearToDateInput(parts[1] || ""),
    currentlyWorking: isPresent,
  };
};

export default function WorkExpModal({ entry = {}, index, isNew, existing = [], onClose, onSave, onDelete, saving }) {
  const initial = parseDuration(entry?.duration);

  const [local, setLocal] = useState({
    industry: entry?.industry || "", company: entry?.company || "", position: entry?.position || "",
    duration: entry?.duration || "", responsibilities: entry?.responsibilities || [], salary: entry?.salary || "",
    ...entry,
  });
  const [errors, setErrors] = useState({});
  const [startDate, setStartDate] = useState(initial.startDate || "");
  const [endDate, setEndDate] = useState(initial.endDate || "");
  const [currentlyWorking, setCurrentlyWorking] = useState(!!initial.currentlyWorking);

  const ch = (k, v) => {
    setLocal((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const worked = totalWorkedText(startDate, endDate, currentlyWorking);
  const computedDuration = buildDurationText(startDate, endDate, currentlyWorking);

  const validate = () => {
    const e = {};
    if (!local.industry) e.industry = "Industry is required.";
    if (!local.company.trim()) e.company = "Company / Organisation is required.";
    if (!local.position.trim()) e.position = "Position / Job Title is required.";
    if (!startDate) e.duration = "Start date is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── CV: this modal edits ONE job, so the user picks which job from the CV ──
  const isDup = (j) =>
    existing.some((w) => (w.company || "").toLowerCase() === j.company.toLowerCase() &&
      (w.position || "").toLowerCase() === j.position.toLowerCase());

  const applyJob = (job) => {
    setLocal((s) => ({
      ...s, industry: job.industry, company: job.company, position: job.position,
      responsibilities: job.responsibilities, salary: job.salary || s.salary,
    }));
    setStartDate(job.startDate);
    setEndDate(job.endDate);
    setCurrentlyWorking(job.currentlyWorking);
    setErrors({});
  };

  return (
    <Modal
      title={isNew ? "Add Work Experience" : "Edit Work Experience"}
      subtitle={isNew ? "Add a new position to your work history" : "Update this work experience entry"}
      onClose={onClose}
      onSave={() => { if (validate()) onSave({ ...local, duration: computedDuration }); }}
      saving={saving}
    >
      <CvAutofillBanner section="work experience" autoApply={false}>
        {(cv) =>
          cv.workExperience.length === 0 ? (
            <span style={{ color: "#5a5a72" }}>We couldn't find any jobs in your CV.</span>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ color: "#5a5a72" }}>Pick a job from your CV to fill this form, then review it.</span>
              <select className={inputCls} defaultValue="" onChange={(e) => e.target.value !== "" && applyJob(cv.workExperience[Number(e.target.value)])}>
                <option value="">Choose a job…</option>
                {cv.workExperience.map((j, i) => (
                  <option key={i} value={i}>
                    {j.position || "Role"} — {j.company || "Company"}
                    {j.startDate ? ` (${formatMonthYear(j.startDate)})` : ""}{isDup(j) ? " · already added" : ""}
                  </option>
                ))}
              </select>
            </div>
          )
        }
      </CvAutofillBanner>

      <MF label="Industry *">
        <Sel value={local.industry} onChange={(e) => ch("industry", e.target.value)}>
          <option value="">Select industry</option>
          {INDUSTRIES.map((v) => <option key={v} value={v}>{v}</option>)}
        </Sel>
        <FieldError>{errors.industry}</FieldError>
      </MF>

      <MF label="Company / Organisation *">
        <Inp type="text" placeholder="e.g. Safaricom PLC" value={local.company} onChange={(e) => ch("company", e.target.value)} />
        <FieldError>{errors.company}</FieldError>
      </MF>

      <MF label="Position / Job Title *">
        <Inp type="text" placeholder="e.g. Senior Accountant" value={local.position} onChange={(e) => ch("position", e.target.value)} />
        <FieldError>{errors.position}</FieldError>
      </MF>

      <MF label="Duration *">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <FL label="Start Date" />
            <input type="date" className={inputCls} value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setErrors((er) => ({ ...er, duration: "" })); }} />
          </div>
          <div className="flex flex-col gap-1">
            <FL label="End Date" />
            <input type="date" className={inputCls} value={endDate} disabled={currentlyWorking}
              onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        <FieldError>{errors.duration}</FieldError>

        <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, cursor: "pointer" }}>
          <input type="checkbox" checked={currentlyWorking}
            onChange={(e) => { setCurrentlyWorking(e.target.checked); if (e.target.checked) setEndDate(""); }}
            style={{ width: 16, height: 16, backgroundColor: "#e7ebf3", border: "1px solid #2e6ee6", borderRadius: 4 }} />
          <span style={{ fontSize: 12.5, color: "#5a5a72" }}>Currently working here</span>
        </label>

        {!!computedDuration && <p style={{ fontSize: 11, color: "#9090a8", marginTop: 8 }}>Preview: {computedDuration}</p>}
        {worked && <p style={{ fontSize: 11, color: "#9090a8", marginTop: 4 }}>Total worked: {worked}</p>}
      </MF>

      <MF label="Key Responsibilities (optional)">
        <div className="space-y-2">
          {local.responsibilities.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span style={{ color: "#9090a8", fontSize: 16 }}>•</span>
              <input type="text" className={inputCls} value={item} placeholder={`Responsibility ${i + 1}`}
                onChange={(e) => {
                  const updated = [...local.responsibilities];
                  updated[i] = e.target.value;
                  ch("responsibilities", updated);
                }} />
              <button onClick={() => ch("responsibilities", local.responsibilities.filter((_, idx) => idx !== i))}
                className="text-[#9090a8] hover:text-red-500 transition flex-shrink-0">{Icon.trash}</button>
            </div>
          ))}
          <AddBtn onClick={() => ch("responsibilities", [...local.responsibilities, ""])}>Add responsibility</AddBtn>
        </div>
      </MF>

      <MF label="Current/Last Salary per month (optional)">
        <Inp type="text" placeholder="e.g. KES 80,000" value={local.salary || ""} onChange={(e) => ch("salary", e.target.value)} />
      </MF>

      {!isNew && (
        <div className="pt-1">
          <button onClick={() => onDelete(index)} className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-[12.5px] transition">
            {Icon.trash} Remove this experience
          </button>
        </div>
      )}
    </Modal>
  );
}
