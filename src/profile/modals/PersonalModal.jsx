import { useCallback, useEffect, useState } from "react";
import { Icon } from "../shared/Icons";
import { FALLBACK_KENYA_COUNTIES } from "../shared/constants";
import { computeAge } from "../shared/utils";
import { GhostBtn, PrimaryBtn, Inp, Sel, MF, inputCls } from "../shared/ui";
import useCountries from "../hooks/useCountries";
import NationalitySelect from "../inputs/NationalitySelect";
import LocationSelect from "../inputs/LocationSelect";
import PhoneInput from "../inputs/PhoneInput";
import CvAutofillBanner from "../cv/CvAutofillBanner";
import { matchOption } from "../cv/cvNormalize";

const extractCountryFromLocation = (loc) => {
  if (!loc) return "";
  const parts = loc.split(",").map((p) => p.trim()).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : "";
};

export default function PersonalModal({ form, onChange, onClose, onSave, saving, saveMsg }) {
  const { countries, loading } = useCountries();

  const [locationCountry, setLocationCountry] = useState(
    () => extractCountryFromLocation(form.location || "") || form.nationality || "",
  );
  const [countryLocations, setCountryLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [kenyaCounties, setKenyaCounties] = useState([]);
  const [loadingKenyaCounties, setLoadingKenyaCounties] = useState(false);
  const [phoneDialCode, setPhoneDialCode] = useState("");
  const [waDialCode, setWaDialCode] = useState("");

  const extractDialCode = useCallback((phone, countryList) => {
    if (!phone || !countryList.length) return "";
    const sorted = [...countryList].sort((a, b) => b.dialCode.length - a.dialCode.length);
    for (const c of sorted) if (phone.startsWith(c.dialCode)) return c.dialCode;
    return "";
  }, []);

  // City list for the chosen country
  useEffect(() => {
    const country = countries.find((c) => c.name === locationCountry);
    if (!locationCountry) { setCountryLocations([]); setLoadingLocations(false); return; }

    const existing = form.location || "";
    const includeExisting = existing && extractCountryFromLocation(existing) === locationCountry ? [existing] : [];
    const fallback = country?.capital ? [`${country.capital}, ${country.name}`] : [locationCountry];

    setLoadingLocations(true);
    fetch("https://countriesnow.space/api/v0.1/countries/cities", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: locationCountry }),
    })
      .then((r) => r.json())
      .then((data) => {
        const apiCities = Array.isArray(data?.data) ? data.data : [];
        setCountryLocations([...new Set([
          ...apiCities.map((city) => `${city}, ${locationCountry}`), ...includeExisting, ...fallback,
        ])]);
      })
      .catch(() => setCountryLocations([...new Set([...fallback, ...includeExisting])]))
      .finally(() => setLoadingLocations(false));
  }, [locationCountry, countries, form.location]);

  // Kenya "Home County"
  useEffect(() => {
    if (form.nationality !== "Kenya") { setKenyaCounties([]); setLoadingKenyaCounties(false); return; }
    setLoadingKenyaCounties(true);
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: "Kenya" }),
    })
      .then((r) => r.json())
      .then((data) => {
        const apiStates =
          (Array.isArray(data?.data?.states) && data.data.states) ||
          (Array.isArray(data?.data) && data.data) ||
          (Array.isArray(data?.states) && data.states) || [];
        const fromApi = apiStates.map((s) => s?.name || s?.state || s).filter(Boolean);
        setKenyaCounties([...new Set([...fromApi, ...FALLBACK_KENYA_COUNTIES])]);
      })
      .catch(() => setKenyaCounties(FALLBACK_KENYA_COUNTIES))
      .finally(() => setLoadingKenyaCounties(false));
  }, [form.nationality]);

  // Detect dial codes from saved values once countries are ready
  useEffect(() => {
    if (!countries.length) return;
    if (!phoneDialCode) setPhoneDialCode(extractDialCode(form.phoneNumber || "", countries));
    if (!waDialCode) setWaDialCode(extractDialCode(form.whatsAppNo || "", countries));
    if (!phoneDialCode && form.nationality) {
      const match = countries.find((c) => c.name === form.nationality);
      if (match) { setPhoneDialCode(match.dialCode); setWaDialCode(match.dialCode); }
    }
  }, [countries]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNationalityChange = useCallback(
    (country) => {
      onChange("nationality", country.name);
      setPhoneDialCode(country.dialCode);
      setWaDialCode(country.dialCode);
      if (!form.location && !locationCountry) {
        setLocationCountry(country.name);
        onChange("location", country.capital ? `${country.capital}, ${country.name}` : country.name);
      }
      const rawPhone = (form.phoneNumber || "").replace(/^\+\d{1,4}\s?/, "").trim();
      const rawWa = (form.whatsAppNo || "").replace(/^\+\d{1,4}\s?/, "").trim();
      if (rawPhone) onChange("phoneNumber", `${country.dialCode} ${rawPhone}`);
      if (rawWa) onChange("whatsAppNo", `${country.dialCode} ${rawWa}`);
    },
    [form.location, form.phoneNumber, form.whatsAppNo, countries, onChange, locationCountry],
  );

  const handleLocationCountryChange = useCallback(
    (country) => {
      setLocationCountry(country.name);
      const parts = (form.location || "").split(",").map((p) => p.trim()).filter(Boolean);
      const cityPart = parts.length > 1 ? parts.slice(0, -1).join(", ") : "";
      if (cityPart) onChange("location", `${cityPart}, ${country.name}`);
      else onChange("location", country.capital ? `${country.capital}, ${country.name}` : country.name);
    },
    [form.location, onChange],
  );

  const syncWhatsApp = (e) => {
    if (e.target.checked) { onChange("whatsAppNo", form.phoneNumber || ""); setWaDialCode(phoneDialCode); }
  };

  // ── CV auto-fill: only fills fields that are still empty ──
  const applyFromCv = (cv) => {
    const p = cv.personal || {};
    let n = 0;
    const fill = (k, v) => { if (v && !form[k]) { onChange(k, v); n++; } };
    ["firstName", "secondName", "lastName", "email", "idNumber", "PassportNo"].forEach((k) => fill(k, p[k]));

    let country = countries.find((c) => c.name === form.nationality);
    if (!form.nationality && p.nationality) {
      const name = matchOption(p.nationality, countries.map((c) => c.name));
      const found = countries.find((c) => c.name === name);
      if (found) { handleNationalityChange(found); country = found; n++; }
    }

    const fmtPhone = (raw, fallbackDial) => {
      const s = String(raw).replace(/[^\d+\s()-]/g, "").trim();
      const code = extractDialCode(s, countries);
      if (code) return { value: `${code} ${s.slice(code.length).trim()}`, code };
      const local = s.replace(/^0+/, "").trim();
      return { value: fallbackDial ? `${fallbackDial} ${local}` : local, code: fallbackDial || "" };
    };
    const dial = country?.dialCode || phoneDialCode;
    if (p.phoneNumber && !form.phoneNumber) {
      const f = fmtPhone(p.phoneNumber, dial);
      onChange("phoneNumber", f.value);
      if (f.code) setPhoneDialCode(f.code);
      n++;
    }
    const waSource = p.whatsAppNo || p.phoneNumber;
    if (waSource && !form.whatsAppNo) {
      const f = fmtPhone(waSource, dial);
      onChange("whatsAppNo", f.value);
      if (f.code) setWaDialCode(f.code);
      n++;
    }

    if (p.location && !form.location) {
      const parts = p.location.split(",").map((x) => x.trim()).filter(Boolean);
      const names = countries.map((c) => c.name);
      const guess = parts.length > 1 ? matchOption(parts[parts.length - 1], names) : "";
      const cName = guess || country?.name || form.nationality || locationCountry;
      onChange("location", guess || !cName ? parts.join(", ") : `${parts.join(", ")}, ${cName}`);
      if (cName) setLocationCountry(cName);
      n++;
    }

    if (p.dateOfBirth && !form.dateOfBirth) {
      onChange("dateOfBirth", p.dateOfBirth);
      onChange("age", computeAge(p.dateOfBirth));
      n++;
    }
    return n;
  };

  const dialFor = (code) => code || countries.find((c) => c.name === form.nationality)?.dialCode || "";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.08)] flex-shrink-0">
          <div>
            <h2 className="font-semibold text-[#1a1a2e] text-[15px]">Edit Personal Details</h2>
            <p className="text-[#9090a8] text-xs mt-0.5">Update your personal information</p>
          </div>
          <button onClick={onClose} className="text-[#9090a8] hover:text-[#1a1a2e] transition p-1 rounded-lg hover:bg-[#f4f6fb]">{Icon.x}</button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {saveMsg && (
            <p className={`text-sm font-medium ${saveMsg.includes("success") ? "text-green-600" : "text-red-500"}`}>{saveMsg}</p>
          )}

          <CvAutofillBanner section="personal" unit="field" onAutofill={applyFromCv} />

          <MF label="First Name *"><Inp type="text" placeholder="Enter first name" value={form.firstName || ""} onChange={(e) => onChange("firstName", e.target.value)} /></MF>
          <MF label="Second Name"><Inp type="text" placeholder="Enter second name" value={form.secondName || ""} onChange={(e) => onChange("secondName", e.target.value)} /></MF>
          <MF label="Last Name *"><Inp type="text" placeholder="Enter last name" value={form.lastName || ""} onChange={(e) => onChange("lastName", e.target.value)} /></MF>
          <MF label="ID Number"><Inp type="text" placeholder="Enter ID number" value={form.idNumber || ""} onChange={(e) => onChange("idNumber", e.target.value)} /></MF>

          <MF label="Nationality *">
            {loading ? (
              <div className={inputCls + " flex items-center gap-2 text-[#9090a8]"}>{Icon.spin} Loading countries…</div>
            ) : (
              <NationalitySelect value={form.nationality || ""} onChange={handleNationalityChange} countries={countries} loading={loading} />
            )}
            {form.nationality && (
              <p style={{ fontSize: 11, color: "#9090a8", marginTop: 2 }}>Dial codes update automatically when you change nationality.</p>
            )}
          </MF>

          <MF label="Current Location *">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 12, alignItems: "start" }}>
              <div>
                {loading ? (
                  <div className={inputCls + " flex items-center gap-2 text-[#9090a8]"}>{Icon.spin} Loading countries…</div>
                ) : (
                  <NationalitySelect value={locationCountry || ""} onChange={handleLocationCountryChange} countries={countries} loading={loading} />
                )}
              </div>
              <div>
                <LocationSelect value={form.location || ""} onChange={(v) => onChange("location", v)}
                  options={countryLocations} loading={loadingLocations} disabled={!locationCountry} />
              </div>
            </div>
            <p style={{ fontSize: 11, color: "#9090a8", marginTop: 2 }}>Choose your current country first, then pick a city/location.</p>
          </MF>

          {form.nationality === "Kenya" && (
            <MF label="Home County">
              <Sel value={form.homeCounty || ""} onChange={(e) => onChange("homeCounty", e.target.value)} disabled={loadingKenyaCounties}>
                <option value="">{loadingKenyaCounties ? "Loading counties…" : "Select home county"}</option>
                {kenyaCounties.map((c) => <option key={c} value={c}>{c}</option>)}
              </Sel>
            </MF>
          )}

          <MF label="Phone Number *">
            <PhoneInput value={form.phoneNumber || ""} onChange={(v) => onChange("phoneNumber", v)} countries={countries}
              selectedDialCode={dialFor(phoneDialCode)} selectedCountryName={form.nationality || ""}
              onDialCodeChange={setPhoneDialCode} placeholder="e.g. 712 345 678" />
          </MF>

          <MF label="WhatsApp No. *">
            <PhoneInput value={form.whatsAppNo || ""} onChange={(v) => onChange("whatsAppNo", v)} countries={countries}
              selectedDialCode={dialFor(waDialCode)} selectedCountryName={form.nationality || ""}
              onDialCodeChange={setWaDialCode} placeholder="e.g. 712 345 678" />
            <label style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, cursor: "pointer" }}>
              <input type="checkbox" style={{ width: 13, height: 13 }} onChange={syncWhatsApp} />
              <span style={{ fontSize: 11, color: "#9090a8" }}>Same as phone number</span>
            </label>
          </MF>

          <MF label="Passport No."><Inp type="text" placeholder="Enter passport number" value={form.PassportNo || ""} onChange={(e) => onChange("PassportNo", e.target.value)} /></MF>

          <MF label="Availability of Driving Licence">
            <Sel value={form.hasDrivingLicence || ""} onChange={(e) => onChange("hasDrivingLicence", e.target.value)}>
              <option value="">Select an option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Sel>
          </MF>

          <MF label="Email *"><Inp type="email" placeholder="Enter email" value={form.email || ""} onChange={(e) => onChange("email", e.target.value)} /></MF>

          <MF label="Date of Birth">
            <Inp type="date" max={new Date().toISOString().split("T")[0]} value={form.dateOfBirth || ""}
              onChange={(e) => {
                const dob = e.target.value;
                onChange("dateOfBirth", dob);
                onChange("age", dob ? computeAge(dob) : "");
              }} />
            {form.age && <p style={{ fontSize: 11, color: "#1a6edb", marginTop: 4, fontWeight: 500 }}>Age: {form.age} years old</p>}
          </MF>
        </div>

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
}
