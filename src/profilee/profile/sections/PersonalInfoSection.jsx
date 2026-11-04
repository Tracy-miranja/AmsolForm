import { Icon } from "../shared/Icons";
import { SectionCard, GhostBtn, Field } from "../shared/ui";

export default function PersonalInfoSection({ profile, displayAvatar, onEdit, onChangePhoto }) {
  return (
    <SectionCard dotColor="#1a6edb" title="Personal information"
      action={<GhostBtn onClick={onEdit}>{Icon.edit} Edit</GhostBtn>}>
      <div className="personal-info-inner" style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        <div style={{ flexShrink: 0, textAlign: "center" }}>
          <div onClick={onChangePhoto} className="group"
            style={{
              width: 88, height: 88, borderRadius: 16, background: "linear-gradient(135deg,#e0e8f8,#c8d8f0)",
              display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(0,0,0,0.08)",
              overflow: "hidden", cursor: "pointer", position: "relative",
            }}>
            {displayAvatar ? (
              <img src={displayAvatar} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <svg viewBox="0 0 60 60" fill="#a0b4d0" width="44" height="44">
                <circle cx="30" cy="22" r="12" />
                <path d="M8 52c0-12.15 9.85-22 22-22s22 9.85 22 22" />
              </svg>
            )}
            <div className="group-hover:opacity-100"
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s", borderRadius: 14 }}>
              <span style={{ color: "white", fontSize: 11, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>{Icon.camera}</span>
            </div>
          </div>
          <div onClick={onChangePhoto} style={{ marginTop: 8, fontSize: 11, color: "#1a6edb", cursor: "pointer", fontWeight: 500 }}>Change photo</div>
        </div>

        <div className="personal-info-fields" style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
          <Field label="Full Name" value={[profile?.firstName, profile?.secondName, profile?.lastName].filter(Boolean).join(" ")} />
          <Field label="Email" value={profile?.email} color="#1a6edb" />
          <Field label="Phone Number" value={profile?.phoneNumber} />
          <Field label="WhatsApp No." value={profile?.whatsAppNo} />
          <Field label="Age" value={profile?.age} />
          <Field label="ID Number" value={profile?.idNumber} />
          <Field label="Passport No." value={profile?.PassportNo} />
          <Field label="Driving Licence"
            value={profile?.hasDrivingLicence ? (profile.hasDrivingLicence === "yes" ? "Yes" : "No") : null} />
          <Field label="Nationality" value={profile?.nationality} />
          <Field label="Location" value={profile?.location} />
        </div>
      </div>
    </SectionCard>
  );
}
