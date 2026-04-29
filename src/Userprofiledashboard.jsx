import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useUser } from "./Context/UserContext";
import Dashboard from "./Dashboard";
import { ApplyConfirmModal } from "./Dashboard";
import { useSavedJobs } from "../hooks/useSavedJobs";
import { SavedJobsPanel } from "./components/SavedJobsPanel";
import { SaveJobButton } from "./savedjobs/SaveJobButton";
import ApplicationsPage from "./components/ApplicationsPage";
import JobSettingsPage from "./components/JobSettingsPage";
import MessagesPage from "./components/MessagesPage";
import { io } from "socket.io-client";


const API = "/api";

// ─── Icon helpers ─────────────────────────────────────────────────────────────
const Icon = {
  home: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
      <path
        fillRule="evenodd"
        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
        clipRule="evenodd"
      />
    </svg>
  ),
  file: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
      <path
        fillRule="evenodd"
        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
      <path
        fillRule="evenodd"
        d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
        clipRule="evenodd"
      />
      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
      <path
        fillRule="evenodd"
        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
        clipRule="evenodd"
      />
    </svg>
  ),
  apps: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  msg: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
      <path
        fillRule="evenodd"
        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
        clipRule="evenodd"
      />
    </svg>
  ),
  bookmark: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
    </svg>
  ),
  edit: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  ),
  save: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  ),
  upload: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path
        fillRule="evenodd"
        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
      <path
        fillRule="evenodd"
        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  spin: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      width="16"
      height="16"
      style={{ animation: "spin 1s linear infinite" }}
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0110 10" />
    </svg>
  ),
  download: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path
        fillRule="evenodd"
        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
      <path
        fillRule="evenodd"
        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  tag: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
      <path
        fillRule="evenodd"
        d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
      <path
        fillRule="evenodd"
        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  camera: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
      <path
        fillRule="evenodd"
        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
        clipRule="evenodd"
      />
    </svg>
  ),
  externalLink: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
    </svg>
  ),
};

// ─── Completion ───────────────────────────────────────────────────────────────
const completionFields = [
  "firstName",
  "lastName",
  "email",
  "phoneNumber",
  "nationality",
  "location",
  "specialization",
"highestEducationLevel",
  "savedCvFileId",
];
function calcCompletion(profile) {
  if (!profile) return 0;
  const filled = completionFields.filter((f) => profile[f]).length;
  return Math.round((filled / completionFields.length) * 100);
}

// ─── Shared input styles ──────────────────────────────────────────────────────
const inputCls = `w-full px-3 py-2 rounded-lg border border-[rgba(0,0,0,0.1)] bg-[#f8f9fc]
  text-[13.5px] text-[#1a1a2e] placeholder-[#9090a8]
  focus:outline-none focus:ring-2 focus:ring-[#1a6edb40] focus:border-[#1a6edb]
  disabled:bg-[#f4f6fb] disabled:text-[#9090a8] transition`;

const Inp = (props) => <input {...props} className={inputCls} />;
const Sel = ({ children, ...props }) => (
  <select {...props} className={inputCls + " cursor-pointer"}>
    {children}
  </select>
);

// ─── Reusable UI atoms ────────────────────────────────────────────────────────
const GhostBtn = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(0,0,0,0.13)] text-[#5a5a72] text-[12.5px] hover:bg-[#f4f6fb] transition"
  >
    {children}
  </button>
);
const PrimaryBtn = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a6edb] text-white text-[12.5px] font-medium hover:bg-[#0d4fa3] disabled:opacity-50 transition"
  >
    {children}
  </button>
);
const AddBtn = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-3.5 py-1.5 border-[1.5px] border-dashed border-[#1a6edb60] rounded-[9px] text-[#1a6edb] text-[12.5px] font-medium hover:bg-[#e8f1fd] transition"
  >
    {Icon.plus}
    {children}
  </button>
);

const FL = ({ label }) => (
  <span
    style={{
      fontSize: 11,
      fontWeight: 500,
      color: "#9090a8",
      textTransform: "uppercase",
      letterSpacing: "0.07em",
    }}
  >
    {label}
  </span>
);

