import { useRef, useState } from "react";
import { Icon } from "../shared/Icons";
import { useCvAutofill } from "../hooks/CvAutofillContext";

/**
 * "Use my CV  |  Fill manually" switch shown at the top of every profile modal.
 *
 * onAutofill(cvData) -> number of items filled (0 = nothing new). Called after the CV is parsed.
 * autoApply={false}  -> don't call onAutofill automatically; use the render-prop child
 *                       (children(cvData)) to let the user pick what to apply (work experience).
 */
export default function CvAutofillBanner({ section, unit = "field", onAutofill, autoApply = true, children }) {
  const { ensureParsed, parsing, error, hasSavedCv, data } = useCvAutofill();
  const [mode, setMode] = useState("manual"); // "manual" | "cv"
  const [msg, setMsg] = useState("");
  const fileRef = useRef();

  const apply = async (opts) => {
    setMode("cv");
    setMsg("");
    const cv = await ensureParsed(opts);
    if (!cv) return;
    if (!autoApply) return;
    const n = onAutofill?.(cv) || 0;
    setMsg(
      n > 0
        ? `Filled ${n} ${unit}${n === 1 ? "" : "s"} from your CV. Review and edit before saving.`
        : `Nothing new to fill — your CV had no ${section} details that aren't already here.`,
    );
  };

  const segBtn = (active) => ({
    flex: 1, padding: "7px 10px", fontSize: 12.5, fontWeight: 500, borderRadius: 8, cursor: "pointer",
    border: "1px solid " + (active ? "#1a6edb" : "transparent"),
    background: active ? "#fff" : "transparent", color: active ? "#1a6edb" : "#5a5a72",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
  });

  return (
    <div style={{ background: "#f0f5ff", border: "1px solid rgba(26,110,219,0.15)", borderRadius: 12, padding: 10 }}>
      <div style={{ display: "flex", gap: 4, background: "rgba(26,110,219,0.07)", borderRadius: 10, padding: 3 }}>
        <button type="button" style={segBtn(mode === "cv")} onClick={() => (hasSavedCv ? apply() : setMode("cv"))}>
          {Icon.sparkle} Auto-fill from my CV
        </button>
        <button type="button" style={segBtn(mode === "manual")} onClick={() => { setMode("manual"); setMsg(""); }}>
          {Icon.edit} Fill manually
        </button>
      </div>

      {mode === "cv" && (
        <div style={{ marginTop: 10, fontSize: 12.5 }}>
          {!hasSavedCv && !data && !parsing && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ color: "#5a5a72" }}>No CV saved yet. Pick one to read — it won't be saved to your profile.</span>
              <input
                ref={fileRef} type="file" accept=".pdf,.docx" className="hidden"
                onChange={(e) => e.target.files[0] && apply({ file: e.target.files[0] })}
              />
              <button
                type="button" onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 border-[1.5px] border-dashed border-[#1a6edb60] rounded-lg text-[#1a6edb] hover:bg-[#e8f1fd] transition text-[12.5px] font-medium w-fit"
              >
                {Icon.upload} Choose CV (PDF or DOCX)
              </button>
            </div>
          )}

          {parsing && (
            <span style={{ display: "flex", alignItems: "center", gap: 8, color: "#1a6edb" }}>
              {Icon.spin} Reading your CV… this takes a few seconds.
            </span>
          )}

          {!parsing && error && (
            <span style={{ color: "#dc2626" }}>
              {error}{" "}
              {hasSavedCv && (
                <button type="button" onClick={() => apply()} style={{ color: "#1a6edb", textDecoration: "underline", cursor: "pointer" }}>
                  Try again
                </button>
              )}
            </span>
          )}

          {!parsing && !error && msg && (
            <span style={{ color: "#15803d", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              {msg}
              {hasSavedCv && (
                <button type="button" onClick={() => apply()} style={{ color: "#1a6edb", textDecoration: "underline", cursor: "pointer" }}>
                  Fill again
                </button>
              )}
            </span>
          )}

          {!parsing && !error && data && !autoApply && typeof children === "function" && children(data)}
        </div>
      )}
    </div>
  );
}
