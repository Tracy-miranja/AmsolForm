const block = (h, extra = {}) => ({
  height: h, borderRadius: 20, background: "#fff", border: "1px solid rgba(0,0,0,0.06)",
  animation: "pulse 1.5s ease-in-out infinite", ...extra,
});

export default function LoadingSkeleton() {
  return (
    <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={block(132, { background: "linear-gradient(135deg,#eef4ff,#f8fbff)", border: "1px solid rgba(59,130,246,0.12)" })} />
      <div style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 18 }}>
        <div style={block(260)} />
        <div style={block(260)} />
      </div>
      <div style={block(220)} />
    </div>
  );
}
