import { useRef } from "react";
import { Icon } from "../shared/Icons";
import { SectionCard } from "../shared/ui";

/** Uploaded-CV card. variant="page" is the larger empty state used on the "Uploaded CV" page. */
export default function CvSection({ profile, cvFile, setCvFile, cvUploading, cvMsg, onUpload, onPreview, variant = "inline" }) {
  const cvRef = useRef();
  const hasCv = !!profile?.savedCvName;

  return (
    <SectionCard dotColor="#1a6edb" title="Uploaded CV"
      action={
        <button onClick={() => cvRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 border-[1.5px] border-dashed border-[#1a6edb60] rounded-[9px] text-[#1a6edb] text-[12.5px] font-medium hover:bg-[#e8f1fd] transition">
          {Icon.upload} {hasCv ? "Replace CV" : "Upload CV"}
        </button>
      }>
      <input ref={cvRef} type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCvFile(e.target.files[0])} className="hidden" />

      {hasCv ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#f0fdf4", borderRadius: 12, border: "1px solid #bbf7d0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "#22c55e", flexShrink: 0 }}>{Icon.check}</span>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: "#1a1a2e" }}>{profile.savedCvName}</div>
              <div style={{ fontSize: 12, color: "#9090a8", marginTop: 2 }}>This CV will be used for quick applications and to auto-fill your profile</div>
            </div>
          </div>
          <button onClick={onPreview}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(0,0,0,0.13)] text-[#5a5a72] text-[12.5px] hover:bg-white transition">
            {Icon.eye} Preview
          </button>
        </div>
      ) : variant === "page" ? (
        <div style={{ padding: "24px 16px", background: "#fffbeb", borderRadius: 12, border: "1px solid #fde68a", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
          <div style={{ fontSize: 13, color: "#92400e", fontWeight: 500 }}>No CV saved yet</div>
          <div style={{ fontSize: 12, color: "#9090a8", marginTop: 4 }}>Upload your CV to enable Quick Apply and auto-fill your profile</div>
          <button onClick={() => cvRef.current?.click()}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#1a6edb] text-white rounded-xl text-sm font-medium hover:bg-[#0d4fa3] transition mx-auto">
            {Icon.upload} Upload CV
          </button>
        </div>
      ) : (
        <div style={{ padding: "12px 16px", background: "#fffbeb", borderRadius: 12, border: "1px solid #fde68a", fontSize: 13, color: "#92400e" }}>
          No CV saved yet. Upload one to enable Quick Apply and profile auto-fill.
        </div>
      )}

      {cvFile && (
        <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#5a5a72" }}>{cvFile.name}</span>
          <button onClick={onUpload} disabled={cvUploading}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1a6edb] text-white rounded-xl text-sm font-medium hover:bg-[#0d4fa3] disabled:opacity-50 transition">
            {cvUploading ? Icon.spin : Icon.save}
            {cvUploading ? "Uploading…" : "Save to Profile"}
          </button>
        </div>
      )}
      {cvMsg && <p className={`mt-3 text-sm ${cvMsg.includes("saved") || cvMsg.includes("CV") ? "text-green-600" : "text-red-500"}`}>{cvMsg}</p>}
    </SectionCard>
  );
}
