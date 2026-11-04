import { useRef, useState } from "react";
import api, { API } from "../shared/api";
import { Icon } from "../shared/Icons";
import { MF, FL, Inp } from "../shared/ui";

export default function QuickApplyModal({ onClose, savedCvName }) {
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [useSaved, setUseSaved] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [terms, setTerms] = useState(false);
  const fileRef = useRef();

  const submit = async () => {
    if (!terms) return setError("Please accept the terms before submitting.");
    if (!position.trim()) return setError("Please enter the position you are applying for.");
    if (!savedCvName && !cvFile) return setError("Please upload a CV.");
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("positionapplied", position);
      fd.append("salaryInfo", salary);
      if (!useSaved && cvFile) fd.append("cv", cvFile);
      await api.post(`${API}/applications`, fd);
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onClose(); }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.08)]">
          <div>
            <h2 className="font-semibold text-[#1a1a2e] text-[15px]">Quick Apply</h2>
            <p className="text-[#9090a8] text-xs mt-0.5">Your saved profile will be attached automatically</p>
          </div>
          <button onClick={onClose} className="text-[#9090a8] hover:text-[#1a1a2e] transition p-1 rounded-lg hover:bg-[#f4f6fb]">{Icon.x}</button>
        </div>

        {success ? (
          <div className="flex flex-col items-center py-12 gap-3">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-500">{Icon.check}</div>
            <p className="font-semibold text-[#1a1a2e]">Application Submitted!</p>
            <p className="text-[#9090a8] text-sm text-center px-8">We've received your application and will be in touch soon.</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <MF label="Position Applying For *">
              <Inp type="text" placeholder="e.g. Senior Accountant" value={position} onChange={(e) => setPosition(e.target.value)} />
            </MF>
            <MF label="Current Salary (optional)">
              <Inp type="number" placeholder="e.g. 80000" value={salary} onChange={(e) => setSalary(e.target.value)} />
            </MF>
            <div>
              <FL label="CV / Resume" />
              <div className="mt-2 space-y-2">
                {savedCvName && (
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-[#5a5a72]">
                    <input type="radio" checked={useSaved} onChange={() => { setUseSaved(true); setCvFile(null); }} />
                    Use saved: <span className="font-medium text-[#1a6edb]">{savedCvName}</span>
                  </label>
                )}
                <label className="flex items-center gap-2 cursor-pointer text-sm text-[#5a5a72]">
                  <input type="radio" checked={!useSaved} onChange={() => setUseSaved(false)} />
                  Upload a different CV
                </label>
                {!useSaved && (
                  <>
                    <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCvFile(e.target.files[0])} className="hidden" />
                    <button onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-[#1a6edb60] rounded-lg text-[#1a6edb] hover:bg-[#e8f1fd] transition text-sm">
                      {Icon.upload} {cvFile ? cvFile.name : "Choose file (PDF / DOC)"}
                    </button>
                  </>
                )}
              </div>
            </div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={terms} onChange={(e) => { setTerms(e.target.checked); setError(""); }} className="mt-0.5 w-4 h-4" />
              <span className="text-xs text-[#9090a8]">I confirm all profile information is accurate and consent to AMSOL processing my data for recruitment.</span>
            </label>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button onClick={submit} disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#1a6edb] text-white text-sm font-semibold hover:bg-[#0d4fa3] disabled:opacity-50 flex items-center justify-center gap-2 transition">
              {loading ? <>{Icon.spin} Submitting…</> : "Submit Application"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
