import { useState } from "react";
import { Icon } from "../shared/Icons";
import { SectionCard, AddBtn, GhostBtn, EmptyRow } from "../shared/ui";
import { buildDurationText } from "../shared/utils";
import { useCvAutofill } from "../hooks/CvAutofillContext";

export default function WorkExperienceSection({ workExperience, onAdd, onEdit, onImportAll }) {
  const { ensureParsed, parsing, hasSavedCv } = useCvAutofill();
  const [note, setNote] = useState("");
  const filled = workExperience.filter((w) => w.company);

  // One-click import of every job found in the saved CV (skips jobs already on the profile)
  const importFromCv = async () => {
    setNote("");
    const cv = await ensureParsed();
    if (!cv) return setNote("Couldn't read your CV. Open “Add experience” to try again or fill manually.");
    const have = new Set(workExperience.map((w) => `${(w.company || "").toLowerCase()}|${(w.position || "").toLowerCase()}`));
    const fresh = cv.workExperience
      .filter((j) => j.company && !have.has(`${j.company.toLowerCase()}|${j.position.toLowerCase()}`))
      .map((j) => ({
        industry: j.industry, company: j.company, position: j.position,
        duration: buildDurationText(j.startDate, j.endDate, j.currentlyWorking),
        responsibilities: j.responsibilities, salary: j.salary,
      }));
    if (!fresh.length) return setNote("No new jobs found in your CV.");
    const list = fresh.map((j) => `• ${j.position || "Role"} — ${j.company}`).join("\n");
    if (window.confirm(`Add ${fresh.length} job${fresh.length === 1 ? "" : "s"} from your CV?\n\n${list}\n\nYou can edit each one afterwards.`)) {
      onImportAll(fresh);
    }
  };

  return (
    <SectionCard dotColor="#0d9488" title="Work experience"
      action={
        <div style={{ display: "flex", gap: 8 }}>
          {hasSavedCv && (
            <GhostBtn onClick={importFromCv}>
              {parsing ? Icon.spin : Icon.sparkle} {parsing ? "Reading CV…" : "Import from CV"}
            </GhostBtn>
          )}
          <AddBtn onClick={onAdd}>Add experience</AddBtn>
        </div>
      }>
      {note && <p style={{ fontSize: 12, color: "#5a5a72", marginBottom: 10 }}>{note}</p>}

      {filled.length > 0 ? (
        <div>
          {workExperience.map((w, i) => {
            if (!w.company) return null;
            return (
              <div key={i} style={{
                display: "flex", gap: 14, padding: "14px 0", alignItems: "flex-start",
                borderBottom: i < workExperience.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
              }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: "#f4f6fb", border: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {Icon.briefcase}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: "#1a1a2e" }}>{w.position || "—"}</div>
                  <div style={{ fontSize: 12, color: "#5a5a72", marginTop: 2 }}>{w.company}</div>
                  {w.duration && <div style={{ fontSize: 11.5, color: "#9090a8", marginTop: 3 }}>{w.duration}</div>}
                  {w.salary && (
                    <div style={{ fontSize: 11.5, color: "#16a34a", marginTop: 3, display: "flex", alignItems: "center", gap: 4, fontWeight: 500 }}>
                      Salary Earned/per month: {w.salary}
                    </div>
                  )}
                  {w.responsibilities?.length > 0 && (
                    <ul style={{ marginTop: 6, paddingLeft: 0, listStyle: "none" }}>
                      {w.responsibilities.map((r, idx) => (
                        <li key={idx} style={{ fontSize: 12, color: "#5a5a72", display: "flex", gap: 6, lineHeight: 1.5 }}>
                          <span style={{ color: "#9090a8", flexShrink: 0 }}>•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button onClick={() => onEdit(w, i)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[rgba(0,0,0,0.1)] text-[#5a5a72] text-[11.5px] hover:bg-[#f4f6fb] transition flex-shrink-0">
                  {Icon.edit}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyRow icon={Icon.briefcase}>
          <div style={{ fontSize: 13, color: "#5a5a72" }}>
            No work experience added yet. Adding experience increases your profile completion by <strong>+20%</strong>.
          </div>
        </EmptyRow>
      )}
    </SectionCard>
  );
}
