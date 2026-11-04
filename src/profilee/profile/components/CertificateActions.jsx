import { useState } from "react";
import { Icon } from "../shared/Icons";
import { API, API_ORIGIN } from "../shared/api";

const authInit = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  credentials: "include",
});

export default function CertificateActions({ fileId, fileName }) {
  const [previewing, setPreviewing] = useState(false);
  const [blobUrl, setBlobUrl] = useState(null);
  const [loadState, setLoadState] = useState("idle");

  const viewUrl = `${API_ORIGIN}${API}/certificates/${fileId}`;
  const downloadUrl = `${API_ORIGIN}${API}/certificates/${fileId}/download`;

  const handlePreview = async () => {
    if (blobUrl) { setPreviewing(true); return; }
    setLoadState("loading");
    setPreviewing(true);
    try {
      const res = await fetch(viewUrl, authInit());
      if (!res.ok) throw new Error("Failed");
      setBlobUrl(URL.createObjectURL(await res.blob()));
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(downloadUrl, authInit());
      if (!res.ok) throw new Error("Failed");
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "certificate";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Download failed.");
    }
  };

  const pill = (border, bg, color) => ({
    display: "flex", alignItems: "center", gap: 4, fontSize: 11, padding: "3px 10px", borderRadius: 6,
    border: `1px solid ${border}`, background: bg, color, cursor: "pointer", fontFamily: "inherit",
  });

  return (
    <>
      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
        <button onClick={handlePreview} style={pill("rgba(3,105,161,0.3)", "#e0f2fe", "#0369a1")}>{Icon.eye} View</button>
        <button onClick={handleDownload} style={pill("rgba(22,163,74,0.3)", "#f0fdf4", "#16a34a")}>{Icon.download} Download</button>
      </div>

      {previewing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setPreviewing(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.08)] flex-shrink-0">
              <div>
                <h2 className="font-semibold text-[#1a1a2e] text-[15px]">Certificate Preview</h2>
                {fileName && <p className="text-[#9090a8] text-xs mt-0.5">{fileName}</p>}
              </div>
              <div className="flex items-center gap-2">
                {blobUrl && (
                  <button onClick={handleDownload} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a6edb] text-white text-[12.5px] hover:bg-[#0d4fa3] transition">
                    {Icon.download} Download
                  </button>
                )}
                <button onClick={() => setPreviewing(false)} className="text-[#9090a8] hover:text-[#1a1a2e] transition p-1 rounded-lg hover:bg-[#f4f6fb]">{Icon.x}</button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden relative bg-[#f4f6fb]">
              {loadState === "loading" && (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <div style={{ width: 36, height: 36, border: "3px solid #e8edf5", borderTop: "3px solid #1a6edb", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  <p className="text-[#9090a8] text-sm">Loading certificate…</p>
                </div>
              )}
              {loadState === "error" && (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
                  <div className="text-4xl">📄</div>
                  <p className="text-[#1a1a2e] font-medium text-sm">Could not load preview</p>
                  <button onClick={handleDownload} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1a6edb] text-white text-sm hover:bg-[#0d4fa3] transition">
                    {Icon.download} Download instead
                  </button>
                </div>
              )}
              {loadState === "ready" && blobUrl && (
                <iframe src={blobUrl} className="w-full h-full" style={{ display: "block", border: "none" }} title="Certificate Preview" />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
