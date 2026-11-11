import { useEffect, useRef, useState } from "react";
import { inputCls } from "../shared/ui";
import Chevron from "./Chevron";
import { panel, searchWrap, searchInput } from "./dropdownStyles";

export default function LocationSelect({ value, onChange, options, loading, disabled }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();
  const searchRef = useRef();

  const filtered = search.trim()
    ? options.filter((loc) => loc.toLowerCase().includes(search.toLowerCase()))
    : options;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (location) => { onChange(location); setSearch(""); setOpen(false); };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button type="button" disabled={disabled}
        onClick={() => { if (!disabled) { setOpen((o) => !o); setTimeout(() => searchRef.current?.focus(), 50); } }}
        className={inputCls + " flex items-center gap-2 text-left cursor-pointer disabled:cursor-not-allowed"}
        style={{ justifyContent: "space-between" }}>
        {loading ? (
          <span style={{ color: "#9090a8" }}>Loading locations…</span>
        ) : value ? (
          <span>{value}</span>
        ) : (
          <span style={{ color: "#9090a8" }}>{disabled ? "Select nationality first…" : "Select current location…"}</span>
        )}
        <Chevron open={open} />
      </button>

      {open && !disabled && (
        <div style={{ ...panel, right: 0 }}>
          <div style={searchWrap}>
            <input ref={searchRef} type="text" placeholder="Search location…" value={search}
              onChange={(e) => setSearch(e.target.value)} style={searchInput} />
          </div>
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "12px 14px", fontSize: 13, color: "#9090a8" }}>No locations found</div>
            ) : (
              filtered.map((loc) => (
                <button key={loc} type="button" onClick={() => select(loc)}
                  style={{
                    display: "flex", alignItems: "center", width: "100%", padding: "8px 14px", textAlign: "left",
                    background: value === loc ? "#e8f1fd" : "transparent", border: "none", cursor: "pointer",
                    fontSize: 13.5, color: "#1a1a2e",
                  }}
                  onMouseEnter={(e) => { if (value !== loc) e.currentTarget.style.background = "#f4f6fb"; }}
                  onMouseLeave={(e) => { if (value !== loc) e.currentTarget.style.background = "transparent"; }}>
                  <span style={{ flex: 1 }}>{loc}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
