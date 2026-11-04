import { Icon } from "./Icons";

export const inputCls = `w-full px-3 py-2 rounded-lg border border-[rgba(0,0,0,0.1)] bg-[#f8f9fc]
  text-[13.5px] text-[#1a1a2e] placeholder-[#9090a8]
  focus:outline-none focus:ring-2 focus:ring-[#1a6edb40] focus:border-[#1a6edb]
  disabled:bg-[#f4f6fb] disabled:text-[#9090a8] transition`;

export const Inp = (props) => <input {...props} className={inputCls} />;
export const Sel = ({ children, ...props }) => (
  <select {...props} className={inputCls + " cursor-pointer"}>{children}</select>
);

export const GhostBtn = ({ onClick, children }) => (
  <button onClick={onClick} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(0,0,0,0.13)] text-[#5a5a72] text-[12.5px] hover:bg-[#f4f6fb] transition">
    {children}
  </button>
);
export const PrimaryBtn = ({ onClick, disabled, children }) => (
  <button onClick={onClick} disabled={disabled} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a6edb] text-white text-[12.5px] font-medium hover:bg-[#0d4fa3] disabled:opacity-50 transition">
    {children}
  </button>
);
export const AddBtn = ({ onClick, children }) => (
  <button onClick={onClick} className="flex items-center gap-1.5 px-3.5 py-1.5 border-[1.5px] border-dashed border-[#1a6edb60] rounded-[9px] text-[#1a6edb] text-[12.5px] font-medium hover:bg-[#e8f1fd] transition">
    {Icon.plus}{children}
  </button>
);

export const FL = ({ label }) => (
  <span style={{ fontSize: 11, fontWeight: 500, color: "#9090a8", textTransform: "uppercase", letterSpacing: "0.07em" }}>
    {label}
  </span>
);

export const SectionCard = ({ dotColor = "#1a6edb", title, action, children }) => (
  <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.08)] overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ background: dotColor }} />
        <span className="text-[14px] font-medium text-[#1a1a2e]">{title}</span>
      </div>
      {action}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export const Modal = ({ title, subtitle, onClose, onSave, saving, children }) => (
  <div className="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="modal-sheet bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.08)] flex-shrink-0">
        <div>
          <h2 className="font-semibold text-[#1a1a2e] text-[15px]">{title}</h2>
          {subtitle && <p className="text-[#9090a8] text-xs mt-0.5">{subtitle}</p>}
        </div>
        <button onClick={onClose} className="text-[#9090a8] hover:text-[#1a1a2e] transition p-1 rounded-lg hover:bg-[#f4f6fb]">{Icon.x}</button>
      </div>
      <div className="p-6 overflow-y-auto flex-1 space-y-3">{children}</div>
      <div className="px-6 py-4 border-t border-[rgba(0,0,0,0.06)] flex justify-end gap-3 flex-shrink-0">
        <GhostBtn onClick={onClose}>{Icon.x} Cancel</GhostBtn>
        <PrimaryBtn onClick={onSave} disabled={saving}>
          {saving ? Icon.spin : Icon.save}
          {saving ? "Saving…" : "Save Changes"}
        </PrimaryBtn>
      </div>
    </div>
  </div>
);

export const MF = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <FL label={label} />
    {children}
  </div>
);

export const NavItem = ({ icon, label, active, badge, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-[10px] text-[13.5px] transition text-left
      ${active ? "bg-[#e8f1fd] text-[#1a6edb] font-medium" : "text-[#5a5a72] hover:bg-[#f4f6fb] hover:text-[#1a1a2e]"}`}
  >
    <span style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>
    {label}
    {badge != null && (
      <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-px rounded-full font-medium">{badge}</span>
    )}
  </button>
);

// Read-only label/value row used on the profile page
export const Field = ({ label, value, color }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
    <FL label={label} />
    <span style={{ fontSize: "13.5px", color: value ? color || "#1a1a2e" : "#9090a8", fontStyle: value ? "normal" : "italic" }}>
      {value || "Not provided"}
    </span>
  </div>
);

export const FieldError = ({ children }) =>
  children ? <p style={{ fontSize: 11, color: "#e24b4a", marginTop: 4 }}>{children}</p> : null;

export const EmptyRow = ({ icon, children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f4f6fb", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {icon}
    </div>
    <div>{children}</div>
  </div>
);
