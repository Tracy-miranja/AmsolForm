import { useRef, useState } from "react";
import api, { API } from "../shared/api";
import { Icon } from "../shared/Icons";
import { ACADEMIC_LEVELS, HIGHEST_EDU_LEVELS } from "../shared/constants";
import { Modal, MF, Inp, Sel, FieldError } from "../shared/ui";
import CvAutofillBanner from "../cv/CvAutofillBanner";
import { matchEducationLevel } from "../cv/cvNormalize";

// Highest level found in the CV's education list (index 0 of ACADEMIC_LEVELS = highest)
const highestFromEducation = (education = []) => {
  const ranks = education
    .map((e) => ACADEMIC_LEVELS.indexOf(e.academicLevel))
    .filter((i) => i >= 0);
  return ranks.length ? ACADEMIC_LEVELS[Math.min(...ranks)] : "";
};

export default function SummaryModal({ form, onClose, onSave, saving }) {
  const [local, setLocal] = useState({
    specialization: form.specialization || "",
    positionApplied: form.positionApplied || "",
    highestEducationLevel: form.highestEducationLevel || "",
    salaryInfo: form.salaryInfo || "",
    expectedSalary: form.expectedSalary || "",
  });
  const [errors, setErrors] = useState({});
  const [payslipFile, setPayslipFile] = useState(null);
  const [payslipUploading, setPayslipUploading] = useState(false);
  const [payslipMsg, setPayslipMsg] = useState("");
  const payslipRef = useRef();

  const ch = (k, v) => {
    setLocal((s) => ({ ...s, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const applyFromCv = (cv) => {
    const s = cv.summary || {};
    const next = { ...local };
    let n = 0;
    const set = (k, v) => { if (v && !next[k]) { next[k] = v; n++; } };
    set("specialization", s.specialization);
    set("positionApplied", s.positionApplied);
    set("highestEducationLevel",
      matchEducationLevel(s.highestEducationLevel, HIGHEST_EDU_LEVELS) ||
      matchEducationLevel(highestFromEducation(cv.education), HIGHEST_EDU_LEVELS));
    set("salaryInfo", s.salaryInfo);
    setLocal(next);
    return n;
  };

  const validate = () => {
    const e = {};
    if (!local.salaryInfo || Number(local.salaryInfo) <= 0) e.salaryInfo = "Current salary is required and must be greater than 0.";
    if (!local.expectedSalary || Number(local.expectedSalary) <= 0) e.expectedSalary = "Expected salary is required and must be greater than 0.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    let fileId = null, fileName = null;

    if (payslipFile) {
      setPayslipUploading(true);
      setPayslipMsg("");
      try {
        const fd = new FormData();
        fd.append("payslip", payslipFile);
        const { data } = await api.post(`${API}/profile/payslip`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        fileId = data.payslipAttachmentFileId;
        fileName = data.payslipAttachmentName;
        setPayslipMsg(`Payslip "${payslipFile.name}" uploaded.`);
      } catch (err) {
        setPayslipMsg(err.response?.data?.message || "Error uploading payslip.");
        setPayslipUploading(false);
        return;
      } finally {
        setPayslipUploading(false);
      }
    }

    onSave({ ...local, ...(fileId && { payslipAttachmentFileId: fileId, payslipAttachmentName: fileName }) });
  };

  return (
    <Modal title="Professional Details" subtitle="Update your Professional Details"
      onClose={onClose} onSave={handleSave} saving={saving || payslipUploading}>
      <CvAutofillBanner section="professional summary" unit="field" onAutofill={applyFromCv} />

      <MF label="Specialization *">
        <Inp type="text" placeholder="e.g. Software Engineering, Finance…" value={local.specialization}
          onChange={(e) => ch("specialization", e.target.value)} />
      </MF>

      <MF label="Highest Academic Level *">
        <Sel value={local.highestEducationLevel} onChange={(e) => ch("highestEducationLevel", e.target.value)}>
          <option value="">Select your qualification</option>
          {HIGHEST_EDU_LEVELS.map((v) => <option key={v} value={v}>{v}</option>)}
        </Sel>
      </MF>

      <MF label="Current Salary *">
        <Inp type="number" placeholder="e.g. 80000" value={local.salaryInfo} onChange={(e) => ch("salaryInfo", e.target.value)} />
        <FieldError>{errors.salaryInfo}</FieldError>
      </MF>

      <MF label="Expected Salary *">
        <Inp type="number" placeholder="e.g. 100000" value={local.expectedSalary} onChange={(e) => ch("expectedSalary", e.target.value)} />
        <FieldError>{errors.expectedSalary}</FieldError>
      </MF>

      <MF label="Current Payslip (optional)">
        <input ref={payslipRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden"
          onChange={(e) => { setPayslipFile(e.target.files[0] || null); setPayslipMsg(""); }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <p style={{ fontSize: 11.5, color: "#9090a8", margin: 0 }}>📋 Uploaded payslips will be confirmed and verified during the interview.</p>
          <button type="button" onClick={() => payslipRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 border-[1.5px] border-dashed border-[#1a6edb60] rounded-lg text-[#1a6edb] hover:bg-[#e8f1fd] transition text-[12.5px] font-medium w-fit">
            {Icon.upload}{payslipFile ? payslipFile.name : "Choose payslip file (PDF / DOC)"}
          </button>
          {payslipFile && (
            <button type="button" onClick={() => { setPayslipFile(null); setPayslipMsg(""); }}
              className="flex items-center gap-1 text-[#9090a8] hover:text-red-500 text-[11.5px] transition w-fit">
              {Icon.trash} Remove
            </button>
          )}
          {payslipMsg && <p className={`text-xs ${payslipMsg.includes("Error") ? "text-red-500" : "text-green-600"}`}>{payslipMsg}</p>}
          <p style={{ fontSize: 11, color: "#9090a8" }}>Upload your most recent payslip. Accepted: PDF, JPG, PNG, DOC. Max 5MB.</p>
        </div>
      </MF>
    </Modal>
  );
}
