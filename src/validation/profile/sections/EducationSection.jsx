import { Icon } from "../shared/Icons";
import { SectionCard, GhostBtn, EmptyRow } from "../shared/ui";
import { formatMonthYear } from "../shared/utils";
import CertificateActions from "../components/CertificateActions";

export default function EducationSection({ education, token, onEdit }) {
  const items = education.filter((e) => e.degree || e.institution);
  return (
    <SectionCard dotColor="#7c3aed" title="Education"
      action={<GhostBtn onClick={onEdit}>{items.length ? <>{Icon.edit} Edit</> : <>{Icon.plus} Add education ↗</>}</GhostBtn>}>
      {items.length > 0 ? (
        <div>
          {items.map((e, i) => {
            const start = e.dateStart ? formatMonthYear(e.dateStart) : e.yearStart || "";
            const end = e.currentlyStudying ? "Present" : e.dateEnd ? formatMonthYear(e.dateEnd) : e.yearEnd || "";
            return (
              <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: i < items.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, fontWeight: 600, color: "#7c3aed" }}>
                  {(e.academicLevel || e.degree || "E")[0].toUpperCase()}
                </div>
                <div>
                  {e.academicLevel && (
                    <span style={{ fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: "#ede9fe", color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.06em", display: "inline-block", marginBottom: 4 }}>
                      {e.academicLevel}
                    </span>
                  )}
                  {e.courseName && <div style={{ fontSize: 12.5, color: "#1a6edb", marginTop: 2, fontWeight: 500 }}>{e.courseName}</div>}
                  {e.institution && <div style={{ fontSize: 12, color: "#5a5a72", marginTop: 2 }}>{e.institution}</div>}
                  {e.certificateFileId && (
                    <CertificateActions fileId={e.certificateFileId} token={token} fileName={`${e.courseName || e.academicLevel || "Certificate"}`} />
                  )}
                  {(start || end) && (
                    <div style={{ fontSize: 11.5, color: "#9090a8", marginTop: 4 }}>📅 {start}{start && end ? " – " : ""}{end}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyRow icon={
          <svg viewBox="0 0 20 20" fill="#9090a8" width="16" height="16">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>}>
          <div style={{ fontSize: 13, color: "#9090a8" }}>No education added yet</div>
        </EmptyRow>
      )}
    </SectionCard>
  );
}
