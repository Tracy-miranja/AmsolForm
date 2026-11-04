export default function Chevron({ open, size = 14 }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width={size} height={size}
      style={{ color: "#9090a8", flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
    </svg>
  );
}
