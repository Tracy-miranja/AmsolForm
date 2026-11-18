import { useRef, useState } from "react";
import api, { API } from "../shared/api";
import { Icon } from "../shared/Icons";
import { ACADEMIC_LEVELS } from "../shared/constants";
import { formatMonthYear } from "../shared/utils";
import { Modal, MF, FL, Inp, Sel, AddBtn, inputCls } from "../shared/ui";
import CvAutofillBanner from "../cv/CvAutofillBanner";

const blank = {
  academicLevel: "", degree: "", courseName: "", institution: "",
  dateStart: "", dateEnd: "", currentlyStudying: false, certificateFileId: null,
};
const isBlank = (e) => !e.academicLevel && !e.institution && !e.courseName;
const dupKey = (e) => `${(e.institution || "").toLowerCase()}|${(e.courseName || "").toLowerCase()}`;

const calcDuration = (edu) => {
  if (!edu.dateStart) return "";
  const start = new Date(`${edu.dateStart}T00:00:00`);
  const end = edu.currentlyStudying ? new Date() : edu.dateEnd ? new Date(`${edu.dateEnd}T00:00:00`) : null;
  if (!end) return "";
  let months = end.getFullYear() * 12 + end.getMonth() - (start.getFullYear() * 12 + start.getMonth());
  if (end.getDate() < start.getDate()) months--;
  months = Math.max(0, months);
  const y = Math.floor(months / 12), m = months % 12;
  if (y && m) return `${y}y ${m}mo`;
  if (y) return `${y} year${y > 1 ? "s" : ""}`;
  return `${m} month${m !== 1 ? "s" : ""}`;
};

