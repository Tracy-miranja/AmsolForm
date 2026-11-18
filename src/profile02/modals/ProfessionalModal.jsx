import { useRef, useState } from "react";
import api, { API } from "../shared/api";
import { Icon } from "../shared/Icons";
import { Modal, MF, Inp, AddBtn, inputCls } from "../shared/ui";
import CertificateActions from "../components/CertificateActions";
import CvAutofillBanner from "../cv/CvAutofillBanner";

const blankQual = { name: "", institution: "", dateObtained: "", certificateFileId: null };
const blankMem = { organization: "", membershipId: "", startDate: "", endDate: "", certificateFileId: null };
const iso = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");
const lc = (s) => (s || "").toLowerCase();

export default function ProfessionalModal({ qualifications, memberships, onClose, onSave, saving, token }) {
  const [quals, setQuals] = useState(
    qualifications.length ? qualifications.map((q) => ({ ...blankQual, ...q, dateObtained: iso(q.dateObtained) })) : [{ ...blankQual }],
  );
  const [mems, setMems] = useState(
    memberships.length ? memberships.map((m) => ({ ...blankMem, ...m, startDate: iso(m.startDate), endDate: iso(m.endDate) })) : [],
  );
  const n0 = qualifications.length || 1;
  const [certFiles, setCertFiles] = useState(() => Array(n0).fill(null));
  const [certUploading, setCertUploading] = useState(() => Array(n0).fill(false));
  const [certMsgs, setCertMsgs] = useState(() => Array(n0).fill(""));
  const certRefs = useRef([]);
  const today = new Date().toISOString().split("T")[0];

  const chQ = (i, k, v) => setQuals((l) => l.map((item, idx) => (idx === i ? { ...item, [k]: v } : item)));
  const chM = (i, k, v) => setMems((l) => l.map((item, idx) => (idx === i ? { ...item, [k]: v } : item)));
  const setAt = (setter) => (i, val) => setter((arr) => arr.map((v, idx) => (idx === i ? val : v)));
  const setCertFile = setAt(setCertFiles);
  const setCertMsg = setAt(setCertMsgs);
  const setCertUploadingAt = setAt(setCertUploading);

  const extendArrays = (count) => {
    setCertFiles((f) => [...f, ...Array(count).fill(null)]);
    setCertUploading((u) => [...u, ...Array(count).fill(false)]);
    setCertMsgs((m) => [...m, ...Array(count).fill("")]);
  };

  // ── CV auto-fill (qualifications + memberships) ──
  const applyFromCv = (cv) => {
    let n = 0;

    const seenQ = new Set(quals.filter((q) => q.name).map((q) => lc(q.name)));
    const freshQ = (cv.qualifications || []).filter((q) => !seenQ.has(lc(q.name))).map((q) => ({ ...blankQual, ...q }));
    if (freshQ.length) {
      if (quals.every((q) => !q.name && !q.institution)) {
        setQuals(freshQ);
        setCertFiles(freshQ.map(() => null));
        setCertUploading(freshQ.map(() => false));
        setCertMsgs(freshQ.map(() => ""));
      } else {
        setQuals((l) => [...l, ...freshQ]);
        extendArrays(freshQ.length);
      }
      n += freshQ.length;
    }

    const seenM = new Set(mems.map((m) => lc(m.organization)));
    const freshM = (cv.memberships || []).filter((m) => !seenM.has(lc(m.organization))).map((m) => ({ ...blankMem, ...m }));
    if (freshM.length) { setMems((l) => [...l, ...freshM]); n += freshM.length; }

    return n;
  };

  const uploadCert = async (i) => {
    const file = certFiles[i];
    const qual = quals[i];
    if (!file) return null;
    setCertUploadingAt(i, true);
    setCertMsg(i, "");
    try {
      const fd = new FormData();
      fd.append("certificate", file);
      fd.append("name", qual.name || file.name);
      fd.append("institution", qual.institution || "");
      fd.append("dateObtained", qual.dateObtained || "");
      const { data } = await api.post(`${API}/certificates`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      const fileId = data.certificateFileId || null;
      chQ(i, "certificateFileId", fileId);
      setCertMsg(i, `✓ ${file.name} uploaded`);
      return fileId;
    } catch (err) {
      setCertMsg(i, err.response?.data?.message || "Upload failed.");
      return null;
    } finally {
      setCertUploadingAt(i, false);
    }
  };

  const handleSave = async () => {
    const results = await Promise.all(certFiles.map((file, i) => (file ? uploadCert(i) : Promise.resolve(null))));
    const finalQuals = quals.map((q, i) => ({
      ...q,
      certificateFileId: results[i] !== null && results[i] !== undefined ? results[i] : q.certificateFileId,
    }));
    onSave({ qualifications: finalQuals, memberships: mems });
  };

  const sectionTitle = (text, margin = "0 0 8px") => (
    <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a2e", margin, textTransform: "uppercase", letterSpacing: "0.06em" }}>{text}</div>
  );

  return (
    <Modal title="Professional Qualifications & Memberships" subtitle="Add your professional certifications and memberships"
      onClose={onClose} onSave={handleSave} saving={saving || certUploading.some(Boolean)}>
      <CvAutofillBanner section="qualifications or memberships" unit="item" onAutofill={applyFromCv} />

      {sectionTitle("Professional Qualifications")}

      {quals.map((q, i) => (
        <div key={i} className="p-4 bg-[#f8f9fc] rounded-xl border border-[rgba(0,0,0,0.06)] space-y-3 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#9090a8] uppercase tracking-wider">Qualification {i + 1}</span>
            {quals.length > 1 && (
              <button
                onClick={() => {
                  setQuals((l) => l.filter((_, idx) => idx !== i));
                  setCertFiles((f) => f.filter((_, idx) => idx !== i));
                  setCertUploading((u) => u.filter((_, idx) => idx !== i));
                  setCertMsgs((m) => m.filter((_, idx) => idx !== i));
                }}
                className="text-[#9090a8] hover:text-red-500 transition">{Icon.trash}</button>
            )}
          </div>

          <MF label="Qualification Name *">
            <Inp type="text" placeholder="e.g. CPA, ACCA, PMP…" value={q.name} onChange={(e) => chQ(i, "name", e.target.value)} />
          </MF>
          <MF label="Issuing Institution">
            <Inp type="text" placeholder="e.g. ICPAK, PMI…" value={q.institution} onChange={(e) => chQ(i, "institution", e.target.value)} />
          </MF>
          <MF label="Date Obtained">
            <input type="date" className={inputCls} max={today} value={q.dateObtained} onChange={(e) => chQ(i, "dateObtained", e.target.value)} />
          </MF>

          <MF label="Certificate (optional)">
            <input ref={(el) => (certRefs.current[i] = el)} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="hidden"
              onChange={(e) => { setCertFile(i, e.target.files[0] || null); setCertMsg(i, ""); }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <button type="button" onClick={() => certRefs.current[i]?.click()}
                className="flex items-center gap-2 px-3 py-2 border-[1.5px] border-dashed border-[#0369a160] rounded-lg text-[#0369a1] hover:bg-[#e0f2fe] transition text-[12.5px] font-medium w-fit">
                {certUploading[i] ? Icon.spin : Icon.upload}
                {certFiles[i] ? certFiles[i].name : q.certificateFileId ? "Replace certificate" : "Attach certificate"}
              </button>

              {q.certificateFileId && !certFiles[i] && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 11, color: "#16a34a", display: "flex", alignItems: "center", gap: 4 }}>{Icon.check} Certificate on file</span>
                  <CertificateActions fileId={q.certificateFileId} token={token} fileName={`${q.name || "Certificate"}`} />
                </div>
              )}
              {certFiles[i] && (
                <button type="button" onClick={() => { setCertFile(i, null); setCertMsg(i, ""); }}
                  className="flex items-center gap-1 text-[#9090a8] hover:text-red-500 text-[11.5px] transition w-fit">{Icon.trash} Remove</button>
              )}
              {certMsgs[i] && (
                <p className={`text-xs ${certMsgs[i].includes("failed") || certMsgs[i].includes("Error") ? "text-red-500" : "text-green-600"}`}>{certMsgs[i]}</p>
              )}
              <p style={{ fontSize: 11, color: "#9090a8" }}>PDF, JPG, PNG or DOC · max 5MB · optional</p>
            </div>
          </MF>
        </div>
      ))}

      <AddBtn onClick={() => { setQuals((l) => [...l, { ...blankQual }]); extendArrays(1); }}>Add qualification</AddBtn>

      {sectionTitle("Professional Memberships", "20px 0 8px")}
      {mems.length === 0 && <p style={{ fontSize: 13, color: "#9090a8", marginBottom: 8 }}>No memberships added yet.</p>}

      {mems.map((m, i) => (
        <div key={i} className="p-4 bg-[#f8f9fc] rounded-xl border border-[rgba(0,0,0,0.06)] space-y-3 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#9090a8] uppercase tracking-wider">Membership {i + 1}</span>
            <button onClick={() => setMems((l) => l.filter((_, idx) => idx !== i))} className="text-[#9090a8] hover:text-red-500 transition">{Icon.trash}</button>
          </div>
          <MF label="Organisation *"><Inp type="text" placeholder="e.g. ICPAK, LSK, EBK…" value={m.organization} onChange={(e) => chM(i, "organization", e.target.value)} /></MF>
          <MF label="Membership ID *"><Inp type="text" placeholder="e.g. ICPAK/2024/1234" value={m.membershipId} onChange={(e) => chM(i, "membershipId", e.target.value)} /></MF>
          <div className="grid grid-cols-2 gap-3">
            <MF label="Start Date *"><input type="date" className={inputCls} max={today} value={m.startDate} onChange={(e) => chM(i, "startDate", e.target.value)} /></MF>
            <MF label="End Date *"><input type="date" className={inputCls} min={m.startDate || undefined} value={m.endDate} onChange={(e) => chM(i, "endDate", e.target.value)} /></MF>
          </div>
        </div>
      ))}

      <AddBtn onClick={() => setMems((l) => [...l, { ...blankMem }])}>Add membership</AddBtn>
    </Modal>
  );
}
