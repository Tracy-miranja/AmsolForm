import { useEffect, useRef, useState } from "react";
import { inputCls } from "../shared/ui";
import FlagIcon from "./FlagIcon";
import Chevron from "./Chevron";
import { panel, searchWrap, searchInput } from "./dropdownStyles";

export default function PhoneInput({
  value, onChange, countries, selectedDialCode, selectedCountryName, onDialCodeChange, placeholder,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();
  const searchRef = useRef();

  // number portion only (strip leading dial code)
  const numberOnly = (() => {
    if (!value) return "";
    if (selectedDialCode && value.startsWith(selectedDialCode)) return value.slice(selectedDialCode.length).trimStart();
    return value.replace(/^\+\d{1,4}\s?/, "");
  })();

  const selectedCountry =
    countries.find((c) => c.dialCode === selectedDialCode && c.name === selectedCountryName) ||
    countries.find((c) => c.dialCode === selectedDialCode) ||
    countries.find((c) => c.name === selectedCountryName) ||
    null;
  const fallbackFlag = countries.find((c) => c.flag)?.flag || "🏳️";
  const filtered = search.trim()
    ? countries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.dialCode.includes(search))
    : countries;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch(""); }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectCode = (country) => {
    onDialCodeChange(country.dialCode);
    onChange(`${country.dialCode} ${numberOnly}`);
    setOpen(false);
    setSearch("");
  };

  const handleNumberChange = (e) => {
    const num = e.target.value.replace(/[^\d\s\-()+]/g, "");
    onChange(selectedDialCode ? `${selectedDialCode} ${num}` : num);
  };

  return (
    <div ref={ref} style={{ display: "flex", gap: 6 }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <button type="button"
          onClick={() => { setOpen((o) => !o); setTimeout(() => searchRef.current?.focus(), 50); }}
          style={{
            display: "flex", alignItems: "center", gap: 5, padding: "8px 10px", borderRadius: 9,
            border: "1px solid rgba(0,0,0,0.1)", background: "#f8f9fc", fontSize: 13, cursor: "pointer",
            color: "#1a1a2e", whiteSpace: "nowrap", height: "100%",
          }}>
          <span style={{ display: "flex", alignItems: "center" }}>
            <FlagIcon flagPng={selectedCountry?.flagPng || ""} flagEmoji={selectedCountry?.flag || fallbackFlag}
              cca2={selectedCountry?.cca2} size={15} />
          </span>
          <span style={{ fontWeight: 500 }}>{selectedDialCode || "+?"}</span>
          <Chevron open={open} size={11} />
        </button>

        {open && (
          <div style={{ ...panel, width: 250 }}>
            <div style={searchWrap}>
              <input ref={searchRef} type="text" placeholder="Search country…" value={search}
                onChange={(e) => setSearch(e.target.value)} style={searchInput} />
            </div>
            <div style={{ maxHeight: 200, overflowY: "auto" }}>
              {filtered.map((c) => (
                <button key={c.cca2} type="button" onClick={() => selectCode(c)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "7px 12px", textAlign: "left",
                    background: selectedCountry?.cca2 === c.cca2 ? "#e8f1fd" : "transparent",
                    border: "none", cursor: "pointer", fontSize: 13, color: "#1a1a2e",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f6fb"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = selectedCountry?.cca2 === c.cca2 ? "#e8f1fd" : "transparent"; }}>
                  <span style={{ fontSize: 15, flexShrink: 0 }}>
                    <FlagIcon flagPng={c.flagPng} flagEmoji={c.flag} cca2={c.cca2} size={15} />
                  </span>
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                  <span style={{ color: "#1a6edb", fontWeight: 500, flexShrink: 0 }}>{c.dialCode}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <input type="tel" placeholder={placeholder || "Phone number"} value={numberOnly}
        onChange={handleNumberChange} className={inputCls} style={{ flex: 1 }} />
    </div>
  );
}
