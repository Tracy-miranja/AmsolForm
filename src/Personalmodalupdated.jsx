// ─────────────────────────────────────────────────────────────────────────────
// DROP-IN REPLACEMENTS — paste these into your UserProfileDashboard file
// replacing the existing PersonalModal (and the two small helpers below it).
// Everything else in the file stays exactly the same.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Shared input styles (same as your existing ones) ────────────────────────
const inputCls = `w-full px-3 py-2 rounded-lg border border-[rgba(0,0,0,0.1)] bg-[#f8f9fc]
  text-[13.5px] text-[#1a1a2e] placeholder-[#9090a8]
  focus:outline-none focus:ring-2 focus:ring-[#1a6edb40] focus:border-[#1a6edb]
  disabled:bg-[#f4f6fb] disabled:text-[#9090a8] transition`;

const FL = ({ label }) => (
  <span style={{ fontSize: 11, fontWeight: 500, color: "#9090a8", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</span>
);
const MF = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <FL label={label} />
    {children}
  </div>
);
const Inp = (props) => <input {...props} className={inputCls} />;

// ─── Country data hook ────────────────────────────────────────────────────────
function useCountries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,idd,flags,capital,region,subregion,cca2")
      .then((r) => r.json())
      .then((data) => {
        const list = data
          .map((c) => {
            const root = c.idd?.root || "";
            const suffix = c.idd?.suffixes?.[0] || "";
            const dialCode = root && suffix ? `${root}${suffix}` : root || "";
            return {
              name: c.name.common,
              cca2: c.cca2,
              flag: c.flags?.emoji || c.flags?.png || "",
              dialCode,
              capital: c.capital?.[0] || "",
              region: c.region || "",
              subregion: c.subregion || "",
            };
          })
          .filter((c) => c.dialCode)
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(list);
      })
      .catch(() => {
        // Fallback minimal list if API fails
        setCountries([
          { name: "Kenya", cca2: "KE", flag: "🇰🇪", dialCode: "+254", capital: "Nairobi", region: "Africa", subregion: "Eastern Africa" },
          { name: "Uganda", cca2: "UG", flag: "🇺🇬", dialCode: "+256", capital: "Kampala", region: "Africa", subregion: "Eastern Africa" },
          { name: "Tanzania", cca2: "TZ", flag: "🇹🇿", dialCode: "+255", capital: "Dodoma", region: "Africa", subregion: "Eastern Africa" },
          { name: "United States", cca2: "US", flag: "🇺🇸", dialCode: "+1", capital: "Washington D.C.", region: "Americas", subregion: "Northern America" },
          { name: "United Kingdom", cca2: "GB", flag: "🇬🇧", dialCode: "+44", capital: "London", region: "Europe", subregion: "Northern Europe" },
          { name: "South Africa", cca2: "ZA", flag: "🇿🇦", dialCode: "+27", capital: "Pretoria", region: "Africa", subregion: "Southern Africa" },
          { name: "Nigeria", cca2: "NG", flag: "🇳🇬", dialCode: "+234", capital: "Abuja", region: "Africa", subregion: "Western Africa" },
          { name: "India", cca2: "IN", flag: "🇮🇳", dialCode: "+91", capital: "New Delhi", region: "Asia", subregion: "Southern Asia" },
          { name: "Canada", cca2: "CA", flag: "🇨🇦", dialCode: "+1", capital: "Ottawa", region: "Americas", subregion: "Northern America" },
          { name: "Australia", cca2: "AU", flag: "🇦🇺", dialCode: "+61", capital: "Canberra", region: "Oceania", subregion: "Australia and New Zealand" },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { countries, loading };
}

// ─── Nationality Searchable Dropdown ─────────────────────────────────────────
const NationalitySelect = ({ value, onChange, countries, loading }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();
  const inputRef = useRef();

  const selected = countries.find((c) => c.name === value);

  const filtered = search.trim()
    ? countries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : countries;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (country) => {
    onChange(country);
    setSearch("");
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setTimeout(() => inputRef.current?.focus(), 50); }}
        className={inputCls + " flex items-center gap-2 text-left cursor-pointer"}
        style={{ justifyContent: "space-between" }}
      >
        {loading ? (
          <span style={{ color: "#9090a8" }}>Loading countries…</span>
        ) : selected ? (
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>{selected.flag}</span>
            <span>{selected.name}</span>
          </span>
        ) : (
          <span style={{ color: "#9090a8" }}>Select nationality…</span>
        )}
        <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14" style={{ color: "#9090a8", flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100,
          background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)", overflow: "hidden",
        }}>
          {/* Search */}
          <div style={{ padding: "8px 10px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search country…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "6px 10px", borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.1)", background: "#f8f9fc",
                fontSize: 13, outline: "none", color: "#1a1a2e",
              }}
            />
          </div>
          {/* List */}
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "12px 14px", fontSize: 13, color: "#9090a8" }}>No results</div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.cca2}
                  type="button"
                  onClick={() => select(c)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", padding: "8px 14px", textAlign: "left",
                    background: selected?.cca2 === c.cca2 ? "#e8f1fd" : "transparent",
                    border: "none", cursor: "pointer", fontSize: 13.5, color: "#1a1a2e",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => { if (selected?.cca2 !== c.cca2) e.currentTarget.style.background = "#f4f6fb"; }}
                  onMouseLeave={(e) => { if (selected?.cca2 !== c.cca2) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{c.flag}</span>
                  <span>{c.name}</span>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "#9090a8", flexShrink: 0 }}>{c.dialCode}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Phone Input with Country Code ───────────────────────────────────────────
