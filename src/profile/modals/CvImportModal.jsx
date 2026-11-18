import { useEffect, useState } from "react";
import { Icon } from "../shared/Icons";
import { GhostBtn, PrimaryBtn } from "../shared/ui";

/** stage: "reading" | "review" | "error" */
export default function CvImportModal({ stage, plan, error, saving, onApply, onClose }) {
  const [picked, setPicked] = useState({});
  useEffect(() => { setPicked(Object.fromEntries((plan || []).map((s) => [s.id, true]))); }, [plan]);

  const chosen = (plan || []).filter((s) => picked[s.id]);
  const total = chosen.reduce((n, s) => n + s.count, 0);

  return (
    <div className="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="modal-sheet bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.08)] flex-shrink-0">
          <div>
            <h2 className="font-semibold text-[#1a1a2e] text-[15px]">Fill your profile from your CV</h2>
            <p className="text-[#9090a8] text-xs mt-0.5">We read your CV. Review what we found, then apply.</p>
          </div>
          <button onClick={onClose} className="text-[#9090a8] hover:text-[#1a1a2e] transition p-1 rounded-lg hover:bg-[#f4f6fb]">{Icon.x}</button>
        </div>

        {stage === "reading" && (
          <div className="p-10 flex flex-col items-center gap-3 text-center">
            <div style={{ color: "#1a6edb" }}>{Icon.spin}</div>
            <p className="text-sm text-[#1a1a2e] font-medium">Reading your CV…</p>
            <p className="text-xs text-[#9090a8]">This takes a few seconds.</p>
          </div>
        )}

        {stage === "error" && (
          <div className="p-8 flex flex-col gap-3 text-center items-center">
            <p className="text-sm text-red-500">{error || "We couldn't read your CV."}</p>
            <p className="text-xs text-[#9090a8]">You can still fill each section yourself in Profile.</p>
            <GhostBtn onClick={onClose}>Close</GhostBtn>
          </div>
        )}

        {stage === "review" && (
          <>
            <div className="p-5 overflow-y-auto flex-1" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {plan.length === 0 ? (
                <p className="text-sm text-[#4a5068] py-6 text-center">Your profile already has everything we found in your CV. Nothing to add.</p>
              ) : (
                <>
                  {plan.map((s) => (
                    <label key={s.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", borderRadius: 12, cursor: "pointer",
                      border: "1.5px solid " + (picked[s.id] ? "#1a6edb" : "rgba(0,0,0,0.1)"), background: picked[s.id] ? "#f5f9ff" : "#fff" }}>
                      <input type="checkbox" checked={!!picked[s.id]} style={{ width: 16, height: 16, marginTop: 2 }}
                        onChange={(e) => setPicked((p) => ({ ...p, [s.id]: e.target.checked }))} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                          <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1a1a2e" }}>{s.title}</span>
                          <span style={{ fontSize: 11.5, color: "#1a6edb", fontWeight: 600 }}>{s.count} {s.unit}{s.count === 1 ? "" : "s"}</span>
                        </div>
                        <div style={{ fontSize: 12.5, color: "#5a5a72", marginTop: 3, lineHeight: 1.5 }}>{s.summary}</div>
                      </div>
                    </label>
                  ))}
                  <p style={{ fontSize: 11.5, color: "#9090a8", marginTop: 4 }}>
                    Only empty fields are filled and new items added. Your existing details are never overwritten. You can edit everything afterwards.
                  </p>
                </>
              )}
            </div>
            <div className="px-5 py-3 border-t border-[rgba(0,0,0,0.06)] flex justify-end gap-3 flex-shrink-0">
              <GhostBtn onClick={onClose}>{plan.length ? "Skip for now" : "Close"}</GhostBtn>
              {plan.length > 0 && (
                <PrimaryBtn onClick={() => onApply(chosen)} disabled={saving || chosen.length === 0}>
                  {saving ? Icon.spin : Icon.sparkle} {saving ? "Saving…" : `Apply to my profile (${total})`}
                </PrimaryBtn>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
