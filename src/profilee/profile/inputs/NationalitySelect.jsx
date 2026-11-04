import { useEffect, useRef, useState } from "react";
import { inputCls } from "../shared/ui";
import FlagIcon from "./FlagIcon";
import Chevron from "./Chevron";
import { panel, searchWrap, searchInput } from "./dropdownStyles";

export default function NationalitySelect({ value, onChange, countries, loading }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();
  const searchRef = useRef();

  const selected = countries.find((c) => c.name === value);
  const filtered = search.trim()
    ? countries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : countries;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (country) => { onChange(country); setSearch(""); setOpen(false); };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button type="button"
        onClick={() => { setOpen((o) => !o); setTimeout(() => searchRef.current?.focus(), 50); }}
        className={inputCls + " flex items-center gap-2 text-left cursor-pointer"}
        style={{ justifyContent: "space-between" }}>
        {loading ? (
          <span style={{ color: "#9090a8" }}>Loading countries…</span>
        ) : selected ? (
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FlagIcon flagPng={selected.flagPng} flagEmoji={selected.flag} cca2={selected.cca2} size={16} />
            <span>{selected.name}</span>
          </span>
        ) : (
          <span style={{ color: "#9090a8" }}>Select nationality…</span>
        )}
        <Chevron open={open} />
      </button>

      {open && (
        <div style={{ ...panel, right: 0 }}>
          <div style={searchWrap}>
            <input ref={searchRef} type="text" placeholder="Search country…" value={search}
              onChange={(e) => setSearch(e.target.value)} style={searchInput} />
          </div>
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "12px 14px", fontSize: 13, color: "#9090a8" }}>No results</div>
            ) : (
              filtered.map((c) => (
                <button key={c.cca2} type="button" onClick={() => select(c)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 14px",
                    textAlign: "left", background: selected?.cca2 === c.cca2 ? "#e8f1fd" : "transparent",
                    border: "none", cursor: "pointer", fontSize: 13.5, color: "#1a1a2e", transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => { if (selected?.cca2 !== c.cca2) e.currentTarget.style.background = "#f4f6fb"; }}
                  onMouseLeave={(e) => { if (selected?.cca2 !== c.cca2) e.currentTarget.style.background = "transparent"; }}>
                  <span style={{ flexShrink: 0 }}>
                    <FlagIcon flagPng={c.flagPng} flagEmoji={c.flag} cca2={c.cca2} size={16} />
                  </span>
                  <span style={{ flex: 1 }}>{c.name}</span>
                  <span style={{ fontSize: 12, color: "#9090a8", flexShrink: 0 }}>{c.dialCode}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