const PhoneInput = ({ value, onChange, countries, selectedDialCode, onDialCodeChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();
  const inputRef = useRef();

  // Strip dial code from stored value to get just the number part
  const numberOnly = value
    ? value.startsWith(selectedDialCode)
      ? value.slice(selectedDialCode.length).trim()
      : value.replace(/^\+\d{1,4}\s?/, "")
    : "";

  const filtered = search.trim()
    ? countries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.dialCode.includes(search))
    : countries;

  const selectedCountry = countries.find((c) => c.dialCode === selectedDialCode);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch(""); } };
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
    const num = e.target.value.replace(/[^\d\s\-()]/g, "");
    onChange(selectedDialCode ? `${selectedDialCode} ${num}` : num);
  };

  return (
    <div ref={ref} style={{ display: "flex", gap: 6 }}>
      {/* Dial code selector */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => { setOpen((o) => !o); setTimeout(() => inputRef.current?.focus(), 50); }}
          style={{
            display: "flex", alignItems: "center", gap: 4, padding: "8px 10px",
            borderRadius: 9, border: "1px solid rgba(0,0,0,0.1)", background: "#f8f9fc",
            fontSize: 13, cursor: "pointer", color: "#1a1a2e", whiteSpace: "nowrap",
            transition: "border-color 0.15s",
          }}
        >
          <span style={{ fontSize: 15 }}>{selectedCountry?.flag || "🌍"}</span>
          <span style={{ fontWeight: 500 }}>{selectedDialCode || "+?"}</span>
          <svg viewBox="0 0 20 20" fill="currentColor" width="11" height="11" style={{ color: "#9090a8", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {open && (
          <div style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 100, width: 240,
            background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)", overflow: "hidden",
          }}>
            <div style={{ padding: "8px 10px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%", padding: "6px 10px", borderRadius: 8,
                  border: "1px solid rgba(0,0,0,0.1)", background: "#f8f9fc",
                  fontSize: 13, outline: "none", color: "#1a1a2e",
                }}
              />
            </div>
            <div style={{ maxHeight: 200, overflowY: "auto" }}>
              {filtered.map((c) => (
                <button
                  key={c.cca2}
                  type="button"
                  onClick={() => selectCode(c)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    width: "100%", padding: "7px 12px", textAlign: "left",
                    background: selectedDialCode === c.dialCode && selectedCountry?.cca2 === c.cca2 ? "#e8f1fd" : "transparent",
                    border: "none", cursor: "pointer", fontSize: 13, color: "#1a1a2e",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f4f6fb"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = selectedDialCode === c.dialCode && selectedCountry?.cca2 === c.cca2 ? "#e8f1fd" : "transparent"; }}
                >
                  <span style={{ fontSize: 15 }}>{c.flag}</span>
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                  <span style={{ color: "#1a6edb", fontWeight: 500, flexShrink: 0 }}>{c.dialCode}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Number input */}
      <input
        type="tel"
        placeholder={placeholder || "Phone number"}
        value={numberOnly}
        onChange={handleNumberChange}
        className={inputCls}
        style={{ flex: 1 }}
      />
    </div>
  );
};

// ─── Personal Info Modal (UPDATED) ───────────────────────────────────────────
// Replace your existing PersonalModal with this one.
// It accepts the same props: { form, onChange, onClose, onSave, saving, saveMsg }
const PersonalModal = ({ form, onChange, onClose, onSave, saving, saveMsg }) => {
  const { countries, loading } = useCountries();

  // Dial code state — initialise from stored phone numbers if present
  const extractDialCode = (phone, countries) => {
    if (!phone) return "";
    for (const c of [...countries].sort((a, b) => b.dialCode.length - a.dialCode.length)) {
      if (phone.startsWith(c.dialCode)) return c.dialCode;
    }
    return "";
  };

  const [phoneDialCode, setPhoneDialCode] = useState(() => extractDialCode(form.phoneNumber || "", countries));
  const [waDialCode, setWaDialCode] = useState(() => extractDialCode(form.whatsAppNo || "", countries));

  // When countries load, try to set dial codes if not already set
  useEffect(() => {
    if (!countries.length) return;
    if (!phoneDialCode) {
      const code = extractDialCode(form.phoneNumber || "", countries);
      setPhoneDialCode(code);
    }
    if (!waDialCode) {
      const code = extractDialCode(form.whatsAppNo || "", countries);
      setWaDialCode(code);
    }
  }, [countries]);

  // When nationality changes → auto-set location + dial codes
  const handleNationalityChange = useCallback((country) => {
    onChange("nationality", country.name);

    // Auto-populate location with capital city if location is empty or was auto-filled before
    const suggestedLocation = country.capital
      ? `${country.capital}, ${country.name}`
      : country.name;
    onChange("location", suggestedLocation);

    // Auto-set dial codes for phone and whatsapp
    setPhoneDialCode(country.dialCode);
    setWaDialCode(country.dialCode);

    // Update stored phone numbers to include new country code
    const currentPhone = form.phoneNumber
      ? form.phoneNumber.replace(/^\+\d{1,4}\s?/, "").trim()
      : "";
    const currentWa = form.whatsAppNo
      ? form.whatsAppNo.replace(/^\+\d{1,4}\s?/, "").trim()
      : "";

    if (currentPhone) onChange("phoneNumber", `${country.dialCode} ${currentPhone}`);
    if (currentWa) onChange("whatsAppNo", `${country.dialCode} ${currentWa}`);
  }, [form.phoneNumber, form.whatsAppNo, onChange]);

  // Modal wrapper (same as your existing Modal component)
  const Icon = {
    x: <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>,
    save: <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" /></svg>,
    spin: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ animation: "spin 1s linear infinite" }}><circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0110 10" /></svg>,
  };

  const GhostBtn = ({ onClick, children }) => (
    <button onClick={onClick} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(0,0,0,0.13)] text-[#5a5a72] text-[12.5px] hover:bg-[#f4f6fb] transition">{children}</button>
  );
  const PrimaryBtn = ({ onClick, disabled, children }) => (
    <button onClick={onClick} disabled={disabled} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a6edb] text-white text-[12.5px] font-medium hover:bg-[#0d4fa3] disabled:opacity-50 transition">{children}</button>
  );
  const Sel = ({ children, ...props }) => (
    <select {...props} className={inputCls + " cursor-pointer"}>{children}</select>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.08)] flex-shrink-0">
          <div>
            <h2 className="font-semibold text-[#1a1a2e] text-[15px]">Edit Personal Details</h2>
            <p className="text-[#9090a8] text-xs mt-0.5">Update your personal information</p>
          </div>
          <button onClick={onClose} className="text-[#9090a8] hover:text-[#1a1a2e] transition p-1 rounded-lg hover:bg-[#f4f6fb]">
            {Icon.x}
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {saveMsg && (
            <p className={`text-sm font-medium ${saveMsg.includes("success") ? "text-green-600" : "text-red-500"}`}>{saveMsg}</p>
          )}

          <MF label="First Name *">
            <Inp type="text" placeholder="Enter first name" value={form.firstName || ""} onChange={e => onChange("firstName", e.target.value)} />
          </MF>
          <MF label="Second Name">
            <Inp type="text" placeholder="Enter second name" value={form.secondName || ""} onChange={e => onChange("secondName", e.target.value)} />
          </MF>
          <MF label="Last Name *">
            <Inp type="text" placeholder="Enter last name" value={form.lastName || ""} onChange={e => onChange("lastName", e.target.value)} />
          </MF>
          <MF label="ID Number">
            <Inp type="text" placeholder="Enter ID number" value={form.idNumber || ""} onChange={e => onChange("idNumber", e.target.value)} />
          </MF>

          {/* ── NATIONALITY — searchable dropdown ── */}
          <MF label="Nationality *">
            {loading ? (
              <div className={inputCls + " flex items-center gap-2 text-[#9090a8]"}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" style={{ animation: "spin 1s linear infinite" }}>
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 0110 10" />
                </svg>
                Loading countries…
              </div>
            ) : (
              <NationalitySelect
                value={form.nationality || ""}
                onChange={handleNationalityChange}
                countries={countries}
                loading={loading}
              />
            )}
            {form.nationality && (
              <p style={{ fontSize: 11, color: "#9090a8", marginTop: 3 }}>
                Location and country code will be suggested based on your nationality.
              </p>
            )}
          </MF>

          {/* ── LOCATION — auto-filled but editable ── */}
          <MF label="Location *">
            <Inp
              type="text"
              placeholder="e.g. Nairobi, Kenya"
              value={form.location || ""}
              onChange={e => onChange("location", e.target.value)}
            />
            <p style={{ fontSize: 11, color: "#9090a8", marginTop: 2 }}>
              Auto-filled from nationality — you can edit this freely.
            </p>
          </MF>

          {/* ── PHONE NUMBER with country code ── */}
          <MF label="Phone Number *">
            <PhoneInput
              value={form.phoneNumber || ""}
              onChange={(v) => onChange("phoneNumber", v)}
              countries={countries}
              selectedDialCode={phoneDialCode || (countries.find(c => c.name === form.nationality)?.dialCode ?? "")}
              onDialCodeChange={setPhoneDialCode}
              placeholder="e.g. 712 345 678"
            />
          </MF>

          {/* ── WHATSAPP with country code ── */}
          <MF label="WhatsApp No. *">
            <PhoneInput
              value={form.whatsAppNo || ""}
              onChange={(v) => onChange("whatsAppNo", v)}
              countries={countries}
              selectedDialCode={waDialCode || (countries.find(c => c.name === form.nationality)?.dialCode ?? "")}
              onDialCodeChange={setWaDialCode}
              placeholder="e.g. 712 345 678"
            />
            <label style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, cursor: "pointer" }}>
              <input
                type="checkbox"
                style={{ width: 13, height: 13 }}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange("whatsAppNo", form.phoneNumber || "");
                    setWaDialCode(phoneDialCode);
                  }
                }}
              />
              <span style={{ fontSize: 11, color: "#9090a8" }}>Same as phone number</span>
            </label>
          </MF>

          <MF label="Passport No.">
            <Inp type="text" placeholder="Enter passport number" value={form.PassportNo || ""} onChange={e => onChange("PassportNo", e.target.value)} />
          </MF>

          <MF label="Availability of Driving Licence">
            <Sel value={form.hasDrivingLicence || ""} onChange={e => onChange("hasDrivingLicence", e.target.value)}>
              <option value="">Select an option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Sel>
          </MF>

          <MF label="Email *">
            <Inp type="email" placeholder="Enter email" value={form.email || ""} onChange={e => onChange("email", e.target.value)} />
          </MF>
          <MF label="Age">
            <Inp type="number" placeholder="Enter age" value={form.age || ""} onChange={e => onChange("age", e.target.value)} />
          </MF>
        </div>

        {/* Footer */}
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
};

export { PersonalModal, NationalitySelect, PhoneInput, useCountries };
export default PersonalModal;