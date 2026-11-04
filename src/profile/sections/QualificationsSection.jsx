import { Icon } from "../shared/Icons";
import { SectionCard, GhostBtn, FL, EmptyRow } from "../shared/ui";
import CertificateActions from "../components/CertificateActions";

const fmt = (d) => new Date(d).toLocaleDateString("en-GB", { month: "short", year: "numeric" });
const badge = (bg, color) => ({ width: 32, height: 32, borderRadius: 8, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color, flexShrink: 0 });

export default function QualificationsSection({ qualifications, memberships, token, onEdit }) {
  const quals = qualifications.filter((q) => q.name);
  const mems = memberships.filter((m) => m.organization);
  const empty = qualifications.length === 0 && memberships.length === 0;

  return (
    <SectionCard dotColor="#0369a1" title="Professional Qualifications & Memberships"
      action={<GhostBtn onClick={onEdit}>{!empty ? <>{Icon.edit} Edit</> : <>{Icon.plus} Add</>}</GhostBtn>}>
      {empty ? (
        <EmptyRow icon={Icon.tag}>
          <div style={{ fontSize: 13, color: "#9090a8" }}>No professional qualifications or memberships added yet</div>
        </EmptyRow>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {quals.length > 0 && (
            <div>
              <FL label="Qualifications" />
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                {quals.map((q, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={badge("#e0f2fe", "#0369a1")}>{(q.name[0] || "Q").toUpperCase()}</div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: "#1a1a2e" }}>{q.name}</div>
                      {q.institution && <div style={{ fontSize: 12, color: "#5a5a72", marginTop: 2 }}>{q.institution}</div>}
                      {q.dateObtained && <div style={{ fontSize: 11.5, color: "#9090a8", marginTop: 2 }}>📅 {fmt(q.dateObtained)}</div>}
                      {q.certificateFileId && <CertificateActions fileId={q.certificateFileId} token={token} fileName={`${q.name} Certificate`} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {mems.length > 0 && (
            <div>
              <FL label="Memberships" />
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                {mems.map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={badge("#fef3c7", "#92400e")}>{(m.organization[0] || "M").toUpperCase()}</div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: "#1a1a2e" }}>{m.organization}</div>
                      {m.membershipId && <div style={{ fontSize: 12, color: "#5a5a72", marginTop: 2 }}>ID: {m.membershipId}</div>}
                      {m.startDate && (
                        <div style={{ fontSize: 11.5, color: "#9090a8", marginTop: 2 }}>
                          📅 {fmt(m.startDate)} – {m.endDate ? fmt(m.endDate) : "Present"}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </SectionCard>
  );
}