const SectionCard = ({ dotColor = "#1a6edb", title, action, children }) => (
  <div className="bg-white rounded-[14px] border border-[rgba(0,0,0,0.08)] overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: dotColor }}
        />
        <span className="text-[14px] font-medium text-[#1a1a2e]">{title}</span>
      </div>
      {action}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Modal = ({ title, subtitle, onClose, onSave, saving, children }) => (
  <div className="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="modal-sheet bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.08)] flex-shrink-0">
        <div>
          <h2 className="font-semibold text-[#1a1a2e] text-[15px]">{title}</h2>
          {subtitle && (
            <p className="text-[#9090a8] text-xs mt-0.5">{subtitle}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-[#9090a8] hover:text-[#1a1a2e] transition p-1 rounded-lg hover:bg-[#f4f6fb]"
        >
          {Icon.x}
        </button>
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

const MF = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <FL label={label} />
    {children}
  </div>
);

const NavItem = ({ icon, label, active, badge, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-[10px] text-[13.5px] transition text-left
      ${active ? "bg-[#e8f1fd] text-[#1a6edb] font-medium" : "text-[#5a5a72] hover:bg-[#f4f6fb] hover:text-[#1a1a2e]"}`}
  >
    <span style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>
    {label}
    {badge != null && (
      <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-px rounded-full font-medium">
        {badge}
      </span>
    )}
  </button>
);



// ─── Country data hook ────────────────────────────────────────────────────────
function useCountries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://restcountries.com/v3.1/all?fields=name,idd,flags,capital,region,subregion,cca2",
    )
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
              flag: c.flags?.emoji || "",
              flagPng: c.flags?.png || "",
              dialCode,
              capital: c.capital?.[0] || "",
              region: c.region || "",
            };
          })
          .filter((c) => c.dialCode)
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(list);
      })
      .catch(() => {
        // Fallback list if API is unreachable
        setCountries([
          {
            name: "Kenya",
            cca2: "KE",
            flag: "🇰🇪",
            flagPng: "",
            dialCode: "+254",
            capital: "Nairobi",
            region: "Africa",
          },
          {
            name: "Uganda",
            cca2: "UG",
            flag: "🇺🇬",
            flagPng: "",
            dialCode: "+256",
            capital: "Kampala",
            region: "Africa",
          },
          {
            name: "Tanzania",
            cca2: "TZ",
            flag: "🇹🇿",
            flagPng: "",
            dialCode: "+255",
            capital: "Dodoma",
            region: "Africa",
          },
          {
            name: "United States",
            cca2: "US",
            flag: "🇺🇸",
            flagPng: "",
            dialCode: "+1",
            capital: "Washington D.C.",
            region: "Americas",
          },
          {
            name: "United Kingdom",
            cca2: "GB",
            flag: "🇬🇧",
            flagPng: "",
            dialCode: "+44",
            capital: "London",
            region: "Europe",
          },
          {
            name: "South Africa",
            cca2: "ZA",
            flag: "🇿🇦",
            flagPng: "",
            dialCode: "+27",
            capital: "Pretoria",
            region: "Africa",
          },
          {
            name: "Nigeria",
            cca2: "NG",
            flag: "🇳🇬",
            flagPng: "",
            dialCode: "+234",
            capital: "Abuja",
            region: "Africa",
          },
          {
            name: "India",
            cca2: "IN",
            flag: "🇮🇳",
            flagPng: "",
            dialCode: "+91",
            capital: "New Delhi",
            region: "Asia",
          },
          {
            name: "Canada",
            cca2: "CA",
            flag: "🇨🇦",
            flagPng: "",
            dialCode: "+1",
            capital: "Ottawa",
            region: "Americas",
          },
          {
            name: "Australia",
            cca2: "AU",
            flag: "🇦🇺",
            flagPng: "",
            dialCode: "+61",
            capital: "Canberra",
            region: "Oceania",
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { countries, loading };
}

const FlagIcon = ({ flagPng, flagEmoji, cca2, size = 16 }) => {
  const [imgOk, setImgOk] = useState(true);
  const normalizedCca2 = (cca2 || "").toLowerCase();
  const cdnWidth = size <= 16 ? 20 : size <= 20 ? 24 : size <= 28 ? 32 : 40;
  const cdnSrc = normalizedCca2
    ? `https://flagcdn.com/w${cdnWidth}/${normalizedCca2}.png`
    : "";

  const src = flagPng || cdnSrc;

  useEffect(() => {
    setImgOk(true);
  }, [src]);

  if (src && imgOk) {
    return (
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        style={{ borderRadius: 3, objectFit: "cover", display: "block" }}
        onError={() => setImgOk(false)}
      />
    );
  }

  return <span style={{ fontSize: size }}>{flagEmoji || "🏳️"}</span>;
};

// ─── Nationality searchable dropdown ─────────────────────────────────────────
const NationalitySelect = ({ value, onChange, countries, loading }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();
  const searchRef = useRef();

  const selected = countries.find((c) => c.name === value);
  const filtered = search.trim()
    ? countries.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()),
      )
    : countries;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
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
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setTimeout(() => searchRef.current?.focus(), 50);
        }}
        className={
          inputCls + " flex items-center gap-2 text-left cursor-pointer"
        }
        style={{ justifyContent: "space-between" }}
      >
        {loading ? (
          <span style={{ color: "#9090a8" }}>Loading countries…</span>
        ) : selected ? (
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FlagIcon
              flagPng={selected.flagPng}
              flagEmoji={selected.flag}
              cca2={selected.cca2}
              size={16}
            />
            <span>{selected.name}</span>
          </span>
        ) : (
          <span style={{ color: "#9090a8" }}>Select nationality…</span>
        )}
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          width="14"
          height="14"
          style={{
            color: "#9090a8",
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.15s",
          }}
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 200,
            background: "#fff",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "8px 10px",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <input
              ref={searchRef}
              type="text"
              placeholder="Search country…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.1)",
                background: "#f8f9fc",
                fontSize: 13,
                outline: "none",
                color: "#1a1a2e",
              }}
            />
          </div>
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div
                style={{ padding: "12px 14px", fontSize: 13, color: "#9090a8" }}
              >
                No results
              </div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.cca2}
                  type="button"
                  onClick={() => select(c)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "8px 14px",
                    textAlign: "left",
                    background:
                      selected?.cca2 === c.cca2 ? "#e8f1fd" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13.5,
                    color: "#1a1a2e",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    if (selected?.cca2 !== c.cca2)
                      e.currentTarget.style.background = "#f4f6fb";
                  }}
                  onMouseLeave={(e) => {
                    if (selected?.cca2 !== c.cca2)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span style={{ flexShrink: 0 }}>
                    <FlagIcon
                      flagPng={c.flagPng}
                      flagEmoji={c.flag}
                      cca2={c.cca2}
                      size={16}
                    />
                  </span>
                  <span style={{ flex: 1 }}>{c.name}</span>
                  <span
                    style={{ fontSize: 12, color: "#9090a8", flexShrink: 0 }}
                  >
                    {c.dialCode}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const LocationSelect = ({ value, onChange, options, loading, disabled }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();
  const searchRef = useRef();

  const filtered = search.trim()
    ? options.filter((loc) => loc.toLowerCase().includes(search.toLowerCase()))
    : options;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (location) => {
    onChange(location);
    setSearch("");
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setOpen((o) => !o);
            setTimeout(() => searchRef.current?.focus(), 50);
          }
        }}
        className={
          inputCls +
          " flex items-center gap-2 text-left cursor-pointer disabled:cursor-not-allowed"
        }
        style={{ justifyContent: "space-between" }}
      >
        {loading ? (
          <span style={{ color: "#9090a8" }}>Loading locations…</span>
        ) : value ? (
          <span>{value}</span>
        ) : (
          <span style={{ color: "#9090a8" }}>
            {disabled
              ? "Select nationality first…"
              : "Select current location…"}
          </span>
        )}
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          width="14"
          height="14"
          style={{
            color: "#9090a8",
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.15s",
          }}
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && !disabled && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 200,
            background: "#fff",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "8px 10px",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <input
              ref={searchRef}
              type="text"
              placeholder="Search location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.1)",
                background: "#f8f9fc",
                fontSize: 13,
                outline: "none",
                color: "#1a1a2e",
              }}
            />
          </div>
          <div style={{ maxHeight: 220, overflowY: "auto" }}>
            {filtered.length === 0 ? (
              <div
                style={{ padding: "12px 14px", fontSize: 13, color: "#9090a8" }}
              >
                No locations found
              </div>
            ) : (
              filtered.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => select(loc)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    padding: "8px 14px",
                    textAlign: "left",
                    background: value === loc ? "#e8f1fd" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13.5,
                    color: "#1a1a2e",
                  }}
                  onMouseEnter={(e) => {
                    if (value !== loc)
                      e.currentTarget.style.background = "#f4f6fb";
                  }}
                  onMouseLeave={(e) => {
                    if (value !== loc)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span style={{ flex: 1 }}>{loc}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Phone input with country code picker ─────────────────────────────────────
const PhoneInput = ({
  value,
  onChange,
  countries,
  selectedDialCode,
  selectedCountryName,
  onDialCodeChange,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();
  const searchRef = useRef();

  // Extract just the number portion (strip leading dial code)
  const numberOnly = (() => {
    if (!value) return "";
    if (selectedDialCode && value.startsWith(selectedDialCode)) {
      return value.slice(selectedDialCode.length).trimStart();
    }
    return value.replace(/^\+\d{1,4}\s?/, "");
  })();

  const selectedCountry =
    countries.find(
      (c) => c.dialCode === selectedDialCode && c.name === selectedCountryName,
    ) ||
    countries.find((c) => c.dialCode === selectedDialCode) ||
    countries.find((c) => c.name === selectedCountryName) ||
    null;
  const fallbackFlag = countries.find((c) => c.flag)?.flag || "🏳️";
  const filtered = search.trim()
    ? countries.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.dialCode.includes(search),
      )
    : countries;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
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
      {/* Dial code button */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => {
            setOpen((o) => !o);
            setTimeout(() => searchRef.current?.focus(), 50);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "8px 10px",
            borderRadius: 9,
            border: "1px solid rgba(0,0,0,0.1)",
            background: "#f8f9fc",
            fontSize: 13,
            cursor: "pointer",
            color: "#1a1a2e",
            whiteSpace: "nowrap",
            height: "100%",
          }}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            <FlagIcon
              flagPng={selectedCountry?.flagPng || ""}
              flagEmoji={selectedCountry?.flag || fallbackFlag}
              cca2={selectedCountry?.cca2}
              size={15}
            />
          </span>
          <span style={{ fontWeight: 500 }}>{selectedDialCode || "+?"}</span>
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            width="11"
            height="11"
            style={{
              color: "#9090a8",
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.15s",
            }}
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {open && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              zIndex: 200,
              width: 250,
              background: "#fff",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.1)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "8px 10px",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <input
                ref={searchRef}
                type="text"
                placeholder="Search country…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid rgba(0,0,0,0.1)",
                  background: "#f8f9fc",
                  fontSize: 13,
                  outline: "none",
                  color: "#1a1a2e",
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
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                    padding: "7px 12px",
                    textAlign: "left",
                    background:
                      selectedCountry?.cca2 === c.cca2
                        ? "#e8f1fd"
                        : "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    color: "#1a1a2e",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f4f6fb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      selectedCountry?.cca2 === c.cca2
                        ? "#e8f1fd"
                        : "transparent";
                  }}
                >
                  <span style={{ fontSize: 15, flexShrink: 0 }}>
                    <FlagIcon
                      flagPng={c.flagPng}
                      flagEmoji={c.flag}
                      cca2={c.cca2}
                      size={15}
                    />
                  </span>
                  <span
                    style={{
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.name}
                  </span>
                  <span
                    style={{ color: "#1a6edb", fontWeight: 500, flexShrink: 0 }}
                  >
                    {c.dialCode}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Number field */}
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

// ─── Quick Apply Modal ────────────────────────────────────────────────────────
const QuickApplyModal = ({ onClose, savedCvName, token }) => {
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [useSaved, setUseSaved] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [terms, setTerms] = useState(false);
  const fileRef = useRef();

  const submit = async () => {
    if (!terms) {
      setError("Please accept the terms before submitting.");
      return;
    }
    if (!position.trim()) {
      setError("Please enter the position you are applying for.");
      return;
    }
    if (!savedCvName && !cvFile) {
      setError("Please upload a CV.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("positionapplied", position);
      fd.append("salaryInfo", salary);
      if (!useSaved && cvFile) fd.append("cv", cvFile);
      await api.post(`${API}/applications`, fd);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || "Error submitting application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.08)]">
          <div>
            <h2 className="font-semibold text-[#1a1a2e] text-[15px]">
              Quick Apply
            </h2>
            <p className="text-[#9090a8] text-xs mt-0.5">
              Your saved profile will be attached automatically
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9090a8] hover:text-[#1a1a2e] transition p-1 rounded-lg hover:bg-[#f4f6fb]"
          >
            {Icon.x}
          </button>
        </div>
        {success ? (
          <div className="flex flex-col items-center py-12 gap-3">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-500">
              {Icon.check}
            </div>
            <p className="font-semibold text-[#1a1a2e]">
              Application Submitted!
            </p>
            <p className="text-[#9090a8] text-sm text-center px-8">
              We've received your application and will be in touch soon.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <MF label="Position Applying For *">
              <Inp
                type="text"
                placeholder="e.g. Senior Accountant"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </MF>
            <MF label="Current Salary (optional)">
              <Inp
                type="number"
                placeholder="e.g. 80000"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </MF>
            <div>
              <FL label="CV / Resume" />
              <div className="mt-2 space-y-2">
                {savedCvName && (
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-[#5a5a72]">
                    <input
                      type="radio"
                      checked={useSaved}
                      onChange={() => {
                        setUseSaved(true);
                        setCvFile(null);
                      }}
                    />
                    Use saved:{" "}
                    <span className="font-medium text-[#1a6edb]">
                      {savedCvName}
                    </span>
                  </label>
                )}
                <label className="flex items-center gap-2 cursor-pointer text-sm text-[#5a5a72]">
                  <input
                    type="radio"
                    checked={!useSaved}
                    onChange={() => setUseSaved(false)}
                  />
                  Upload a different CV
                </label>
                {!useSaved && (
                  <>
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setCvFile(e.target.files[0])}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-[#1a6edb60] rounded-lg text-[#1a6edb] hover:bg-[#e8f1fd] transition text-sm"
                    >
                      {Icon.upload}{" "}
                      {cvFile ? cvFile.name : "Choose file (PDF / DOC)"}
                    </button>
                  </>
                )}
              </div>
            </div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => {
                  setTerms(e.target.checked);
                  setError("");
                }}
                className="mt-0.5 w-4 h-4"
              />
              <span className="text-xs text-[#9090a8]">
                I confirm all profile information is accurate and consent to
                AMSOL processing my data for recruitment.
              </span>
            </label>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              onClick={submit}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#1a6edb] text-white text-sm font-semibold hover:bg-[#0d4fa3] disabled:opacity-50 flex items-center justify-center gap-2 transition"
            >
              {loading ? <>{Icon.spin} Submitting…</> : "Submit Application"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Personal Info Modal (with nationality dropdown, location auto-fill, phone codes) ──
const PersonalModal = ({
  form,
  onChange,
  onClose,
  onSave,
  saving,
  saveMsg,
}) => {
  const { countries, loading } = useCountries();
  const extractCountryFromLocation = (loc) => {
    if (!loc) return "";
    // Expect format like "City, Country"
    const parts = loc
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    return parts.length ? parts[parts.length - 1] : "";
  };

  // Independent from nationality: user can choose country + city here
  const [locationCountry, setLocationCountry] = useState(() => {
    return (
      extractCountryFromLocation(form.location || "") || form.nationality || ""
    );
  });

  const [countryLocations, setCountryLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Kenya-specific: "Home County"
  const [kenyaCounties, setKenyaCounties] = useState([]);
  const [loadingKenyaCounties, setLoadingKenyaCounties] = useState(false);

  // Helper: extract dial code from a stored phone string
  const extractDialCode = useCallback((phone, countryList) => {
    if (!phone || !countryList.length) return "";
    // Sort longest first so "+254" matches before "+"
    const sorted = [...countryList].sort(
      (a, b) => b.dialCode.length - a.dialCode.length,
    );
    for (const c of sorted) {
      if (phone.startsWith(c.dialCode)) return c.dialCode;
    }
    return "";
  }, []);

  const [phoneDialCode, setPhoneDialCode] = useState("");
  const [waDialCode, setWaDialCode] = useState("");

  useEffect(() => {
    const country = countries.find((c) => c.name === locationCountry);

    if (!locationCountry) {
      setCountryLocations([]);
      setLoadingLocations(false);
      return;
    }

    setLoadingLocations(true);
    fetch("https://countriesnow.space/api/v0.1/countries/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: locationCountry }),
    })
      .then((r) => r.json())
      .then((data) => {
        const apiCities = Array.isArray(data?.data) ? data.data : [];
        const fallback = country?.capital
          ? [`${country.capital}, ${country.name}`]
          : [locationCountry];
        const existing = form.location || "";
        const existingCountry = extractCountryFromLocation(existing);
        const includeExisting =
          existing && existingCountry === locationCountry ? [existing] : [];
        const merged = [
          ...new Set([
            ...apiCities.map((city) => `${city}, ${locationCountry}`),
            ...includeExisting,
            ...fallback,
          ]),
        ];
        setCountryLocations(merged);
      })
      .catch(() => {
        const fallback = country?.capital
          ? [`${country.capital}, ${country.name}`]
          : [locationCountry];
        const existing = form.location || "";
        const existingCountry = extractCountryFromLocation(existing);
        const includeExisting =
          existing && existingCountry === locationCountry ? [existing] : [];
        setCountryLocations([...new Set([...fallback, ...includeExisting])]);
      })
      .finally(() => setLoadingLocations(false));
  }, [locationCountry, countries, form.location]);

  useEffect(() => {
    if (form.nationality !== "Kenya") {
      setKenyaCounties([]);
      setLoadingKenyaCounties(false);
      return;
    }

    // Fallback list (47 counties)
    const FALLBACK_KENYA_COUNTIES = [
      "Baringo",
      "Bomet",
      "Bungoma",
      "Busia",
      "Elgeyo-Marakwet",
      "Embu",
      "Garissa",
      "Homa Bay",
      "Isiolo",
      "Kajiado",
      "Kakamega",
      "Kericho",
      "Kiambu",
      "Kilifi",
      "Kirinyaga",
      "Kisii",
      "Kisumu",
      "Kitui",
      "Kwale",
      "Laikipia",
      "Lamu",
      "Machakos",
      "Makueni",
      "Mandera",
      "Marsabit",
      "Meru",
      "Migori",
      "Mombasa",
      "Murang'a",
      "Nairobi",
      "Nakuru",
      "Nandi",
      "Narok",
      "Nyamira",
      "Nyeri",
      "Samburu",
      "Siaya",
      "Taita-Taveta",
      "Tana River",
      "Tharaka-Nithi",
      "Trans Nzoia",
      "Turkana",
      "Uasin Gishu",
      "Vihiga",
      "Wajir",
      "West Pokot",
    ];

    setLoadingKenyaCounties(true);
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: "Kenya" }),
    })
      .then((r) => r.json())
      .then((data) => {
        const apiStates =
          (Array.isArray(data?.data?.states) && data.data.states) ||
          (Array.isArray(data?.data) && data.data) ||
          (Array.isArray(data?.states) && data.states) ||
          [];
        const fromApi = apiStates
          .map((s) => s?.name || s?.state || s)
          .filter(Boolean);
        const merged = [
          ...new Set([...(fromApi || []), ...FALLBACK_KENYA_COUNTIES]),
        ];
        setKenyaCounties(merged);
      })
      .catch(() => {
        setKenyaCounties(FALLBACK_KENYA_COUNTIES);
      })
      .finally(() => setLoadingKenyaCounties(false));
  }, [form.nationality]);

  // Once countries load, try to detect dial codes from existing saved values
  useEffect(() => {
    if (!countries.length) return;
    if (!phoneDialCode)
      setPhoneDialCode(extractDialCode(form.phoneNumber || "", countries));
    if (!waDialCode)
      setWaDialCode(extractDialCode(form.whatsAppNo || "", countries));
    // If nationality already set and no dial code detected yet, seed from nationality
    if (!phoneDialCode && form.nationality) {
      const match = countries.find((c) => c.name === form.nationality);
      if (match) {
        setPhoneDialCode(match.dialCode);
        setWaDialCode(match.dialCode);
      }
    }
  }, [countries]); // eslint-disable-line react-hooks/exhaustive-deps

  // When user picks a nationality from the dropdown
  const handleNationalityChange = useCallback(
    (country) => {
      onChange("nationality", country.name);
      // Update dial codes
      setPhoneDialCode(country.dialCode);
      setWaDialCode(country.dialCode);
      // Only seed location once if user hasn't chosen it yet
      if (!form.location && !locationCountry) {
        const seeded = country.capital
          ? `${country.capital}, ${country.name}`
          : country.name;
        setLocationCountry(country.name);
        onChange("location", seeded);
      }
      // Preserve existing number portion
      const rawPhone = (form.phoneNumber || "")
        .replace(/^\+\d{1,4}\s?/, "")
        .trim();
      const rawWa = (form.whatsAppNo || "").replace(/^\+\d{1,4}\s?/, "").trim();
      if (rawPhone) onChange("phoneNumber", `${country.dialCode} ${rawPhone}`);
      if (rawWa) onChange("whatsAppNo", `${country.dialCode} ${rawWa}`);
    },
    [
      form.location,
      form.phoneNumber,
      form.whatsAppNo,
      countries,
      onChange,
      locationCountry,
    ],
  );

  const handleLocationCountryChange = useCallback(
    (country) => {
      setLocationCountry(country.name);

      const current = form.location || "";
      const parts = current
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
      const cityPart = parts.length > 1 ? parts.slice(0, -1).join(", ") : "";

      if (cityPart) {
        onChange("location", `${cityPart}, ${country.name}`);
      } else {
        onChange(
          "location",
          country.capital
            ? `${country.capital}, ${country.name}`
            : country.name,
        );
      }
    },
    [form.location, onChange],
  );

  // Sync same-as-phone checkbox
  const syncWhatsApp = (e) => {
    if (e.target.checked) {
      onChange("whatsAppNo", form.phoneNumber || "");
      setWaDialCode(phoneDialCode);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.08)] flex-shrink-0">
          <div>
            <h2 className="font-semibold text-[#1a1a2e] text-[15px]">
              Edit Personal Details
            </h2>
            <p className="text-[#9090a8] text-xs mt-0.5">
              Update your personal information
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9090a8] hover:text-[#1a1a2e] transition p-1 rounded-lg hover:bg-[#f4f6fb]"
          >
            {Icon.x}
          </button>
        </div>

        {/* Scrollable body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {saveMsg && (
            <p
              className={`text-sm font-medium ${saveMsg.includes("success") ? "text-green-600" : "text-red-500"}`}
            >
              {saveMsg}
            </p>
          )}

          <MF label="First Name *">
            <Inp
              type="text"
              placeholder="Enter first name"
              value={form.firstName || ""}
              onChange={(e) => onChange("firstName", e.target.value)}
            />
          </MF>
          <MF label="Second Name">
            <Inp
              type="text"
              placeholder="Enter second name"
              value={form.secondName || ""}
              onChange={(e) => onChange("secondName", e.target.value)}
            />
          </MF>
          <MF label="Last Name *">
            <Inp
              type="text"
              placeholder="Enter last name"
              value={form.lastName || ""}
              onChange={(e) => onChange("lastName", e.target.value)}
            />
          </MF>
          <MF label="ID Number">
            <Inp
              type="text"
              placeholder="Enter ID number"
              value={form.idNumber || ""}
              onChange={(e) => onChange("idNumber", e.target.value)}
            />
          </MF>

          {/* ── Nationality — searchable dropdown from API ── */}
          <MF label="Nationality *">
            {loading ? (
              <div
                className={inputCls + " flex items-center gap-2 text-[#9090a8]"}
              >
                {Icon.spin} Loading countries…
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
              <p style={{ fontSize: 11, color: "#9090a8", marginTop: 2 }}>
                Dial codes update automatically when you change nationality.
              </p>
            )}
          </MF>

          <MF label="Current Location *">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.6fr",
                gap: 12,
                alignItems: "start",
              }}
            >
              <div>
                {loading ? (
                  <div
                    className={
                      inputCls + " flex items-center gap-2 text-[#9090a8]"
                    }
                  >
                    {Icon.spin} Loading countries…
                  </div>
                ) : (
                  <NationalitySelect
                    value={locationCountry || ""}
                    onChange={handleLocationCountryChange}
                    countries={countries}
                    loading={loading}
                  />
                )}
              </div>

              <div>
                <LocationSelect
                  value={form.location || ""}
                  onChange={(v) => onChange("location", v)}
                  options={countryLocations}
                  loading={loadingLocations}
                  disabled={!locationCountry}
                />
              </div>
            </div>

            <p style={{ fontSize: 11, color: "#9090a8", marginTop: 2 }}>
              Choose your current country first, then pick a city/location.
            </p>
          </MF>

          {form.nationality === "Kenya" && (
            <MF label="Home County">
              <Sel
                value={form.homeCounty || ""}
                onChange={(e) => onChange("homeCounty", e.target.value)}
                disabled={loadingKenyaCounties}
              >
                <option value="">
                  {loadingKenyaCounties
                    ? "Loading counties…"
                    : "Select home county"}
                </option>
                {kenyaCounties.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Sel>
            </MF>
          )}

          {/* ── Phone with country code ── */}
          <MF label="Phone Number *">
            <PhoneInput
              value={form.phoneNumber || ""}
              onChange={(v) => onChange("phoneNumber", v)}
              countries={countries}
              selectedDialCode={
                phoneDialCode ||
                countries.find((c) => c.name === form.nationality)?.dialCode ||
                ""
              }
              selectedCountryName={form.nationality || ""}
              onDialCodeChange={setPhoneDialCode}
              placeholder="e.g. 712 345 678"
            />
          </MF>

          {/* ── WhatsApp with country code ── */}
          <MF label="WhatsApp No. *">
            <PhoneInput
              value={form.whatsAppNo || ""}
              onChange={(v) => onChange("whatsAppNo", v)}
              countries={countries}
              selectedDialCode={
                waDialCode ||
                countries.find((c) => c.name === form.nationality)?.dialCode ||
                ""
              }
              selectedCountryName={form.nationality || ""}
              onDialCodeChange={setWaDialCode}
              placeholder="e.g. 712 345 678"
            />
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 4,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                style={{ width: 13, height: 13 }}
                onChange={syncWhatsApp}
              />
              <span style={{ fontSize: 11, color: "#9090a8" }}>
                Same as phone number
              </span>
            </label>
          </MF>

          <MF label="Passport No.">
            <Inp
              type="text"
              placeholder="Enter passport number"
              value={form.PassportNo || ""}
              onChange={(e) => onChange("PassportNo", e.target.value)}
            />
          </MF>

          <MF label="Availability of Driving Licence">
            <Sel
              value={form.hasDrivingLicence || ""}
              onChange={(e) => onChange("hasDrivingLicence", e.target.value)}
            >
              <option value="">Select an option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Sel>
          </MF>

          <MF label="Email *">
            <Inp
              type="email"
              placeholder="Enter email"
              value={form.email || ""}
              onChange={(e) => onChange("email", e.target.value)}
            />
          </MF>
          <MF label="Date of Birth">
            <Inp
              type="date"
              max={new Date().toISOString().split("T")[0]}
              value={form.dateOfBirth || ""}
              onChange={(e) => {
                const dob = e.target.value;
                onChange("dateOfBirth", dob);
                if (dob) {
                  const today = new Date();
                  const birth = new Date(dob);
                  let age = today.getFullYear() - birth.getFullYear();
                  const monthDiff = today.getMonth() - birth.getMonth();
                  if (
                    monthDiff < 0 ||
                    (monthDiff === 0 && today.getDate() < birth.getDate())
                  ) {
                    age--;
                  }
                  onChange("age", age > 0 ? age : "");
                } else {
                  onChange("age", "");
                }
              }}
            />
            {form.age && (
              <p
                style={{
                  fontSize: 11,
                  color: "#1a6edb",
                  marginTop: 4,
                  fontWeight: 500,
                }}
              >
                Age: {form.age} years old
              </p>
            )}
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

// ─── Professional Summary Modal ───────────────────────────────────────────────
const SummaryModal = ({ form, onClose, onSave, saving, token }) => {
  const [local, setLocal] = useState({
    specialization: form.specialization || "",
    positionApplied: form.positionApplied || "",
    highestEducationLevel: form.highestEducationLevel || "",
    salaryInfo: form.salaryInfo || "",
  });
  const [payslipFile, setPayslipFile] = useState(null);
  const [payslipUploading, setPayslipUploading] = useState(false);
  const [payslipMsg, setPayslipMsg] = useState("");
  const payslipRef = useRef();

  const ch = (k, v) => setLocal((s) => ({ ...s, [k]: v }));

 const handleSave = async () => {
  let uploadedPayslipFileId = null;
  let uploadedPayslipName = null;

  if (payslipFile) {
    setPayslipUploading(true);
    setPayslipMsg("");
    try {
      const fd = new FormData();
      fd.append("payslip", payslipFile);
      const { data } = await api.post(`${API}/profile/payslip`, fd, {
  headers: { "Content-Type": "multipart/form-data" },
});
      // ✅ capture the returned IDs
      uploadedPayslipFileId = data.payslipAttachmentFileId;
      uploadedPayslipName = data.payslipAttachmentName;
      setPayslipMsg(`Payslip "${payslipFile.name}" uploaded.`);
    } catch (err) {
      setPayslipMsg(err.response?.data?.message || "Error uploading payslip.");
      setPayslipUploading(false);
      return;
    } finally {
      setPayslipUploading(false);
    }
  }

  // ✅ pass the fileId along with the rest of the data
  onSave({
    ...local,
    ...(uploadedPayslipFileId && {
      payslipAttachmentFileId: uploadedPayslipFileId,
      payslipAttachmentName: uploadedPayslipName,
    }),
  });
};

  return (
    <Modal
      title="Professional Details"
      subtitle="Update your Professional Details"
      onClose={onClose}
      onSave={handleSave}
      saving={saving || payslipUploading}
    >
      <MF label="Specialization *">
        <Inp
          type="text"
          placeholder="e.g. Software Engineering, Finance…"
          value={local.specialization}
          onChange={(e) => ch("specialization", e.target.value)}
        />
      </MF>
      {/* <MF label="Position Applied *">
        <Inp
          type="text"
          placeholder="e.g. Senior Developer, Accountant…"
          value={local.positionApplied}
          onChange={(e) => ch("positionApplied", e.target.value)}
        />
      </MF> */}
      <MF label="Highest Academic Level *">
        <Sel
          value={local.highestEducationLevel}
          onChange={(e) => ch("highestEducationLevel", e.target.value)}
        >
          <option value="">Select your qualification</option>
          {[
            "Doctorate(PhD)",
            "Master's Degree",
            "Postgraduate Diploma",
            "Bachelor's Degree",
            "Associate's Degree",
            "Diploma",
            "Professional Certificate",
            "Certificate",
            "others",
          ].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </Sel>
      </MF>
      <MF label="Current Salary *">
        <Inp
          type="number"
          placeholder="e.g. 80000"
          value={local.salaryInfo}
          onChange={(e) => ch("salaryInfo", e.target.value)}
        />
      </MF>

      {/* ── Payslip upload (optional) ── */}
      <MF label="Current Payslip (optional)">
        <input
          ref={payslipRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={(e) => {
            setPayslipFile(e.target.files[0] || null);
            setPayslipMsg("");
          }}
          className="hidden"
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <button
            type="button"
            onClick={() => payslipRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 border-[1.5px] border-dashed border-[#1a6edb60] rounded-lg text-[#1a6edb] hover:bg-[#e8f1fd] transition text-[12.5px] font-medium w-fit"
          >
            {Icon.upload}
            {payslipFile ? payslipFile.name : "Choose payslip file (PDF / Image / DOC)"}
          </button>
          {payslipFile && (
            <button
              type="button"
              onClick={() => { setPayslipFile(null); setPayslipMsg(""); }}
              className="flex items-center gap-1 text-[#9090a8] hover:text-red-500 text-[11.5px] transition w-fit"
            >
              {Icon.trash} Remove
            </button>
          )}
          {payslipMsg && (
            <p className={`text-xs ${payslipMsg.includes("Error") ? "text-red-500" : "text-green-600"}`}>
              {payslipMsg}
            </p>
          )}
          <p style={{ fontSize: 11, color: "#9090a8" }}>
            Upload your most recent payslip. Accepted: PDF, JPG, PNG, DOC. Max 5MB.
          </p>
        </div>
      </MF>
    </Modal>
  );
};
// ─── Work Experience Modal (single entry) ─────────────────────────────────────
const WorkExpModal = ({
  entry = {},
  index,
  isNew,
  onClose,
  onSave,
  onDelete,
  saving,
}) => {
  const blank = {
    company: "",
    position: "",
    duration: "",
    responsibilities: [],
  };
  const [local, setLocal] = useState({
    ...blank,
    ...entry,
    responsibilities: (entry && entry.responsibilities) || [],
  });
  const ch = (k, v) => setLocal((s) => ({ ...s, [k]: v }));

  const MONTHS_SHORT = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const parseMonthYearToDateInput = (txt) => {
    if (!txt) return "";
    const m = String(txt)
      .trim()
      .match(/([A-Za-z]{3,9})\s+(\d{4})/);
    if (!m) return "";
    const monthName = m[1].slice(0, 3).toLowerCase();
    const year = m[2];
    const idx = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ].indexOf(monthName);
    if (idx < 0) return "";
    const month = String(idx + 1).padStart(2, "0");
    // Use the first day of the month for <input type="date" />
    return `${year}-${month}-01`; // yyyy-MM-dd for <input type="date" />
  };

  const formatDateInputToMonthYearText = (yyyyMmDd) => {
    if (!yyyyMmDd) return "";
    const [year, month] = yyyyMmDd.split("-");
    const idx = Number(month) ? Number(month) - 1 : -1; // month is 1-12
    if (idx < 0 || idx > 11) return "";
    return `${MONTHS_SHORT[idx]} ${year}`;
  };

  const parseDuration = (durationStr) => {
    const s = String(durationStr || "");
    const isPresent = /present|current|now/i.test(s);
    const parts = s
      .split(/[-–]/)
      .map((p) => p.trim())
      .filter(Boolean);
    const startPart = parts[0] || "";
    const endPart = parts[1] || "";
    return {
      startDate: parseMonthYearToDateInput(startPart),
      endDate: isPresent ? "" : parseMonthYearToDateInput(endPart),
      currentlyWorking: isPresent,
    };
  };

  const initialParsed = parseDuration(entry?.duration);
  const [startDate, setStartDate] = useState(initialParsed.startDate || "");
  const [endDate, setEndDate] = useState(initialParsed.endDate || "");
  const [currentlyWorking, setCurrentlyWorking] = useState(
    !!initialParsed.currentlyWorking,
  );

  const totalWorkedText = (() => {
    if (!startDate) return "";
    const start = new Date(`${startDate}T00:00:00`);
    const end = currentlyWorking
      ? new Date()
      : endDate
        ? new Date(`${endDate}T00:00:00`)
        : null;
    if (!end) return "";

    const endY = end.getFullYear();
    const endM = end.getMonth(); // 0-11
    const startY = start.getFullYear();
    const startM = start.getMonth();
    let diffMonths = endY * 12 + endM - (startY * 12 + startM);
    // If the end day is before the start day, count one fewer month.
    if (end.getDate() < start.getDate()) diffMonths -= 1;
    diffMonths = Math.max(0, diffMonths);

    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;
    const yTxt = `${years} year${years === 1 ? "" : "s"}`;
    const mTxt = `${months} month${months === 1 ? "" : "s"}`;
    if (years && months) return `${yTxt} ${mTxt}`;
    if (years) return yTxt;
    return mTxt;
  })();

  // Keep duration in sync for immediate preview and saving
  const computedDuration = (() => {
    const startTxt = formatDateInputToMonthYearText(startDate);
    if (!startTxt) return "";
    if (currentlyWorking) {
      return `${startTxt} – Present${totalWorkedText ? ` | ${totalWorkedText}` : ""}`;
    }

    const endTxt = formatDateInputToMonthYearText(endDate);
    if (!endTxt) return `${startTxt} –`;
    return `${startTxt} – ${endTxt}${totalWorkedText ? ` | ${totalWorkedText}` : ""}`;
  })();

  return (
    <Modal
      title={isNew ? "Add Work Experience" : "Edit Work Experience"}
      subtitle={
        isNew
          ? "Add a new position to your work history"
          : "Update this work experience entry"
      }
      onClose={onClose}
      onSave={() => onSave({ ...local, duration: computedDuration })}
      saving={saving}
    >
      <MF label="Company / Organisation *">
        <Inp
          type="text"
          placeholder="e.g. Safaricom PLC"
          value={local.company}
          onChange={(e) => ch("company", e.target.value)}
        />
      </MF>
      <MF label="Position / Job Title *">
        <Inp
          type="text"
          placeholder="e.g. Senior Accountant"
          value={local.position}
          onChange={(e) => ch("position", e.target.value)}
        />
      </MF>
      <MF label="Duration *">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <FL label="Start Date" />
            <input
              type="date"
              className={inputCls}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <FL label="End Date" />
            <input
              type="date"
              className={inputCls}
              value={endDate}
              disabled={currentlyWorking}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 10,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={currentlyWorking}
            onChange={(e) => {
              const v = e.target.checked;
              setCurrentlyWorking(v);
              if (v) setEndDate("");
            }}
            style={{
              width: 16,
              height: 16,
              backgroundColor: "#e7ebf3",
              border: "1px solid #2e6ee6",
              borderRadius: 4,
            }}
          />
          <span style={{ fontSize: 12.5, color: "#5a5a72" }}>
            Currently working here
          </span>
        </label>

        {!!computedDuration && (
          <p style={{ fontSize: 11, color: "#9090a8", marginTop: 8 }}>
            Preview: {computedDuration}
          </p>
        )}

        {totalWorkedText && (
          <p style={{ fontSize: 11, color: "#9090a8", marginTop: 4 }}>
            Total worked: {totalWorkedText}
          </p>
        )}
      </MF>
      <MF label="Key Responsibilities (optional)">
        <div className="space-y-2">
          {local.responsibilities.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span style={{ color: "#9090a8", fontSize: 16 }}>•</span>
              <input
                type="text"
                className={inputCls}
                value={item}
                placeholder={`Responsibility ${i + 1}`}
                onChange={(e) => {
                  const updated = [...local.responsibilities];
                  updated[i] = e.target.value;
                  ch("responsibilities", updated);
                }}
              />
              <button
                onClick={() =>
                  ch(
                    "responsibilities",
                    local.responsibilities.filter((_, idx) => idx !== i),
                  )
                }
                className="text-[#9090a8] hover:text-red-500 transition flex-shrink-0"
              >
                {Icon.trash}
              </button>
            </div>
          ))}
          <AddBtn
            onClick={() =>
              ch("responsibilities", [...local.responsibilities, ""])
            }
          >
            Add responsibility
          </AddBtn>
        </div>
      </MF>
      <MF label="Current/Last Salary per month (optional)">
  <Inp
    type="text"
    placeholder="e.g. KES 80,000"
    value={local.salary || ""}
    onChange={(e) => ch("salary", e.target.value)}
  />
</MF>
      {!isNew && (
        <div className="pt-1">
          <button
            onClick={() => onDelete(index)}
            className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-[12.5px] transition"
          >
            {Icon.trash} Remove this experience
          </button>
        </div>
      )}
    </Modal>
  );
};

// ─── Skills Edit Modal ────────────────────────────────────────────────────────
const SkillsModal = ({ skills, onClose, onSave, saving }) => {
  const [list, setList] = useState(skills.length ? [...skills] : []);
  const [newSkill, setNewSkill] = useState("");
  const addSkill = () => {
    const t = newSkill.trim();
    if (t && !list.includes(t)) setList((l) => [...l, t]);
    setNewSkill("");
  };
  const removeSkill = (i) => setList((l) => l.filter((_, idx) => idx !== i));
  return (
    <Modal
      title="Edit Skills"
      subtitle="Add or remove your professional skills"
      onClose={onClose}
      onSave={() => onSave(list)}
      saving={saving}
    >
      <div className="flex gap-2">
        <Inp
          type="text"
          placeholder="Type a skill and press Add…"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
        />
        <button
          onClick={addSkill}
          className="flex-shrink-0 flex items-center gap-1 px-4 py-2 bg-[#1a6edb] text-white rounded-lg text-sm font-medium hover:bg-[#0d4fa3] transition"
        >
          {Icon.plus} Add
        </button>
      </div>
      {list.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {list.map((s, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4f6fb] border border-[rgba(0,0,0,0.1)] text-[#5a5a72] text-[12.5px]"
            >
              {s}
              <button
                onClick={() => removeSkill(i)}
                className="text-[#9090a8] hover:text-red-500 transition ml-1"
              >
                {Icon.trash}
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#9090a8] italic pt-1">
          No skills added yet. Type above and click Add.
        </p>
      )}
    </Modal>
  );
};

// ─── Education Edit Modal ─────────────────────────────────────────────────────
// REPLACE with:
const ACADEMIC_LEVELS = [
  "Doctorate (PhD)",
  "Master's Degree",
  "Postgraduate Diploma",
  "Bachelor's Degree",
  "Associate's Degree",
  "Diploma",
  "Professional Certificate",
  "Certificate",
  "Others",
];

const EducationModal = ({ education, onClose, onSave, saving, token }) => {
  const blank = {
    academicLevel: "",
    degree: "",
    courseName: "",
    institution: "",
    dateStart: "",
    dateEnd: "",
    currentlyStudying: false,
    certificateFileId: null,
  };

  const [list, setList] = useState(
    education.length
      ? education.map((e) => ({
          ...blank,
          ...e,
          dateStart: e.dateStart || (e.yearStart ? `${e.yearStart}-01-01` : ""),
          dateEnd: e.dateEnd || (e.yearEnd ? `${e.yearEnd}-06-01` : ""),
        }))
      : [{ ...blank }],
  );

  // Parallel array of File objects (one per list entry, null if none chosen)
  const [certFiles, setCertFiles] = useState(() =>
    Array(education.length || 1).fill(null)
  );
  const [certUploading, setCertUploading] = useState(() =>
    Array(education.length || 1).fill(false)
  );
  const [certMsgs, setCertMsgs] = useState(() =>
    Array(education.length || 1).fill("")
  );
  const certRefs = useRef([]);

  const ch = (i, k, v) =>
    setList((l) =>
      l.map((item, idx) => (idx === i ? { ...item, [k]: v } : item)),
    );

  const add = () => {
    setList((l) => [...l, { ...blank }]);
    setCertFiles((f) => [...f, null]);
    setCertUploading((u) => [...u, false]);
    setCertMsgs((m) => [...m, ""]);
  };

  const remove = (i) => {
    setList((l) => l.filter((_, idx) => idx !== i));
    setCertFiles((f) => f.filter((_, idx) => idx !== i));
    setCertUploading((u) => u.filter((_, idx) => idx !== i));
    setCertMsgs((m) => m.filter((_, idx) => idx !== i));
  };

  const setCertFile = (i, file) =>
    setCertFiles((f) => f.map((v, idx) => (idx === i ? file : v)));
  const setCertMsg = (i, msg) =>
    setCertMsgs((m) => m.map((v, idx) => (idx === i ? msg : v)));
  const setCertUploadingAt = (i, val) =>
    setCertUploading((u) => u.map((v, idx) => (idx === i ? val : v)));

  const uploadCert = async (i) => {
    const file = certFiles[i];
    if (!file) return null;
    setCertUploadingAt(i, true);
    setCertMsg(i, "");
    try {
      const fd = new FormData();
      fd.append("certificate", file);
      fd.append("name", list[i].courseName || list[i].academicLevel || file.name);
      fd.append("institution", list[i].institution || "");
      fd.append("dateObtained", list[i].dateEnd || list[i].dateStart || "");
      const { data } = await api.post(`${API}/certificates`, fd, {
  headers: { "Content-Type": "multipart/form-data" },
});
      setCertMsg(i, `Uploaded: ${file.name}`);
      // store the returned fileId back into the list entry
      ch(i, "certificateFileId", data.certificateFileId || data.fileId || null);
      return data.certificateFileId || data.fileId || null;
    } catch (err) {
      setCertMsg(i, err.response?.data?.message || "Upload failed.");
      return null;
    } finally {
      setCertUploadingAt(i, false);
    }
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const m = parseInt(month, 10);
    return m >= 1 && m <= 12 ? `${months[m - 1]} ${year}` : year;
  };

  const calcDuration = (edu) => {
    if (!edu.dateStart) return "";
    const start = new Date(`${edu.dateStart}T00:00:00`);
    const end = edu.currentlyStudying
      ? new Date()
      : edu.dateEnd
      ? new Date(`${edu.dateEnd}T00:00:00`)
      : null;
    if (!end) return "";
    let months =
      end.getFullYear() * 12 + end.getMonth() -
      (start.getFullYear() * 12 + start.getMonth());
    if (end.getDate() < start.getDate()) months--;
    months = Math.max(0, months);
    const y = Math.floor(months / 12);
    const m = months % 12;
    if (y && m) return `${y}y ${m}mo`;
    if (y) return `${y} year${y > 1 ? "s" : ""}`;
    return `${m} month${m !== 1 ? "s" : ""}`;
  };

  const today = new Date().toISOString().split("T")[0];

 const handleSave = async () => {
    // Upload any pending certificate files before saving
    // and wait for all fileIds to be stored back in list state
    const uploadResults = await Promise.all(
      certFiles.map((file, i) => file ? uploadCert(i) : Promise.resolve(null))
    );

    // Build final list with uploaded fileIds merged in
    const finalList = list.map((e, i) => ({
      ...e,
      // If a new cert was just uploaded, use the returned fileId
      certificateFileId: uploadResults[i] !== null && uploadResults[i] !== undefined
        ? uploadResults[i]
        : e.certificateFileId,
    }));

    onSave(
      finalList
        .filter((e) => e.academicLevel || e.degree || e.institution)
        .map((e) => ({
          ...e,
          yearStart: e.dateStart ? e.dateStart.split("-")[0] : "",
          yearEnd: e.currentlyStudying
            ? "Present"
            : e.dateEnd
            ? e.dateEnd.split("-")[0]
            : "",
        }))
    );
  };

  return (
    <Modal
      title="Edit Education"
      subtitle="Add your academic qualifications"
      onClose={onClose}
      onSave={handleSave}
      saving={saving || certUploading.some(Boolean)}
    >
      {list.map((edu, i) => {
        const duration = calcDuration(edu);
        return (
          <div
            key={i}
            className="p-4 bg-[#f8f9fc] rounded-xl border border-[rgba(0,0,0,0.06)] space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#9090a8] uppercase tracking-wider">
                Education {i + 1}
              </span>
              {list.length > 1 && (
                <button
                  onClick={() => remove(i)}
                  className="text-[#9090a8] hover:text-red-500 transition"
                >
                  {Icon.trash}
                </button>
              )}
            </div>

            <MF label="Academic Level *">
              <Sel
                value={edu.academicLevel}
                onChange={(e) => ch(i, "academicLevel", e.target.value)}
              >
                <option value="">Select academic level…</option>
                {ACADEMIC_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </Sel>
            </MF>

        
            <MF label="Course Name">
              <Inp
                type="text"
                placeholder="e.g. Financial Accounting, Software Engineering…"
                value={edu.courseName || ""}
                onChange={(e) => ch(i, "courseName", e.target.value)}
              />
            </MF>

            <MF label="Institution *">
              <Inp
                type="text"
                placeholder="e.g. University of Nairobi"
                value={edu.institution}
                onChange={(e) => ch(i, "institution", e.target.value)}
              />
            </MF>

            <MF label="Duration *">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <FL label="Start Date" />
                  <input
                    type="date"
                    className={inputCls}
                    max={today}
                    value={edu.dateStart}
                    onChange={(e) => ch(i, "dateStart", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <FL label="End Date" />
                  <input
                    type="date"
                    className={inputCls}
                    min={edu.dateStart || undefined}
                    max={today}
                    value={edu.dateEnd}
                    disabled={edu.currentlyStudying}
                    onChange={(e) => ch(i, "dateEnd", e.target.value)}
                  />
                </div>
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={edu.currentlyStudying}
                  onChange={(e) => {
                    ch(i, "currentlyStudying", e.target.checked);
                    if (e.target.checked) ch(i, "dateEnd", "");
                  }}
                  style={{ width: 16, height: 16 }}
                />
                <span style={{ fontSize: 12.5, color: "#5a5a72" }}>Currently studying here</span>
              </label>

              {edu.dateStart && (
                <p style={{ fontSize: 11, color: "#9090a8", marginTop: 8 }}>
                  Preview:{" "}
                  <span style={{ color: "#1a6edb", fontWeight: 500 }}>
                    {formatDateDisplay(edu.dateStart)}
                    {" – "}
                    {edu.currentlyStudying ? "Present" : edu.dateEnd ? formatDateDisplay(edu.dateEnd) : "…"}
                    {duration ? ` · ${duration}` : ""}
                  </span>
                </p>
              )}
            </MF>

            {/* ── Certificate upload (optional) ── */}
            <MF label="Certificate / Transcript (optional)">
              <input
                ref={(el) => (certRefs.current[i] = el)}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => {
                  setCertFile(i, e.target.files[0] || null);
                  setCertMsg(i, "");
                }}
                className="hidden"
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button
                  type="button"
                  onClick={() => certRefs.current[i]?.click()}
                  className="flex items-center gap-2 px-3 py-2 border-[1.5px] border-dashed border-[#7c3aed60] rounded-lg text-[#7c3aed] hover:bg-[#ede9fe] transition text-[12.5px] font-medium w-fit"
                >
                  {certUploading[i] ? Icon.spin : Icon.upload}
                  {certFiles[i]
                    ? certFiles[i].name
                    : edu.certificateFileId
                    ? "Replace certificate"
                    : "Upload certificate"}
                </button>

                {/* Show existing uploaded indicator */}
                {edu.certificateFileId && !certFiles[i] && (
                  <span style={{ fontSize: 11, color: "#16a34a", display: "flex", alignItems: "center", gap: 4 }}>
                    {Icon.check} Certificate on file
                  </span>
                )}

                {certFiles[i] && (
                  <button
                    type="button"
                    onClick={() => { setCertFile(i, null); setCertMsg(i, ""); }}
                    className="flex items-center gap-1 text-[#9090a8] hover:text-red-500 text-[11.5px] transition w-fit"
                  >
                    {Icon.trash} Remove
                  </button>
                )}

                {certMsgs[i] && (
                  <p className={`text-xs ${certMsgs[i].includes("failed") || certMsgs[i].includes("Error") ? "text-red-500" : "text-green-600"}`}>
                    {certMsgs[i]}
                  </p>
                )}
                <p style={{ fontSize: 11, color: "#9090a8" }}>
                  PDF, JPG, PNG or DOC · max 5MB · optional
                </p>
              </div>
            </MF>
          </div>
        );
      })}

      <AddBtn onClick={add}>Add</AddBtn>
    </Modal>
  );
};

// ─── Profile Picture Upload Modal ────────────────────────────────────────────
const AvatarModal = ({ currentUrl, onClose, onSave, saving }) => {
  const [preview, setPreview] = useState(currentUrl || null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB.");
      return;
    }
    setError("");
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.08)]">
          <div>
            <h2 className="font-semibold text-[#1a1a2e] text-[15px]">
              Update Profile Photo
            </h2>
            <p className="text-[#9090a8] text-xs mt-0.5">
              JPG, PNG or WebP · max 5MB
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9090a8] hover:text-[#1a1a2e] transition p-1 rounded-lg hover:bg-[#f4f6fb]"
          >
            {Icon.x}
          </button>
        </div>
        <div className="p-6 flex flex-col items-center gap-4">
          <div
            onClick={() => fileRef.current?.click()}
            className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#e8f1fd] cursor-pointer relative group"
            style={{ background: "#f4f6fb" }}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 60 60" fill="#a0b4d0" width="44" height="44">
                  <circle cx="30" cy="22" r="12" />
                  <path d="M8 52c0-12.15 9.85-22 22-22s22 9.85 22 22" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-full">
              <span className="text-white text-xs font-medium flex items-center gap-1">
                {Icon.camera} Change
              </span>
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 border-[1.5px] border-dashed border-[#1a6edb60] rounded-lg text-[#1a6edb] text-sm font-medium hover:bg-[#e8f1fd] transition"
          >
            {Icon.upload} {file ? file.name : "Choose a photo"}
          </button>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <div className="px-6 py-4 border-t border-[rgba(0,0,0,0.06)] flex justify-end gap-3">
          <GhostBtn onClick={onClose}>{Icon.x} Cancel</GhostBtn>
          <PrimaryBtn onClick={() => onSave(file)} disabled={saving || !file}>
            {saving ? Icon.spin : Icon.save}
            {saving ? "Uploading…" : "Save Photo"}
          </PrimaryBtn>
        </div>
      </div>
    </div>
  );
};

const CvPreviewModal = ({ cvUrl, cvName, onClose, token }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loadState, setLoadState] = useState("loading"); // "loading" | "ready" | "error"

  useEffect(() => {
    if (!cvUrl) {
      setLoadState("error");
      return;
    }
    setLoadState("loading");

 fetch(cvUrl, {
  credentials: "include",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
})
  .then((res) => {
    console.log("CV fetch status:", res.status, res.headers.get("content-type"));
    if (!res.ok) throw new Error("Failed to fetch CV");
    return res.blob();
  })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        setLoadState("ready");
      })
      .catch(() => setLoadState("error"));

    // Cleanup blob URL on unmount
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [cvUrl]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.08)] flex-shrink-0">
          <div>
            <h2 className="font-semibold text-[#1a1a2e] text-[15px]">
              CV Preview
            </h2>
            {cvName && (
              <p className="text-[#9090a8] text-xs mt-0.5">{cvName}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {blobUrl && (
              <a
                href={blobUrl}
                download={cvName}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a6edb] text-white text-[12.5px] hover:bg-[#0d4fa3] transition"
              >
                {Icon.download} Download
              </a>
            )}
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(0,0,0,0.13)] text-[#5a5a72] text-[12.5px] hover:bg-[#f4f6fb] transition"
            >
              {Icon.externalLink} Open in new tab
            </a>
            <button
              onClick={onClose}
              className="text-[#9090a8] hover:text-[#1a1a2e] transition p-1 rounded-lg hover:bg-[#f4f6fb]"
            >
              {Icon.x}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden relative bg-[#f4f6fb]">
          {loadState === "loading" && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div
                style={{
                  width: 36,
                  height: 36,
                  border: "3px solid #e8edf5",
                  borderTop: "3px solid #1a6edb",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <p className="text-[#9090a8] text-sm">Loading your CV…</p>
            </div>
          )}

          {loadState === "error" && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
              <div className="text-4xl">📄</div>
              <p className="text-[#1a1a2e] font-medium text-sm">
                Could not load preview
              </p>
              <p className="text-[#9090a8] text-xs">
                Try opening in a new tab or downloading directly.
              </p>
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1a6edb] text-white text-sm hover:bg-[#0d4fa3] transition"
              >
                {Icon.externalLink} Open in new tab
              </a>
            </div>
          )}

        {loadState === "ready" && blobUrl && (
  <iframe
   src={blobUrl}
    className="w-full h-full"
    style={{ display: "block", border: "none" }}
    title="CV Preview"
  />
)}
        </div>
      </div>
    </div>
  );
};

// ─── Placeholder pages ────────────────────────────────────────────────────────
const PlaceholderPage = ({ title, icon, description }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center px-8">
    <div className="w-16 h-16 rounded-2xl bg-[#f4f6fb] flex items-center justify-center text-[#9090a8] scale-150">
      {icon}
    </div>
    <div className="mt-4">
      <h2
        style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 22,
          fontWeight: 600,
          color: "#1a1a2e",
        }}
      >
        {title}
      </h2>
      <p className="text-[#9090a8] text-sm mt-2 max-w-sm">{description}</p>
    </div>
  </div>
);

const CertificateActions = ({ fileId, token, fileName }) => {
  const [previewing, setPreviewing] = useState(false);
  const [blobUrl, setBlobUrl] = useState(null);
  const [loadState, setLoadState] = useState("idle");

const viewUrl = `http://localhost:5001${API}/certificates/${fileId}`;
const downloadUrl = `http://localhost:5001${API}/certificates/${fileId}/download`;

  const handlePreview = async () => {
    if (blobUrl) { setPreviewing(true); return; }
    setLoadState("loading");
    setPreviewing(true);
    try {
     const res = await fetch(viewUrl, {
  headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  credentials: "include",
});
      if (!res.ok) throw new Error("Failed");
      const blob = await res.blob();
      setBlobUrl(URL.createObjectURL(blob));
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(downloadUrl, {
  headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  credentials: "include",
});
      if (!res.ok) throw new Error("Failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "certificate";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Download failed.");
    }
  };

  return (
    <>
      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
        <button
          onClick={handlePreview}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            fontSize: 11, padding: "3px 10px", borderRadius: 6,
            border: "1px solid rgba(3,105,161,0.3)", background: "#e0f2fe",
            color: "#0369a1", cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {Icon.eye} View
        </button>
        <button
          onClick={handleDownload}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            fontSize: 11, padding: "3px 10px", borderRadius: 6,
            border: "1px solid rgba(22,163,74,0.3)", background: "#f0fdf4",
            color: "#16a34a", cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {Icon.download} Download
        </button>
      </div>

      {/* Inline preview modal */}
      {previewing && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewing(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.08)] flex-shrink-0">
              <div>
                <h2 className="font-semibold text-[#1a1a2e] text-[15px]">Certificate Preview</h2>
                {fileName && <p className="text-[#9090a8] text-xs mt-0.5">{fileName}</p>}
              </div>
              <div className="flex items-center gap-2">
                {blobUrl && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a6edb] text-white text-[12.5px] hover:bg-[#0d4fa3] transition"
                  >
                    {Icon.download} Download
                  </button>
                )}
                <button
                  onClick={() => setPreviewing(false)}
                  className="text-[#9090a8] hover:text-[#1a1a2e] transition p-1 rounded-lg hover:bg-[#f4f6fb]"
                >
                  {Icon.x}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden relative bg-[#f4f6fb]">
              {loadState === "loading" && (
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <div style={{ width: 36, height: 36, border: "3px solid #e8edf5", borderTop: "3px solid #1a6edb", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  <p className="text-[#9090a8] text-sm">Loading certificate…</p>
                </div>
              )}
              {loadState === "error" && (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
                  <div className="text-4xl">📄</div>
                  <p className="text-[#1a1a2e] font-medium text-sm">Could not load preview</p>
                  <button onClick={handleDownload} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1a6edb] text-white text-sm hover:bg-[#0d4fa3] transition">
                    {Icon.download} Download instead
                  </button>
                </div>
              )}
              {loadState === "ready" && blobUrl && (
  <iframe
    src={blobUrl}
    className="w-full h-full"
    style={{ display: "block", border: "none" }}
    title="Certificate Preview"
  />
)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
// ─── Professional Qualifications & Memberships Modal ─────────────────────────
const ProfessionalModal = ({ qualifications, memberships, onClose, onSave, saving, token }) => {
  const blankQual = { name: "", institution: "", dateObtained: "", certificateFileId: null };
  const blankMem = { organization: "", membershipId: "", startDate: "", endDate: "", certificateFileId: null };

  const [quals, setQuals] = useState(
    qualifications.length ? qualifications.map(q => ({
      ...blankQual, ...q,
      dateObtained: q.dateObtained ? new Date(q.dateObtained).toISOString().split("T")[0] : "",
    })) : [{ ...blankQual }]
  );

  const [mems, setMems] = useState(
    memberships.length ? memberships.map(m => ({
      ...blankMem, ...m,
      startDate: m.startDate ? new Date(m.startDate).toISOString().split("T")[0] : "",
      endDate: m.endDate ? new Date(m.endDate).toISOString().split("T")[0] : "",
    })) : []
  );

  // Per-qualification cert files and upload state
  const [certFiles, setCertFiles] = useState(() => Array(qualifications.length || 1).fill(null));
  const [certUploading, setCertUploading] = useState(() => Array(qualifications.length || 1).fill(false));
  const [certMsgs, setCertMsgs] = useState(() => Array(qualifications.length || 1).fill(""));
  const certRefs = useRef([]);

  const chQ = (i, k, v) => setQuals(l => l.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  const chM = (i, k, v) => setMems(l => l.map((item, idx) => idx === i ? { ...item, [k]: v } : item));

  const setCertFile = (i, file) => setCertFiles(f => f.map((v, idx) => idx === i ? file : v));
  const setCertMsg = (i, msg) => setCertMsgs(m => m.map((v, idx) => idx === i ? msg : v));
  const setCertUploadingAt = (i, val) => setCertUploading(u => u.map((v, idx) => idx === i ? val : v));

  const uploadCert = async (i) => {
  const file = certFiles[i];
  const qual = quals[i];
  if (!file) return null;

  setCertUploadingAt(i, true);
  setCertMsg(i, "");
  try {
    const fd = new FormData();
    fd.append("certificate", file);
    fd.append("name", qual.name || file.name);          // ← add this
    fd.append("institution", qual.institution || "");   // ← add this
    fd.append("dateObtained", qual.dateObtained || ""); // ← add this

    const { data } = await api.post(`${API}/certificates`, fd, {
  headers: { "Content-Type": "multipart/form-data" },
});

    const fileId = data.certificateFileId || null;
    chQ(i, "certificateFileId", fileId);
    setCertMsg(i, `✓ ${file.name} uploaded`);
    return fileId;
  } catch (err) {
    setCertMsg(i, err.response?.data?.message || "Upload failed.");
    return null;
  } finally {
    setCertUploadingAt(i, false);
  }
};

const handleSave = async () => {
   
    const uploadResults = await Promise.all(
      certFiles.map((file, i) => file ? uploadCert(i) : Promise.resolve(null))
    );

    
    const finalQuals = quals.map((q, i) => ({
      ...q,
      certificateFileId: uploadResults[i] !== null && uploadResults[i] !== undefined
        ? uploadResults[i]
        : q.certificateFileId,
    }));

    onSave({ qualifications: finalQuals, memberships: mems });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Modal
      title="Professional Qualifications & Memberships"
      subtitle="Add your professional certifications and memberships"
      onClose={onClose}
      onSave={handleSave}
      saving={saving || certUploading.some(Boolean)}
    >
      {/* ── Qualifications ── */}
      <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a2e", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        Professional Qualifications
      </div>

      {quals.map((q, i) => (
        <div key={i} className="p-4 bg-[#f8f9fc] rounded-xl border border-[rgba(0,0,0,0.06)] space-y-3 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#9090a8] uppercase tracking-wider">
              Qualification {i + 1}
            </span>
            {quals.length > 1 && (
              <button
                onClick={() => {
                  setQuals(l => l.filter((_, idx) => idx !== i));
                  setCertFiles(f => f.filter((_, idx) => idx !== i));
                  setCertUploading(u => u.filter((_, idx) => idx !== i));
                  setCertMsgs(m => m.filter((_, idx) => idx !== i));
                }}
                className="text-[#9090a8] hover:text-red-500 transition"
              >
                {Icon.trash}
              </button>
            )}
          </div>

          <MF label="Qualification Name *">
            <Inp
              type="text"
              placeholder="e.g. CPA, ACCA, PMP…"
              value={q.name}
              onChange={e => chQ(i, "name", e.target.value)}
            />
          </MF>

          <MF label="Issuing Institution">
            <Inp
              type="text"
              placeholder="e.g. ICPAK, PMI…"
              value={q.institution}
              onChange={e => chQ(i, "institution", e.target.value)}
            />
          </MF>

          <MF label="Date Obtained">
            <input
              type="date"
              className={inputCls}
              max={today}
              value={q.dateObtained}
              onChange={e => chQ(i, "dateObtained", e.target.value)}
            />
          </MF>

          {/* ── Certificate attachment ── */}
          <MF label="Certificate (optional)">
            <input
              ref={el => (certRefs.current[i] = el)}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={e => {
                setCertFile(i, e.target.files[0] || null);
                setCertMsg(i, "");
              }}
              className="hidden"
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <button
                type="button"
                onClick={() => certRefs.current[i]?.click()}
                className="flex items-center gap-2 px-3 py-2 border-[1.5px] border-dashed border-[#0369a160] rounded-lg text-[#0369a1] hover:bg-[#e0f2fe] transition text-[12.5px] font-medium w-fit"
              >
                {certUploading[i] ? Icon.spin : Icon.upload}
                {certFiles[i]
                  ? certFiles[i].name
                  : q.certificateFileId
                  ? "Replace certificate"
                  : "Attach certificate"}
              </button>

              {/* Existing file indicator */}
              {/* Existing file indicator + view/download actions */}
{q.certificateFileId && !certFiles[i] && (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <span style={{ fontSize: 11, color: "#16a34a", display: "flex", alignItems: "center", gap: 4 }}>
      {Icon.check} Certificate on file
    </span>
    <CertificateActions
      fileId={q.certificateFileId}
      token={token}
      fileName={`${q.name || "Certificate"}`}
    />
  </div>
)}

              {certFiles[i] && (
                <button
                  type="button"
                  onClick={() => { setCertFile(i, null); setCertMsg(i, ""); }}
                  className="flex items-center gap-1 text-[#9090a8] hover:text-red-500 text-[11.5px] transition w-fit"
                >
                  {Icon.trash} Remove
                </button>
              )}

              {certMsgs[i] && (
                <p className={`text-xs ${certMsgs[i].includes("failed") || certMsgs[i].includes("Error") ? "text-red-500" : "text-green-600"}`}>
                  {certMsgs[i]}
                </p>
              )}
              <p style={{ fontSize: 11, color: "#9090a8" }}>
                PDF, JPG, PNG or DOC · max 5MB · optional
              </p>
            </div>
          </MF>
        </div>
      ))}

      <AddBtn onClick={() => {
        setQuals(l => [...l, { ...blankQual }]);
        setCertFiles(f => [...f, null]);
        setCertUploading(u => [...u, false]);
        setCertMsgs(m => [...m, ""]);
      }}>
        Add qualification
      </AddBtn>

      {/* ── Memberships ── */}
      <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a2e", margin: "20px 0 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        Professional Memberships
      </div>

      {mems.length === 0 && (
        <p style={{ fontSize: 13, color: "#9090a8", marginBottom: 8 }}>No memberships added yet.</p>
      )}

      {mems.map((m, i) => (
        <div key={i} className="p-4 bg-[#f8f9fc] rounded-xl border border-[rgba(0,0,0,0.06)] space-y-3 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#9090a8] uppercase tracking-wider">Membership {i + 1}</span>
            <button onClick={() => setMems(l => l.filter((_, idx) => idx !== i))} className="text-[#9090a8] hover:text-red-500 transition">
              {Icon.trash}
            </button>
          </div>
          <MF label="Organisation *">
            <Inp type="text" placeholder="e.g. ICPAK, LSK, EBK…" value={m.organization} onChange={e => chM(i, "organization", e.target.value)} />
          </MF>
          <MF label="Membership ID *">
            <Inp type="text" placeholder="e.g. ICPAK/2024/1234" value={m.membershipId} onChange={e => chM(i, "membershipId", e.target.value)} />
          </MF>
          <div className="grid grid-cols-2 gap-3">
            <MF label="Start Date *">
              <input type="date" className={inputCls} max={today} value={m.startDate} onChange={e => chM(i, "startDate", e.target.value)} />
            </MF>
            <MF label="End Date *">
              <input type="date" className={inputCls} min={m.startDate || undefined} value={m.endDate} onChange={e => chM(i, "endDate", e.target.value)} />
            </MF>
          </div>
        </div>
      ))}

      <AddBtn onClick={() => setMems(l => [...l, { ...blankMem }])}>Add membership</AddBtn>
    </Modal>
  );
};
// ─── Terms & Conditions Page ──────────────────────────────────────────────────
const TermsPage = () => (
  <div style={{ padding: "28px 32px", maxWidth: 800 }}>
    <div style={{
      background: "#fff", borderRadius: 14,
      border: "1px solid rgba(0,0,0,0.08)",
      padding: "32px",
    }}>
      <h1 style={{
        fontFamily: "'Fraunces', serif", fontSize: 22,
        fontWeight: 600, color: "#1a1a2e", marginBottom: 4, margin: 0
      }}>
        Terms and Conditions
      </h1>
      <p style={{ fontSize: 12, color: "#9090a8", marginBottom: 28, marginTop: 6 }}>
        Effective Date: January 1, 2011
      </p>

      {[
        { title: "1. Introduction", content: "Welcome to the website of Africa Management Solutions Limited (AMSOL). These terms and conditions govern your access to and use of the AMSOL website. By accessing or using this website, you agree to comply with and be bound by these terms. If you do not agree, you should discontinue using the website immediately." },
        { title: "2. Definitions", content: '"Company", "AMSOL", "we", "us", or "our" refers to Africa Management Solutions Limited. "Website" refers to the official AMSOL website. "User", "you", or "your" refers to any person accessing or using the website. "Services" refers to the consulting, recruitment, HR outsourcing, payroll management, and advisory services provided by AMSOL.' },
        { title: "3. Acceptance of Terms", content: "By accessing the website, submitting information, applying for job opportunities, or requesting services, you confirm that you have read and understood these terms, agree to comply with them, and are legally capable of entering into binding agreements. AMSOL reserves the right to deny access to users who violate these terms." },
        { title: "4. Use of the Website", content: "The website is intended to allow users to submit service inquiries, apply for job opportunities, contact the company, and access professional resources. Users agree to use the website only for lawful purposes and must not attempt unauthorized access, introduce malware, interfere with functionality, or submit false information." },
        { title: "5. Description of Services", content: "AMSOL provides Human Resource Consulting, Recruitment and Talent Acquisition, Payroll Processing and Outsourcing, HR Outsourcing Services, Organizational Development, Business Consulting, and Corporate advisory services. Information on the website is for general informational purposes only." },
        { title: "6. User Responsibilities", content: "Users who submit information agree that all information provided is accurate and truthful, they have the authority to submit the information, and they will not impersonate another individual or organization. Job applicants must ensure submitted resumes and documents are accurate and lawful." },
        { title: "7. Intellectual Property Rights", content: "All content on this website including text, graphics, logos, images, software, and documents are the property of Africa Management Solutions Limited or its licensors and are protected under applicable intellectual property laws. Users may not reproduce, distribute, or commercially exploit website content without prior written consent." },
        { title: "8. Confidentiality", content: "Any confidential information exchanged through formal engagement agreements will be handled in accordance with applicable confidentiality obligations. Information submitted through general website forms may not automatically constitute confidential communication unless specified." },
        { title: "9. Third-Party Links", content: "The website may contain links to third-party websites. AMSOL does not control or endorse these platforms and is not responsible for their content, privacy practices, or accuracy of information. Users access such links at their own risk." },
        { title: "10. Limitation of Liability", content: "To the fullest extent permitted by law, AMSOL shall not be liable for any indirect, incidental, special, or consequential damages arising from use or inability to use the website, reliance on website information, errors or omissions in content, or temporary unavailability of the website." },
        { title: "11. Disclaimer of Warranties", content: 'The website is provided "as is" and "as available". AMSOL makes no warranties regarding accuracy of information, continuous availability, freedom from errors or interruptions, or security from cyber threats.' },
        { title: "12. Indemnification", content: "Users agree to indemnify and hold harmless AMSOL and its employees, partners, and affiliates against any claims, damages, losses, or liabilities resulting from violation of these terms, misuse of the website, or submission of inaccurate or unlawful information." },
        { title: "13. Governing Law and Jurisdiction", content: "These terms shall be governed by the laws of the Republic of Kenya. Any disputes arising from the use of this website shall be subject to the jurisdiction of Kenyan courts." },
        { title: "14. Amendments to Terms", content: "AMSOL reserves the right to update or modify these terms at any time. Changes become effective upon publication on this page. Continued use of the website after updates constitutes acceptance of the revised terms." },
        { title: "15. Termination of Use", content: "AMSOL reserves the right to restrict or terminate access to the website, remove user submissions, or suspend services if users violate these terms or engage in unlawful activity." },
        { title: "16. Contact Information", content: "For questions regarding these terms, contact Africa Management Solutions Limited." },
      ].map((section, i) => (
        <div key={i} style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e", marginBottom: 6 }}>
            {section.title}
          </h3>
          <p style={{ fontSize: 13.5, color: "#5a5a72", lineHeight: 1.75, margin: 0 }}>
            {section.content}
          </p>
        </div>
      ))}

      <div style={{
        marginTop: 32, padding: "16px",
        background: "#f0f5ff", borderRadius: 10,
        border: "1px solid rgba(26,110,219,0.15)",
        fontSize: 12.5, color: "#1a6edb",
      }}>
        For questions contact: <strong>info@amsol.africa</strong> ·{" "}
        <a href="https://www.amsol.africa" target="_blank" rel="noreferrer"
          style={{ color: "#1a6edb" }}>
          www.amsol.africa
        </a>
      </div>
    </div>
  </div>
);
// ─── Main component ───────────────────────────────────────────────────────────
const UserProfileDashboard = () => {
  const { token, userId, logout } = useUser();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("dashboard");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(null);
  const [workExpModalData, setWorkExpModalData] = useState({
    entry: {},
    index: -1,
    isNew: true,
  });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
const [qualifications, setQualifications] = useState([]);
const [memberships, setMemberships] = useState([]);
  const [form, setForm] = useState({});
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const { savedJobIds, savedJobs, loadingSaved, toggleSave } = useSavedJobs(
    userId,
    token,
  );
  const [applicationsCount, setApplicationsCount] = useState(0);

  const [cvFile, setCvFile] = useState(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvMsg, setCvMsg] = useState("");
  const cvRef = useRef();

const socketRef = useRef(null); 


// Add the socket useEffect here too:
useEffect(() => {
  if (!token) return;
  const socket = io("http://localhost:5001", {
    auth: { token },
    withCredentials: true,
  });
  socketRef.current = socket;
  return () => socket.disconnect();
}, [token]);

  const [showApply, setShowApply] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [generalApplyModal, setGeneralApplyModal] = useState(false);
const [generalApplying, setGeneralApplying] = useState(false);
const [generalApplyError, setGeneralApplyError] = useState("");
const [generalApplySuccess, setGeneralApplySuccess] = useState(false);

  useEffect(() => {
    if (!token) return;
    api.get(`${API}/profile`)
    .then(({ data }) => {
  // ADD THESE LINES 👇
  if (data.dob) {
    data.dateOfBirth = new Date(data.dob).toISOString().split("T")[0];
    
    // Calculate age from dob
    const today = new Date();
    const birth = new Date(data.dob);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    data.age = age > 0 ? age : "";
  }

  setProfile(data);
  setForm(data);
  setSkills(data.skills || []);
  setWorkExperience(data.workExperience || []);
  setQualifications(data.professionalQualifications || []);
setMemberships(data.professionalMemberships || []);

  // academicLevel from DB is [{level, courseName, institution, ...}]
  // map it to the shape your EducationModal/display expects
 const mappedEdu = (data.academicLevel || []).map((e) => ({
    academicLevel: e.level || "",
    degree: e.courseName || "",
    courseName: e.courseName || "",
    institution: e.institution || "",
    dateStart: e.startDate ? new Date(e.startDate).toISOString().split("T")[0] : "",
    dateEnd: e.endDate ? new Date(e.endDate).toISOString().split("T")[0] : "",
    currentlyStudying: false,
    certificateFileId: e.certificateFileId || null,  // ← ADD THIS
  }));
  setEducation(mappedEdu);

  if (data.profilePhotoUrl) setAvatarUrl(data.profilePhotoUrl);
})
      .catch((err) => {
        if (err.response?.status === 404) {
          setProfile({});
          setForm({});
          setModal("personal");
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (!token) {
      setApplicationsCount(0);
      return;
    }

    let cancelled = false;

   api.get(`${API}/my-applications`)
      .then(({ data }) => {
        if (!cancelled) {
          setApplicationsCount((data.applications || []).length);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setApplicationsCount(0);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);
const saveProfessional = async ({ qualifications: newQuals, memberships: newMems }) => {
  setSaving(true);
  try {
    const merged = {
      ...form,
      professionalQualifications: newQuals.filter(q => q.name || q.institution),
      professionalMemberships: newMems.filter(m => m.organization || m.membershipId),
    };
  const { data } = await api.post(`${API}/profile`, merged)
    const p = data.profile || data;
    setProfile(p);
    setForm(p);
    setQualifications(p.professionalQualifications || []);
    setMemberships(p.professionalMemberships || []);
    setModal(null);
    flashMsg("Professional details saved!");
  } catch (err) {
    setSaveMsg(err.response?.data?.message || "Error saving.");
  } finally {
    setSaving(false);
  }
};
  const handleLogoutClick = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      logout();
      navigate("/");
    }
  };

  const changeForm = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const flashMsg = (msg) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(""), 3500);
  };

 const savePersonal = async () => {
  setSaving(true);
  try {
    const { data } = await api.post(`${API}/profile`, form, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    const p = data.profile || data;
    setProfile(p);
    setForm(p);
    setSkills(Array.isArray(p.skills) ? p.skills : []);
    setWorkExperience(Array.isArray(p.workExperience) ? p.workExperience : []);

    // Remap academicLevel → frontend education shape (same as initial load)
  const mappedEdu = (p.academicLevel || []).map((e) => ({
      academicLevel: e.level || "",
      degree: e.courseName || "",
      courseName: e.courseName || "",
      institution: e.institution || "",
      dateStart: e.startDate
        ? new Date(e.startDate).toISOString().split("T")[0]
        : "",
      dateEnd: e.endDate
        ? new Date(e.endDate).toISOString().split("T")[0]
        : "",
      currentlyStudying: false,
      certificateFileId: e.certificateFileId || null,  // ← ADD THIS
    }));
    setEducation(mappedEdu);

    if (p.profilePhotoUrl) setAvatarUrl(p.profilePhotoUrl);
    setModal(null);
    flashMsg("Personal details saved successfully!");
  } catch (err) {
    setSaveMsg(err.response?.data?.message || "Error saving profile.");
  } finally {
    setSaving(false);
  }
};
 const saveSummary = async (localData) => {
  setSaving(true);
  try {
    const merged = { ...form, ...localData };
    const { data } = await api.post(`${API}/profile`, merged);
   
    const p = data.profile || data;
    setProfile(p);
    setForm(p);
    setModal(null);
    flashMsg("Qualifications saved successfully!");
  } catch (err) {
    setSaveMsg(err.response?.data?.message || "Error saving.");
  } finally {
    setSaving(false);
  }
};

  const saveWorkExp = async (entry) => {
    setSaving(true);
    try {
      let updated;
      if (workExpModalData.isNew) {
        updated = [...workExperience, entry];
      } else {
        updated = workExperience.map((w, i) =>
          i === workExpModalData.index ? entry : w,
        );
      }
      const merged = { ...form, workExperience: updated };
      const { data } = await api.post(`${API}/profile`, merged);
      setProfile(data.profile);
      setForm(data.profile);
      setWorkExperience(updated);
      setModal(null);
      flashMsg(
        workExpModalData.isNew
          ? "Work experience added!"
          : "Work experience updated!",
      );
    } catch (err) {
      setSaveMsg(
        err.response?.data?.message || "Error saving work experience.",
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteWorkExp = async (index) => {
    setSaving(true);
    try {
      const updated = workExperience.filter((_, i) => i !== index);
      const merged = { ...form, workExperience: updated };
      const { data } = await api.post(`${API}/profile`, merged);
      setProfile(data.profile);
      setForm(data.profile);
      setWorkExperience(updated);
      setModal(null);
      flashMsg("Work experience removed.");
    } catch (err) {
      setSaveMsg(err.response?.data?.message || "Error deleting.");
    } finally {
      setSaving(false);
    }
  };

  const saveSkills = async (newSkills) => {
    setSaving(true);
    try {
      const merged = { ...form, skills: newSkills };
     const { data } = await api.post(`${API}/profile`, merged);
      setProfile(data.profile);
      setForm(data.profile);
      setSkills(newSkills);
      setModal(null);
      flashMsg("Skills saved!");
    } catch (err) {
      setSaveMsg(err.response?.data?.message || "Error saving skills.");
    } finally {
      setSaving(false);
    }
  };

 const saveEducation = async (newEdu) => {
  setSaving(true);
  try {

    const academicLevel = newEdu.map((e) => ({
      level: e.academicLevel || "",
      courseName: e.degree || e.courseName || "",
      institution: e.institution || "",
      startDate: e.dateStart ? new Date(e.dateStart) : null,
      endDate: e.currentlyStudying ? null : (e.dateEnd ? new Date(e.dateEnd) : null),
      certificateFileId: e.certificateFileId || null,  // ← ADD THIS
    }));

    const merged = { ...form, academicLevel };
  const { data } = await api.post(`${API}/profile`, merged);

    const p = data.profile || data;
    setProfile(p);
    setForm(p);
    setEducation(newEdu); // keep frontend shape in state
    setModal(null);
    flashMsg("Education saved!");
  } catch (err) {
    setSaveMsg(err.response?.data?.message || "Error saving education.");
  } finally {
    setSaving(false);
  }
};

  const saveAvatar = async (file) => {
    if (!file) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("profilePhoto", file);
      const { data } = await api.post(`${API}/profile/photo`, fd, {
  headers: { "Content-Type": "multipart/form-data" },
});
      setAvatarUrl(data.profilePhotoUrl);
      setAvatarPreview(null);
      setProfile((p) => ({ ...p, profilePhotoUrl: data.profilePhotoUrl }));
      setModal(null);
      flashMsg("Profile photo updated!");
    } catch (err) {
      setSaveMsg(err.response?.data?.message || "Error uploading photo.");
    } finally {
      setSaving(false);
    }
  };

  const uploadCv = async () => {
    if (!cvFile) return;
    setCvUploading(true);
    setCvMsg("");
    try {
      const fd = new FormData();
      fd.append("cv", cvFile);
      const { data } = await api.post(`${API}/profile/cv`, fd, {
  headers: { "Content-Type": "multipart/form-data" },
});
      setProfile((p) => ({
        ...p,
        savedCvFileId: data.cvFileId,
        savedCvName: data.cvName,
        savedCvUrl: data.cvUrl,
      }));
      setCvMsg(`CV "${data.cvName}" saved to your profile.`);
      setCvFile(null);
    } catch (err) {
      setCvMsg(err.response?.data?.message || "Error uploading CV.");
    } finally {
      setCvUploading(false);
    }
  };

  const handlePreviewCv = () => {
    if (!profile?.savedCvUrl && !profile?.savedCvFileId) {
      flashMsg("No CV uploaded yet. Please upload a CV first.");
      return;
    }
    setModal("cvpreview");
  };

const cvPreviewUrl =
  profile?.savedCvUrl ||
  (profile?.savedCvFileId
    ? `http://localhost:5001${API}/profile/cv/${profile.savedCvFileId}`
    : null);

  const pct = calcCompletion(profile);
  const barColor = pct < 50 ? "#ef4444" : pct < 80 ? "#f59e0b" : "#1a6edb";
  const filledWE = workExperience.filter((w) => w.company);
  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "—";
  const initials =
    [profile?.firstName?.[0], profile?.lastName?.[0]]
      .filter(Boolean)
      .join("") || "?";
  const displayAvatar = avatarUrl || profile?.profilePhotoUrl;

  const renderLoadingPage = () => (
    <div
      style={{
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div
        style={{
          height: 132,
          borderRadius: 20,
          background: "linear-gradient(135deg,#eef4ff,#f8fbff)",
          border: "1px solid rgba(59,130,246,0.12)",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
      <div
        style={{ display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 18 }}
      >
        <div
          style={{
            height: 260,
            borderRadius: 20,
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.06)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        <div
          style={{
            height: 260,
            borderRadius: 20,
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.06)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </div>
      <div
        style={{
          height: 220,
          borderRadius: 20,
          background: "#fff",
          border: "1px solid rgba(0,0,0,0.06)",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
    </div>
  );
<MessagesPage />
 
  const F = ({ label, value, color }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        marginBottom: 12,
      }}
    >
      <FL label={label} />
      <span
        style={{
          fontSize: "13.5px",
          color: value ? color || "#1a1a2e" : "#9090a8",
          fontStyle: value ? "normal" : "italic",
        }}
      >
        {value || "Not provided"}
      </span>
    </div>
  );

  const renderPageContent = () => {
    if (loading) {
      return renderLoadingPage();
    }

    switch (activeNav) {
      case "dashboard":
       return (
          <Dashboard
            profile={profile}
            token={token}
            onNav={setActiveNav}
            onQuickApply={() => setShowApply(true)}
            savedJobIds={savedJobIds}
            onToggleSave={toggleSave}
            onViewTerms={() => setActiveNav("terms")}
          />
        );
      case "cv":
        return (
          <div
            style={{
              padding: "28px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <SectionCard
              dotColor="#1a6edb"
              title="Uploaded CV"
              action={
                <button
                  onClick={() => cvRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 border-[1.5px] border-dashed border-[#1a6edb60] rounded-[9px] text-[#1a6edb] text-[12.5px] font-medium hover:bg-[#e8f1fd] transition"
                >
                  {Icon.upload}{" "}
                  {profile?.savedCvName ? "Replace CV" : "Upload CV"}
                </button>
              }
            >
              <input
                ref={cvRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCvFile(e.target.files[0])}
                className="hidden"
              />
              {profile?.savedCvName ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "#f0fdf4",
                    borderRadius: 12,
                    border: "1px solid #bbf7d0",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span style={{ color: "#22c55e", flexShrink: 0 }}>
                      {Icon.check}
                    </span>
                    <div>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 500,
                          color: "#1a1a2e",
                        }}
                      >
                        {profile.savedCvName}
                      </div>
                      <div
                        style={{ fontSize: 12, color: "#9090a8", marginTop: 2 }}
                      >
                        This CV will be used for quick applications
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setModal("cvpreview")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(0,0,0,0.13)] text-[#5a5a72] text-[12.5px] hover:bg-white transition"
                  >
                    {Icon.eye} Preview
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    padding: "24px 16px",
                    background: "#fffbeb",
                    borderRadius: 12,
                    border: "1px solid #fde68a",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
                  <div
                    style={{ fontSize: 13, color: "#92400e", fontWeight: 500 }}
                  >
                    No CV saved yet
                  </div>
                  <div style={{ fontSize: 12, color: "#9090a8", marginTop: 4 }}>
                    Upload your CV to enable Quick Apply and share with
                    employers
                  </div>
                  <button
                    onClick={() => cvRef.current?.click()}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#1a6edb] text-white rounded-xl text-sm font-medium hover:bg-[#0d4fa3] transition mx-auto"
                  >
                    {Icon.upload} Upload CV
                  </button>
                </div>
              )}
              {cvFile && (
                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 13, color: "#5a5a72" }}>
                    {cvFile.name}
                  </span>
                  <button
                    onClick={uploadCv}
                    disabled={cvUploading}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#1a6edb] text-white rounded-xl text-sm font-medium hover:bg-[#0d4fa3] disabled:opacity-50 transition"
                  >
                    {cvUploading ? Icon.spin : Icon.save}
                    {cvUploading ? "Uploading…" : "Save to Profile"}
                  </button>
                </div>
              )}
              {cvMsg && (
                <p
                  className={`mt-3 text-sm ${cvMsg.includes("saved") || cvMsg.includes("CV") ? "text-green-600" : "text-red-500"}`}
                >
                  {cvMsg}
                </p>
              )}
            </SectionCard>
          </div>
        );
      case "saved":
        return (
          <SavedJobsPanel
            savedJobs={savedJobs}
            loading={loadingSaved}
            onUnsave={toggleSave}
            onApply={(job) => {
              setShowApply(true);
            }}
          />
        );
      case "settings":
        return (
          <JobSettingsPage
            token={token}
            profile={profile}
            savedJobs={savedJobs}
            loadingSaved={loadingSaved}
            onBrowseJobs={() => setActiveNav("dashboard")}
            onOpenProfile={() => setActiveNav("profile")}
            onOpenSaved={() => setActiveNav("saved")}
            onOpenApplications={() => setActiveNav("applications")}
          />
        );
      case "applications":
        return (
          <ApplicationsPage
            token={token}
            profile={profile}
            onBrowseJobs={() => setActiveNav("dashboard")}
          />
        );
      //   case "applications":
      //     return <PlaceholderPage title="Applications" icon={Icon.briefcase} description="Track all your job applications, their statuses, and any recruiter feedback here." />;
   case "messages":
  return (
    <MessagesPage
      token={token}
      userId={userId}
      socket={socketRef.current}
    />
  );
      case "terms":
        return <TermsPage />;
      default:
        return renderProfilePage();
    }
  };

  const renderProfilePage = () => (
   <div className="page-padding" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {saveMsg && !modal && (
        <div
          className={`px-4 py-3 rounded-xl text-sm font-medium fade-in ${saveMsg.includes("success") || saveMsg.includes("saved") || saveMsg.includes("!") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}
        >
          {saveMsg}
        </div>
      )}

      {/* Completion card */}
      <div
        className="completion-card"
        style={{
          background: "#fff", borderRadius: 14,
          border: "1px solid rgba(0,0,0,0.08)", padding: "18px 24px",
        }}
      >
        <div style={{ flex: "0 0 auto" }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#1a1a2e",
              marginBottom: 3,
            }}
          >
            Complete your profile
          </div>
          <div style={{ fontSize: 12, color: "#9090a8" }}>
            Employers find you 4× faster with a complete profile
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 6,
            }}
          >
            <span
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 22,
                fontWeight: 600,
                color: barColor,
              }}
            >
              {pct}%
            </span>
            {pct < 80 && (
              <span style={{ fontSize: 12, color: "#1a6edb", fontWeight: 500 }}>
                +{Math.round((100 - pct) / 2)}% — add experience
              </span>
            )}
          </div>
          <div
            style={{
              height: 7,
              background: "#e8edf5",
              borderRadius: 99,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${barColor}, #6366f1)`,
                borderRadius: 99,
                transition: "width 0.7s",
              }}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            alignItems: "flex-end",
            flexShrink: 0,
          }}
        >
          {!filledWE.length && (
            <span
              style={{
                fontSize: 11,
                padding: "3px 10px",
                borderRadius: 20,
                fontWeight: 500,
                background: "#fef0e8",
                color: "#f26722",
              }}
            >
              Missing: work experience
            </span>
          )}
         {!(Array.isArray(profile?.specialization)
  ? profile.specialization.length
  : profile?.specialization) && (
  <span
    style={{
      fontSize: 11,
      padding: "3px 10px",
      borderRadius: 20,
      fontWeight: 500,
      background: "#e8f1fd",
      color: "#1a6edb",
    }}
  >
    Missing: summary
  </span>
)}
          {!profile?.savedCvFileId && (
            <span
              style={{
                fontSize: 11,
                padding: "3px 10px",
                borderRadius: 20,
                fontWeight: 500,
                background: "#fef9c3",
                color: "#854d0e",
              }}
            >
              Missing: CV
            </span>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <SectionCard
        dotColor="#1a6edb"
        title="Personal information"
        action={
          <GhostBtn
            onClick={() => {
              setForm(profile);
              setModal("personal");
              setSaveMsg("");
            }}
          >
            {Icon.edit} Edit
          </GhostBtn>
        }
      >
       <div className="personal-info-inner" style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <div
              onClick={() => setModal("avatar")}
              style={{
                width: 88,
                height: 88,
                borderRadius: 16,
                background: "linear-gradient(135deg,#e0e8f8,#c8d8f0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid rgba(0,0,0,0.08)",
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
              }}
              className="group"
            >
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <svg viewBox="0 0 60 60" fill="#a0b4d0" width="44" height="44">
                  <circle cx="30" cy="22" r="12" />
                  <path d="M8 52c0-12.15 9.85-22 22-22s22 9.85 22 22" />
                </svg>
              )}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.2s",
                  borderRadius: 14,
                }}
                className="group-hover:opacity-100"
              >
                <span
                  style={{
                    color: "white",
                    fontSize: 11,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {Icon.camera}
                </span>
              </div>
            </div>
            <div
              onClick={() => setModal("avatar")}
              style={{
                marginTop: 8,
                fontSize: 11,
                color: "#1a6edb",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Change photo
            </div>
          </div>

       <div className="personal-info-fields" style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
            <F
              label="Full Name"
              value={[
                profile?.firstName,
                profile?.secondName,
                profile?.lastName,
              ]
                .filter(Boolean)
                .join(" ")}
            />
            <F label="Email" value={profile?.email} color="#1a6edb" />
            <F label="Phone Number" value={profile?.phoneNumber} />
            <F label="WhatsApp No." value={profile?.whatsAppNo} />
            <F label="Age" value={profile?.age} />
            <F label="ID Number" value={profile?.idNumber} />
            <F label="Passport No." value={profile?.PassportNo} />
            <F
              label="Driving Licence"
              value={
                profile?.hasDrivingLicence
                  ? profile.hasDrivingLicence === "yes"
                    ? "Yes"
                    : "No"
                  : null
              }
            />
            <F label="Nationality" value={profile?.nationality} />
            <F label="Location" value={profile?.location} />
          </div>
        </div>
      </SectionCard>

      {/* Two-column row */}
      <div className="profile-grid-2col" style={{ gap: 20 }}>
        <SectionCard
          dotColor="#6366f1"
          title="Professional summary"
          action={
            <GhostBtn onClick={() => setModal("summary")}>
              {Icon.edit} Edit
            </GhostBtn>
          }
        >
          {profile?.specialization ||
profile?.positionApplied ||
profile?.highestEducationLevel ? (
            <div className="space-y-3">
              {profile?.specialization && (
                <div>
                  <FL label="Specialization" />
                  <p style={{ fontSize: 13.5, color: "#1a1a2e", marginTop: 3 }}>
                    {profile.specialization}
                  </p>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {profile?.positionApplied && (
                  <span
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 99,
                      background: "#e8f1fd",
                      color: "#1a6edb",
                      fontWeight: 500,
                    }}
                  >
                    {profile.positionApplied}
                  </span>
                )}
                {profile?.highestEducationLevel && (
                  <span
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 99,
                      background: "#f0f0ff",
                      color: "#6366f1",
                      fontWeight: 500,
                    }}
                  >
                   {profile.highestEducationLevel}
                  </span>
                )}
{profile?.salaryInfo && (
  <span
    style={{
      fontSize: 12,
      padding: "4px 10px",
      borderRadius: 99,
      background: "#f0fdf4",
      color: "#16a34a",
      fontWeight: 500,
    }}
  >
    Salary: {profile.salaryInfo}
  </span>
)}
{profile?.payslipAttachmentFileId && (
  <a
    href={`${API}/profile/payslip/${profile.payslipAttachmentFileId}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      fontSize: 12,
      padding: "4px 10px",
      borderRadius: 99,
      background: "#f0fdf4",
      color: "#16a34a",
      fontWeight: 500,
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      textDecoration: "none",
    }}
  >
    {Icon.download} Payslip
  </a>
)}
              </div>
              
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#f4f6fb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg viewBox="0 0 20 20" fill="#9090a8" width="16" height="16">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 13, color: "#9090a8" }}>
                  No summary added yet
                </div>
                <div style={{ marginTop: 8 }}>
                  <AddBtn onClick={() => setModal("summary")}>
                    Add summary ↗
                  </AddBtn>
                </div>
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard
          dotColor="#f26722"
          title="Skills"
          action={
            <GhostBtn onClick={() => setModal("skills")}>
              {Icon.edit} Edit
            </GhostBtn>
          }
        >
          {skills.length > 0 ? (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {skills.map((s) => (
                  <span
                    key={s}
                    style={{
                      padding: "6px 13px",
                      borderRadius: 99,
                      fontSize: 12,
                      fontWeight: 500,
                      background: "#f4f6fb",
                      border: "1px solid rgba(0,0,0,0.1)",
                      color: "#5a5a72",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 14 }}>
                <AddBtn onClick={() => setModal("skills")}>Add skill ↗</AddBtn>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#f4f6fb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {Icon.tag}
              </div>
              <div>
                <div style={{ fontSize: 13, color: "#9090a8" }}>
                  No skills added yet
                </div>
                <div style={{ marginTop: 8 }}>
                  <AddBtn onClick={() => setModal("skills")}>
                    Add skill ↗
                  </AddBtn>
                </div>
              </div>
            </div>
          )}
        </SectionCard>
      </div>

      {/* Work Experience */}
      <SectionCard
        dotColor="#0d9488"
        title="Work experience"
        action={
          <AddBtn
            onClick={() => {
              setWorkExpModalData({ entry: {}, index: -1, isNew: true });
              setModal("workexp");
            }}
          >
            Add experience
          </AddBtn>
        }
      >
        {filledWE.length > 0 ? (
          <div>
            {workExperience.map((w, i) => {
              if (!w.company) return null;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 14,
                    padding: "14px 0",
                    borderBottom:
                      i < workExperience.length - 1
                        ? "1px solid rgba(0,0,0,0.06)"
                        : "none",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 9,
                      background: "#f4f6fb",
                      border: "1px solid rgba(0,0,0,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {Icon.briefcase}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 500,
                        color: "#1a1a2e",
                      }}
                    >
                      {w.position || "—"}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "#5a5a72", marginTop: 2 }}
                    >
                      {w.company}
                    </div>
                  
                    {w.duration && (
  <div style={{ fontSize: 11.5, color: "#9090a8", marginTop: 3 }}>
    {w.duration}
  </div>
)}

{w.salary && (
  <div style={{ 
    fontSize: 11.5, 
    color: "#16a34a", 
    marginTop: 3,
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontWeight: 500,
  }}>
    Salary Earned/per month: {w.salary}
  </div>
)}
                  {w.responsibilities?.length > 0 && (
  <ul style={{ marginTop: 6, paddingLeft: 0, listStyle: "none" }}>
    {w.responsibilities.map((r, idx) => (
      <li key={idx} style={{ fontSize: 12, color: "#5a5a72", display: "flex", gap: 6, lineHeight: 1.5 }}>
        <span style={{ color: "#9090a8", flexShrink: 0 }}>•</span>
        <span>{r}</span>
      </li>
    ))}
  </ul>
)}
                  </div>
                  <button
                    onClick={() => {
                      setWorkExpModalData({ entry: w, index: i, isNew: false });
                      setModal("workexp");
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[rgba(0,0,0,0.1)] text-[#5a5a72] text-[11.5px] hover:bg-[#f4f6fb] transition flex-shrink-0"
                  >
                    {Icon.edit}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#f4f6fb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {Icon.briefcase}
            </div>
            <div style={{ fontSize: 13, color: "#5a5a72" }}>
              No work experience added yet. Adding experience increases your
              profile completion by <strong>+20%</strong>.
            </div>
          </div>
        )}
      </SectionCard>

      {/* Education */}
      <SectionCard
        dotColor="#7c3aed"
        title="Education"
        action={
          <GhostBtn onClick={() => setModal("education")}>
            {education.filter((e) => e.degree || e.institution).length ? (
              <>{Icon.edit} Edit</>
            ) : (
              <>{Icon.plus} Add education ↗</>
            )}
          </GhostBtn>
        }
      >
        {education.filter((e) => e.degree || e.institution).length > 0 ? (
          <div>
            {education
              .filter((e) => e.degree || e.institution)
              .map((e, i, arr) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 14,
                    padding: "12px 0",
                    borderBottom:
                      i < arr.length - 1
                        ? "1px solid rgba(0,0,0,0.06)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 9,
                      background: "#ede9fe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#7c3aed",
                    }}
                  >
                    {(e.academicLevel || e.degree || "E")[0].toUpperCase()}
                  </div>
                  <div>
                    {/* Academic Level badge */}
                    {e.academicLevel && (
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 600,
                          padding: "2px 8px",
                          borderRadius: 99,
                          background: "#ede9fe",
                          color: "#7c3aed",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          display: "inline-block",
                          marginBottom: 4,
                        }}
                      >
                        {e.academicLevel}
                      </span>
                    )}

                    {/* Degree */}
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 500,
                        color: "#1a1a2e",
                      }}
                    >
                      
                    </div>

                    {/* Course Name */}
                    {e.courseName && (
                      <div
                        style={{
                          fontSize: 12.5,
                          color: "#1a6edb",
                          marginTop: 2,
                          fontWeight: 500,
                        }}
                      >
                        {e.courseName}
                      </div>
                    )}

                    {/* Institution */}
                    {e.institution && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "#5a5a72",
                          marginTop: 2,
                        }}
                      >
                        {e.institution}
                      </div>
                    )}
                    {/* Certificate viewer */}
                    {e.certificateFileId && (
                      <CertificateActions
                        fileId={e.certificateFileId}
                        token={token}
                        fileName={`${e.courseName || e.academicLevel || "Certificate"}`}
                      />
                    )}

                    {/* Date range */}
                    {(e.dateStart || e.dateEnd || e.yearStart || e.yearEnd) &&
                      (() => {
                        const months = [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ];
                        const fmt = (dateStr) => {
                          if (!dateStr) return "";
                          const [year, month] = dateStr.split("-");
                          const m = parseInt(month, 10);
                          return m >= 1 && m <= 12
                            ? `${months[m - 1]} ${year}`
                            : year;
                        };
                        const start = e.dateStart
                          ? fmt(e.dateStart)
                          : e.yearStart || "";
                        const end = e.currentlyStudying
                          ? "Present"
                          : e.dateEnd
                            ? fmt(e.dateEnd)
                            : e.yearEnd || "";
                        return (
                          <div
                            style={{
                              fontSize: 11.5,
                              color: "#9090a8",
                              marginTop: 4,
                            }}
                          >
                            📅 {start}
                            {start && end ? " – " : ""}
                            {end}
                          </div>
                        );
                      })()}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#f4f6fb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 20 20" fill="#9090a8" width="16" height="16">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <div style={{ fontSize: 13, color: "#9090a8" }}>
              No education added yet
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard
  dotColor="#0369a1"
  title="Professional Qualifications & Memberships"
  action={
    <GhostBtn onClick={() => setModal("professional")}>
      {qualifications.length || memberships.length ? <>{Icon.edit} Edit</> : <>{Icon.plus} Add</>}
    </GhostBtn>
  }
>
  {qualifications.length === 0 && memberships.length === 0 ? (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f4f6fb", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {Icon.tag}
      </div>
      <div style={{ fontSize: 13, color: "#9090a8" }}>No professional qualifications or memberships added yet</div>
    </div>
  ) : (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {qualifications.filter(q => q.name).length > 0 && (
        <div>
          <FL label="Qualifications" />
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
            {qualifications.filter(q => q.name).map((q, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#0369a1", flexShrink: 0 }}>
                  {(q.name[0] || "Q").toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: "#1a1a2e" }}>{q.name}</div>
                  {q.institution && <div style={{ fontSize: 12, color: "#5a5a72", marginTop: 2 }}>{q.institution}</div>}
                  {q.dateObtained && <div style={{ fontSize: 11.5, color: "#9090a8", marginTop: 2 }}>📅 {new Date(q.dateObtained).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</div>}
                  {q.certificateFileId && (
        <CertificateActions
          fileId={q.certificateFileId}
          token={token}
          fileName={`${q.name} Certificate`}
        />
      )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {memberships.filter(m => m.organization).length > 0 && (
        <div>
          <FL label="Memberships" />
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
            {memberships.filter(m => m.organization).map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#92400e", flexShrink: 0 }}>
                  {(m.organization[0] || "M").toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: "#1a1a2e" }}>{m.organization}</div>
                  {m.membershipId && <div style={{ fontSize: 12, color: "#5a5a72", marginTop: 2 }}>ID: {m.membershipId}</div>}
                  {m.startDate && <div style={{ fontSize: 11.5, color: "#9090a8", marginTop: 2 }}>📅 {new Date(m.startDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })} – {m.endDate ? new Date(m.endDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "Present"}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )}
</SectionCard>

      {/* Saved CV */}
      <SectionCard
        dotColor="#1a6edb"
        title="Uploaded CV"
        action={
          <button
            onClick={() => cvRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 border-[1.5px] border-dashed border-[#1a6edb60] rounded-[9px] text-[#1a6edb] text-[12.5px] font-medium hover:bg-[#e8f1fd] transition"
          >
            {Icon.upload} {profile?.savedCvName ? "Replace CV" : "Upload CV"}
          </button>
        }
      >
        <input
          ref={cvRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setCvFile(e.target.files[0])}
          className="hidden"
        />
        {profile?.savedCvName ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              background: "#f0fdf4",
              borderRadius: 12,
              border: "1px solid #bbf7d0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: "#22c55e", flexShrink: 0 }}>
                {Icon.check}
              </span>
              <div>
                <div
                  style={{ fontSize: 13.5, fontWeight: 500, color: "#1a1a2e" }}
                >
                  {profile.savedCvName}
                </div>
                <div style={{ fontSize: 12, color: "#9090a8", marginTop: 2 }}>
                  This CV will be used for quick applications
                </div>
              </div>
            </div>
            <button
              onClick={() => setModal("cvpreview")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(0,0,0,0.13)] text-[#5a5a72] text-[12.5px] hover:bg-white transition"
            >
              {Icon.eye} Preview
            </button>
          </div>
        ) : (
          <div
            style={{
              padding: "12px 16px",
              background: "#fffbeb",
              borderRadius: 12,
              border: "1px solid #fde68a",
              fontSize: 13,
              color: "#92400e",
            }}
          >
            No CV saved yet. Upload one to enable Quick Apply.
          </div>
        )}
        {cvFile && (
          <div
            style={{
              marginTop: 12,
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 13, color: "#5a5a72" }}>
              {cvFile.name}
            </span>
            <button
              onClick={uploadCv}
              disabled={cvUploading}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1a6edb] text-white rounded-xl text-sm font-medium hover:bg-[#0d4fa3] disabled:opacity-50 transition"
            >
              {cvUploading ? Icon.spin : Icon.save}
              {cvUploading ? "Uploading…" : "Save to Profile"}
            </button>
          </div>
        )}
        {cvMsg && (
          <p
            className={`mt-3 text-sm ${cvMsg.includes("saved") || cvMsg.includes("CV") ? "text-green-600" : "text-red-500"}`}
          >
            {cvMsg}
          </p>
        )}
      </SectionCard>
    </div>
  );

  const pageTitles = {
    profile: "Profile Update",
    dashboard: "Dashboard",
    cv: "Uploaded CV",
    saved: "Saved Jobs",
    settings: "Job Settings",
    applications: "Applications",
    messages: "Messages",
    terms: "Terms & Conditions",
  };

  return (
    <>
     <style>{`
 @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Fraunces:ital,wght@0,400;0,600;1,400&display=swap');
* { box-sizing: border-box; }
body { font-family: 'DM Sans', sans-serif; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.fade-in { animation: fadeIn 0.25s ease; }
.group:hover .group-hover\\:opacity-100 { opacity: 1 !important; }
input[type="date"] { color-scheme: dark; }
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: brightness(0) saturate(100%);
}
.sidebar {
  position: fixed; top: 0; left: 0; height: 100vh;
  transform: translateX(-100%); transition: transform 0.25s ease;
  z-index: 50; width: 240px;
  background: #fff;
  border-right: 1px solid rgba(0,0,0,0.08);
  display: flex; flex-direction: column; padding: 28px 0;
}
.sidebar.open { transform: translateX(0); }
.sidebar-overlay {
  display: none;
  position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 40;
}
.sidebar-overlay.open { display: block; }
.bottom-nav {
  display: none;
  position: fixed; bottom: 0; left: 0; right: 0;
  background: #fff; border-top: 1px solid rgba(0,0,0,0.08);
  z-index: 30; padding: 6px 0 max(6px, env(safe-area-inset-bottom));
}
.main-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
  background: #f4f6fb;
}
@media (max-width: 768px) {
  .main-layout { grid-template-columns: 1fr; }
  .main-content { padding-bottom: 72px; }
  .page-padding { padding: 16px !important; }
  .profile-grid-2col { grid-template-columns: 1fr !important; }
  .personal-inner { flex-direction: column !important; align-items: center !important; }
  .personal-fields { grid-template-columns: 1fr !important; }
  .completion-card { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
  .modal-sheet {
    max-width: 100% !important; width: 100% !important;
    max-height: 92vh !important;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
  .modal-overlay { align-items: flex-end !important; padding: 0 !important; }
  .bottom-nav { display: flex; justify-content: space-around; align-items: center; }
  .sidebar-overlay.open { display: block; }
}
@media (max-width: 480px) {
  .top-bar-label { display: none; }
  .top-bar-btn { min-width: unset !important; padding: 8px 10px !important; }
}
@media (min-width: 769px) {
  .sidebar {
    position: sticky !important; top: 0;
    transform: translateX(0) !important;
    flex-shrink: 0;
  }
    @media (max-width: 768px) {
  .personal-info-inner {
    flex-direction: column !important;
    align-items: center !important;
  }
  .personal-info-fields {
    grid-template-columns: 1fr !important;
  }
}
  .bottom-nav { display: none !important; }
  .sidebar-overlay { display: none !important; }
  .hamburger-btn { display: none !important; }
}
`}</style>

      {/* Modals */}
      {showApply && (
        <QuickApplyModal
          onClose={() => setShowApply(false)}
          savedCvName={profile?.savedCvName}
          token={token}
        />
      )}
      {generalApplyModal && (
  <ApplyConfirmModal
    job={{ title: "General Application", location: "" }}
    profile={profile}
    onConfirm={async () => {
      setGeneralApplying(true);
      setGeneralApplyError("");
      try {
        const fd = new FormData();
        fd.append("email",    profile?.email || "");
        fd.append("jobId",    "general");
        fd.append("jobTitle", "General Application");
        fd.append("firstName", profile?.firstName || "");
        fd.append("lastName",  profile?.lastName  || "");
        if (!profile?.savedCvFileId) {
          setGeneralApplyError("No CV. Please upload a CV first.");
          setGeneralApplying(false);
          return;
        }
       await api.post(`${API}/applications`, fd, {
  headers: { "Content-Type": "multipart/form-data" },
});
        setGeneralApplySuccess(true);
        setTimeout(() => {
          setGeneralApplyModal(false);
          setGeneralApplySuccess(false);
        }, 2800);
      } catch (err) {
        setGeneralApplyError(err.response?.data?.message || "Error submitting.");
      } finally {
        setGeneralApplying(false);
      }
    }}
    onClose={() => { setGeneralApplyModal(false); setGeneralApplyError(""); }}
    loading={generalApplying}
    error={generalApplyError}
    success={generalApplySuccess}
  />
)}

      {modal === "personal" && (
        <PersonalModal
          form={form}
          onChange={changeForm}
          onClose={() => {
            setModal(null);
            setForm(profile);
            setSaveMsg("");
          }}
          onSave={savePersonal}
          saving={saving}
          saveMsg={saving ? "" : saveMsg}
        />
      )}
      {modal === "summary" && (
        <SummaryModal
          form={form}
          onClose={() => setModal(null)}
          onSave={saveSummary}
          saving={saving}
          token={token}
        />
      )}
      {modal === "skills" && (
        <SkillsModal
          skills={skills}
          onClose={() => setModal(null)}
          onSave={saveSkills}
          saving={saving}
        />
      )}
      {modal === "education" && (
        <EducationModal
          education={education}
          onClose={() => setModal(null)}
          onSave={saveEducation}
          saving={saving}
          token={token}
        />
      )}
      {modal === "professional" && (
  <ProfessionalModal
    qualifications={qualifications}
    memberships={memberships}
    onClose={() => setModal(null)}
    onSave={saveProfessional}
    saving={saving}
    token={token}
  />
)}
      {modal === "workexp" && (
        <WorkExpModal
          entry={workExpModalData.entry}
          index={workExpModalData.index}
          isNew={workExpModalData.isNew}
          onClose={() => setModal(null)}
          onSave={saveWorkExp}
          onDelete={deleteWorkExp}
          saving={saving}
        />
      )}
      {modal === "avatar" && (
        <AvatarModal
          currentUrl={displayAvatar}
          onClose={() => setModal(null)}
          onSave={saveAvatar}
          saving={saving}
        />
      )}
      {modal === "cvpreview" && (
        <CvPreviewModal
          cvUrl={cvPreviewUrl}
          cvName={profile?.savedCvName}
          onClose={() => setModal(null)}
           token={token} 
        />
      )}

      {/* Layout */}
      <div
        className="main-layout"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
       {/* Sidebar overlay (mobile) */}
        <div
          className={`sidebar-overlay${sidebarOpen ? " open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
          <div
            style={{
              padding: "0 24px 24px",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              marginBottom: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  background: "#1a6edb",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg viewBox="0 0 16 16" width="14" height="14" fill="white">
                  <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 9a5.25 5.25 0 01-4.374-2.344C3.956 9.312 6.391 8.5 8 8.5c1.607 0 4.045.812 4.374 2.156A5.25 5.25 0 018 13z" />
                </svg>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#1a1a2e",
                  }}
                >
                  <button href="/">AMSOL</button>
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#9090a8",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  <button href="/">Jobs Portal</button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: "0 12px", flex: 1 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: "#9090a8",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "6px 12px 4px",
              }}
            >
              Main
            </div>
            <NavItem
              icon={Icon.apps}
              label="Dashboard"
              active={activeNav === "dashboard"}
              onClick={() => {setActiveNav("dashboard"); setSidebarOpen(false); }}
            />
             <NavItem
              icon={Icon.user}
              label="Profile"
              active={activeNav === "profile"}
              onClick={() => { setActiveNav("profile"); setSidebarOpen(false); }}
            />
              <NavItem
              icon={Icon.file}
              label="Uploaded CV"
              active={activeNav === "cv"}
              onClick={() => { setActiveNav("cv"); setSidebarOpen(false); }}
            />
            <NavItem
              icon={Icon.bookmark}
              label="Saved Jobs"
              active={activeNav === "saved"}
              onClick={() => { setActiveNav("saved"); setSidebarOpen(false); }}
            />
            <div
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: "#9090a8",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "14px 12px 4px",
              }}
            >
              Career
            </div>
             <NavItem
              icon={Icon.settings}
              label="Job Settings"
              active={activeNav === "settings"}
              onClick={() => { setActiveNav("settings"); setSidebarOpen(false); }}
            />
             <NavItem
              icon={Icon.briefcase}
              label="Applications"
              active={activeNav === "applications"}
              badge={applicationsCount}
              onClick={() => { setActiveNav("applications"); setSidebarOpen(false); }}
            />
            <NavItem
              icon={Icon.msg}
              label="Messages"
              active={activeNav === "messages"}
              onClick={() => { setActiveNav("messages"); setSidebarOpen(false); }}
            />
          </div>
<NavItem
              icon={Icon.file}
              label="Terms & Conditions"
              active={activeNav === "terms"}
              onClick={() => { setActiveNav("terms"); setSidebarOpen(false); }}
            />
          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: displayAvatar
                    ? "transparent"
                    : "linear-gradient(135deg,#1a6edb,#6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "white",
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                {displayAvatar ? (
                  <img
                    src={displayAvatar}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  initials
                )}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#1a1a2e",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {fullName}
                </div>
                <div style={{ fontSize: 11, color: "#9090a8" }}>Job Seeker</div>
                <div
                  style={{ fontSize: 15, color: "#f30928ff", fontWeight: 500 }}
                >
                  <button onClick={handleLogoutClick}>Log out</button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="main-content" style={{ overflowY: "auto" }}>
       <div
            style={{
              background: "#fff",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              padding: "0 16px",
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              zIndex: 10,
              gap: 8,
            }}
          >
            {/* Hamburger - mobile only */}
            <button
              className="hamburger-btn"
              onClick={() => setSidebarOpen(true)}
              style={{
                flexShrink: 0, padding: 6, borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.1)", background: "transparent",
                cursor: "pointer", display: "flex", alignItems: "center",
              }}
            >
              <svg viewBox="0 0 20 20" fill="#5a5a72" width="20" height="20">
                <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z" clipRule="evenodd"/>
              </svg>
            </button>
            <span
              style={{
                fontFamily: "'Fraunces', serif", fontSize: 18,
                fontWeight: 600, color: "#1a1a2e", flex: 1,
              }}
            >
              {pageTitles[activeNav] || "Profile"}
            </span>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button
                onClick={handlePreviewCv}
                className="top-bar-btn flex items-center gap-1.5 px-4 py-2 rounded-[9px] border border-[rgba(0,0,0,0.13)] text-[#5a5a72] text-[13px] font-medium hover:bg-[#f4f6fb] transition"
              >
                {Icon.eye} <span className="top-bar-label">Preview CV</span>
              </button>
              <button
               onClick={() => setGeneralApplyModal(true)}
                className="top-bar-btn flex items-center gap-1.5 px-4 py-2 rounded-[9px] bg-[#f26722] text-white text-[13px] font-medium hover:bg-[#d95a1a] transition"
              >
                 <span className="top-bar-label">Quick Apply</span>
              </button>
            </div>
          </div>

          {renderPageContent()}
        </div>
      </div>
      {/* Bottom nav - mobile only */}
      <nav className="bottom-nav">
        {[
          { key: "dashboard",    icon: Icon.apps,      label: "Home" },
          { key: "profile",      icon: Icon.user,      label: "Profile" },
          { key: "applications", icon: Icon.briefcase, label: "Apply" },
          { key: "saved",        icon: Icon.bookmark,  label: "Saved" },
          { key: "messages",     icon: Icon.msg,       label: "Messages" },
        ].map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveNav(key)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              gap: 2, padding: "4px 12px", border: "none", background: "transparent",
              cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              color: activeNav === key ? "#1a6edb" : "#9090a8",
              fontSize: 10, fontWeight: activeNav === key ? 600 : 400,
            }}
          >
            {icon}
            {label}
          </button>
        ))}
      </nav>
    </>
   
  );
};

export default UserProfileDashboard;
