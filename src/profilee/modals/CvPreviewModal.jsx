import { useEffect, useState } from "react";
import { Icon } from "../shared/Icons";

export default function CvPreviewModal({ cvUrl, cvName, onClose }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loadState, setLoadState] = useState("loading"); // loading | ready | error

  useEffect(() => {
    if (!cvUrl) { setLoadState("error"); return; }
    let created = null;
    let cancelled = false;
    setLoadState("loading");

    fetch(cvUrl, {
      credentials: "include",
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch CV");
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        created = URL.createObjectURL(blob);
        setBlobUrl(created);
        setLoadState("ready");
      })
      .catch(() => !cancelled && setLoadState("error"));

    return () => { cancelled = true; if (created) URL.revokeObjectURL(created); };
  }, [cvUrl]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.08)] flex-shrink-0">
          <div>
            <h2 className="font-semibold text-[#1a1a2e] text-[15px]">CV Preview</h2>
            {cvName && <p className="text-[#9090a8] text-xs mt-0.5">{cvName}</p>}
          </div>
          <div className="flex items-center gap-2">
            {blobUrl && (
              <a href={blobUrl} download={cvName} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a6edb] text-white text-[12.5px] hover:bg-[#0d4fa3] transition">
                {Icon.download} Download
              </a>
            )}
            <a href={cvUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(0,0,0,0.13)] text-[#5a5a72] text-[12.5px] hover:bg-[#f4f6fb] transition">
              {Icon.externalLink} Open in new tab
            </a>
            <button onClick={onClose} className="text-[#9090a8] hover:text-[#1a1a2e] transition p-1 rounded-lg hover:bg-[#f4f6fb]">{Icon.x}</button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative bg-[#f4f6fb]">
          {loadState === "loading" && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div style={{ width: 36, height: 36, border: "3px solid #e8edf5", borderTop: "3px solid #1a6edb", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <p className="text-[#9090a8] text-sm">Loading your CV…</p>
            </div>
          )}
          {loadState === "error" && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
              <div className="text-4xl">📄</div>
              <p className="text-[#1a1a2e] font-medium text-sm">Could not load preview</p>
              <p className="text-[#9090a8] text-xs">Try opening in a new tab or downloading directly.</p>
              <a href={cvUrl} target="_blank" rel="noopener noreferrer"
                className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1a6edb] text-white text-sm hover:bg-[#0d4fa3] transition">
                {Icon.externalLink} Open in new tab
              </a>
            </div>
          )}
          {loadState === "ready" && blobUrl && (
            <iframe src={blobUrl} className="w-full h-full" style={{ display: "block", border: "none" }} title="CV Preview" />
          )}
        </div>
      </div>
    </div>
  );
}
