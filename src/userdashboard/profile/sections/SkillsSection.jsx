import { Icon } from "../shared/Icons";
import { SectionCard, GhostBtn, AddBtn, EmptyRow } from "../shared/ui";

export default function SkillsSection({ skills, onEdit }) {
  return (
    <SectionCard dotColor="#f26722" title="Skills" action={<GhostBtn onClick={onEdit}>{Icon.edit} Edit</GhostBtn>}>
      {skills.length > 0 ? (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {skills.map((s) => (
              <span key={s} style={{ padding: "6px 13px", borderRadius: 99, fontSize: 12, fontWeight: 500, background: "#f4f6fb", border: "1px solid rgba(0,0,0,0.1)", color: "#5a5a72" }}>{s}</span>
            ))}
          </div>
          <div style={{ marginTop: 14 }}><AddBtn onClick={onEdit}>Add skill ↗</AddBtn></div>
        </>
      ) : (
        <EmptyRow icon={Icon.tag}>
          <div style={{ fontSize: 13, color: "#9090a8" }}>No skills added yet</div>
          <div style={{ marginTop: 8 }}><AddBtn onClick={onEdit}>Add skill ↗</AddBtn></div>
        </EmptyRow>
      )}
    </SectionCard>
  );
}