export default function EducationModal({ education, onClose, onSave, saving }) {
  const [list, setList] = useState(
    education.length
      ? education.map((e) => ({
          ...blank, ...e,
          dateStart: e.dateStart || (e.yearStart ? `${e.yearStart}-01-01` : ""),
          dateEnd: e.dateEnd || (e.yearEnd ? `${e.yearEnd}-06-01` : ""),
        }))
      : [{ ...blank }],
  );
  const n0 = education.length || 1;
  const [certFiles, setCertFiles] = useState(() => Array(n0).fill(null));
  const [certUploading, setCertUploading] = useState(() => Array(n0).fill(false));
  const [certMsgs, setCertMsgs] = useState(() => Array(n0).fill(""));
  const certRefs = useRef([]);
  const today = new Date().toISOString().split("T")[0];

  const ch = (i, k, v) => setList((l) => l.map((item, idx) => (idx === i ? { ...item, [k]: v } : item)));
  const setAt = (setter) => (i, val) => setter((arr) => arr.map((v, idx) => (idx === i ? val : v)));
  const setCertFile = setAt(setCertFiles);
  const setCertMsg = setAt(setCertMsgs);
  const setCertUploadingAt = setAt(setCertUploading);

  const extendArrays = (count) => {
    setCertFiles((f) => [...f, ...Array(count).fill(null)]);
    setCertUploading((u) => [...u, ...Array(count).fill(false)]);
    setCertMsgs((m) => [...m, ...Array(count).fill("")]);
  };
  const add = () => { setList((l) => [...l, { ...blank }]); extendArrays(1); };
  const remove = (i) => {
    setList((l) => l.filter((_, idx) => idx !== i));
    setCertFiles((f) => f.filter((_, idx) => idx !== i));
    setCertUploading((u) => u.filter((_, idx) => idx !== i));
    setCertMsgs((m) => m.filter((_, idx) => idx !== i));
  };

  // ── CV: replace the empty starter row, or append entries that aren't already listed ──
  const applyFromCv = (cv) => {
    const seen = new Set(list.filter((e) => !isBlank(e)).map(dupKey));
    const fresh = (cv.education || []).filter((e) => !seen.has(dupKey(e))).map((e) => ({ ...blank, ...e }));
    if (!fresh.length) return 0;
    if (list.every(isBlank)) {
      setList(fresh);
      setCertFiles(fresh.map(() => null));
      setCertUploading(fresh.map(() => false));
      setCertMsgs(fresh.map(() => ""));
    } else {
      setList((l) => [...l, ...fresh]);
      extendArrays(fresh.length);
    }
    return fresh.length;
  };

  const uploadCert = async (i) => {
    const file = certFiles[i];
    if (!file) return null;
    setCertUploadingAt(i, true);
    setCertMsg(i, "");
    try {
      const fd = new FormData();
      fd.append("certificate", file);
      fd.append("name", list[i].courseName || list[i].academicLevel || file.name);
      fd.append("institution", list[i].institution || "");
      fd.append("dateObtained", list[i].dateEnd || list[i].dateStart || "");
      const { data } = await api.post(`${API}/certificates`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      const id = data.certificateFileId || data.fileId || null;
      setCertMsg(i, `Uploaded: ${file.name}`);
      ch(i, "certificateFileId", id);
      return id;
    } catch (err) {
      setCertMsg(i, err.response?.data?.message || "Upload failed.");
      return null;
    } finally {
      setCertUploadingAt(i, false);
    }
  };

  const handleSave = async () => {
    const results = await Promise.all(certFiles.map((file, i) => (file ? uploadCert(i) : Promise.resolve(null))));
    const finalList = list.map((e, i) => ({
      ...e,
      certificateFileId: results[i] !== null && results[i] !== undefined ? results[i] : e.certificateFileId,
    }));
    onSave(
      finalList
        .filter((e) => e.academicLevel || e.degree || e.institution)
        .map((e) => ({
          ...e,
          yearStart: e.dateStart ? e.dateStart.split("-")[0] : "",
          yearEnd: e.currentlyStudying ? "Present" : e.dateEnd ? e.dateEnd.split("-")[0] : "",
        })),
    );
  };

  return (
    <Modal title="Edit Education" subtitle="Add your academic qualifications"
      onClose={onClose} onSave={handleSave} saving={saving || certUploading.some(Boolean)}>
      <CvAutofillBanner section="education" unit="entry" onAutofill={applyFromCv} />

      {list.map((edu, i) => {
        const duration = calcDuration(edu);
        return (
          <div key={i} className="p-4 bg-[#f8f9fc] rounded-xl border border-[rgba(0,0,0,0.06)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#9090a8] uppercase tracking-wider">Education {i + 1}</span>
              {list.length > 1 && (
                <button onClick={() => remove(i)} className="text-[#9090a8] hover:text-red-500 transition">{Icon.trash}</button>
              )}
            </div>

            <MF label="Academic Level *">
              <Sel value={edu.academicLevel} onChange={(e) => ch(i, "academicLevel", e.target.value)}>
                <option value="">Select academic level…</option>
                {ACADEMIC_LEVELS.map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
              </Sel>
            </MF>

            <MF label="Course Name">
              <Inp type="text" placeholder="e.g. Financial Accounting, Software Engineering…"
                value={edu.courseName || ""} onChange={(e) => ch(i, "courseName", e.target.value)} />
            </MF>

            <MF label="Institution *">
              <Inp type="text" placeholder="e.g. University of Nairobi" value={edu.institution}
                onChange={(e) => ch(i, "institution", e.target.value)} />
            </MF>

            <MF label="Duration *">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <FL label="Start Date" />
                  <input type="date" className={inputCls} max={today} value={edu.dateStart}
                    onChange={(e) => ch(i, "dateStart", e.target.value)} />
                </div>
                <div className="flex flex-col gap-1">
                  <FL label="End Date" />
                  <input type="date" className={inputCls} min={edu.dateStart || undefined} max={today}
                    value={edu.dateEnd} disabled={edu.currentlyStudying}
                    onChange={(e) => ch(i, "dateEnd", e.target.value)} />
                </div>
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={edu.currentlyStudying} style={{ width: 16, height: 16 }}
                  onChange={(e) => { ch(i, "currentlyStudying", e.target.checked); if (e.target.checked) ch(i, "dateEnd", ""); }} />
                <span style={{ fontSize: 12.5, color: "#5a5a72" }}>Currently studying here</span>
              </label>

              {edu.dateStart && (
                <p style={{ fontSize: 11, color: "#9090a8", marginTop: 8 }}>
                  Preview:{" "}
                  <span style={{ color: "#1a6edb", fontWeight: 500 }}>
                    {formatMonthYear(edu.dateStart)} – {edu.currentlyStudying ? "Present" : edu.dateEnd ? formatMonthYear(edu.dateEnd) : "…"}
                    {duration ? ` · ${duration}` : ""}
                  </span>
                </p>
              )}
            </MF>

            <MF label="Certificate / Transcript (optional)">
              <input ref={(el) => (certRefs.current[i] = el)} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden"
                onChange={(e) => { setCertFile(i, e.target.files[0] || null); setCertMsg(i, ""); }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button type="button" onClick={() => certRefs.current[i]?.click()}
                  className="flex items-center gap-2 px-3 py-2 border-[1.5px] border-dashed border-[#7c3aed60] rounded-lg text-[#7c3aed] hover:bg-[#ede9fe] transition text-[12.5px] font-medium w-fit">
                  {certUploading[i] ? Icon.spin : Icon.upload}
                  {certFiles[i] ? certFiles[i].name : edu.certificateFileId ? "Replace certificate" : "Upload certificate"}
                </button>

                {edu.certificateFileId && !certFiles[i] && (
                  <span style={{ fontSize: 11, color: "#16a34a", display: "flex", alignItems: "center", gap: 4 }}>
                    {Icon.check} Certificate on file
                  </span>
                )}
                {certFiles[i] && (
                  <button type="button" onClick={() => { setCertFile(i, null); setCertMsg(i, ""); }}
                    className="flex items-center gap-1 text-[#9090a8] hover:text-red-500 text-[11.5px] transition w-fit">
                    {Icon.trash} Remove
                  </button>
                )}
                {certMsgs[i] && (
                  <p className={`text-xs ${certMsgs[i].includes("failed") || certMsgs[i].includes("Error") ? "text-red-500" : "text-green-600"}`}>{certMsgs[i]}</p>
                )}
                <p style={{ fontSize: 11, color: "#9090a8" }}>PDF, JPG, PNG or DOC · max 5MB · optional</p>
              </div>
            </MF>
          </div>
        );
      })}

      <AddBtn onClick={add}>Add</AddBtn>
    </Modal>
  );
}
