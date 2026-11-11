import { Icon } from "../shared/Icons";
import { API } from "../shared/api";
import { SectionCard, GhostBtn, AddBtn, FL, EmptyRow } from "../shared/ui";

const pill = (bg, color) => ({ fontSize: 12, padding: "4px 10px", borderRadius: 99, background: bg, color, fontWeight: 500 });

export default function SummarySection({ profile, onEdit }) {
  const hasAny = profile?.specialization || profile?.positionApplied || profile?.highestEducationLevel;
  return (
    <SectionCard dotColor="#6366f1" title="Professional summary"
      action={<GhostBtn onClick={onEdit}>{Icon.edit} Edit</GhostBtn>}>
      {hasAny ? (
        <div className="space-y-3">
          {profile?.specialization && (
            <div>
              <FL label="Specialization" />
              <p style={{ fontSize: 13.5, color: "#1a1a2e", marginTop: 3 }}>{profile.specialization}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {profile?.positionApplied && <span style={pill("#e8f1fd", "#1a6edb")}>{profile.positionApplied}</span>}
            {profile?.highestEducationLevel && <span style={pill("#f0f0ff", "#6366f1")}>{profile.highestEducationLevel}</span>}
            {profile?.salaryInfo && <span style={pill("#f0fdf4", "#16a34a")}>Salary: {profile.salaryInfo}</span>}
            {profile?.payslipAttachmentFileId && (
              <a href={`${API}/profile/payslip/${profile.payslipAttachmentFileId}`} target="_blank" rel="noopener noreferrer"
                style={{ ...pill("#f0fdf4", "#16a34a"), display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
                {Icon.download} Payslip
              </a>
            )}
          </div>
        </div>
      ) : (
        <EmptyRow icon={
          <svg viewBox="0 0 20 20" fill="#9090a8" width="16" height="16">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" clipRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" />
          </svg>}>
          <div style={{ fontSize: 13, color: "#9090a8" }}>No summary added yet</div>
          <div style={{ marginTop: 8 }}><AddBtn onClick={onEdit}>Add summary ↗</AddBtn></div>
        </EmptyRow>
      )}
    </SectionCard>
  );
}
