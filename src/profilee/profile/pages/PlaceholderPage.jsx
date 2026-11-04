export default function PlaceholderPage({ title, icon, description }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center px-8">
      <div className="w-16 h-16 rounded-2xl bg-[#f4f6fb] flex items-center justify-center text-[#9090a8] scale-150">{icon}</div>
      <div className="mt-4">
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 600, color: "#1a1a2e" }}>{title}</h2>
        <p className="text-[#9090a8] text-sm mt-2 max-w-sm">{description}</p>
      </div>
    </div>
  );
}
