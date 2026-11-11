import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import api, { API } from "../shared/api";
import { normalizeCvData } from "../cv/cvNormalize";

const Ctx = createContext(null);

export const useCvAutofill = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCvAutofill must be used inside <CvAutofillProvider>");
  return v;
};

/**
 * Parses the applicant's CV once (server side) and shares the result with every
 * profile section. Resets automatically when the saved CV changes.
 *  - cvFileId: id of the saved CV (falsy when none saved)
 *  - cvKey:    anything that changes when the CV is replaced (savedCvFileId)
 * The CV is downloaded through the shared axios instance, so expired access
 * tokens are refreshed automatically (a raw fetch() would get 401).
 */
export function CvAutofillProvider({ cvFileId, cvName, cvKey, children }) {
  const [status, setStatus] = useState("idle"); // idle | parsing | ready | error
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const inflight = useRef(null);

  useEffect(() => {
    setData(null); setStatus("idle"); setError(""); inflight.current = null;
  }, [cvKey]);

  const run = useCallback((getFile) => {
    if (inflight.current) return inflight.current;
    setStatus("parsing");
    setError("");
    const p = (async () => {
      try {
        const file = await getFile();
        const fd = new FormData();
        fd.append("cv", file);
        const { data: res } = await api.post(`${API}/profile/cv/parse`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const parsed = normalizeCvData(res.data || res);
        setData(parsed);
        setStatus("ready");
        return parsed;
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Could not read your CV.");
        setStatus("error");
        return null;
      } finally {
        inflight.current = null;
      }
    })();
    inflight.current = p;
    return p;
  }, []);

  // Pass { file } to parse a CV the applicant picks right now (not saved to profile).
  const ensureParsed = useCallback(
    async ({ file } = {}) => {
      if (file) return run(async () => file);
      if (data) return data;
      if (!cvFileId) {
        setError("No CV saved yet. Upload one to auto-fill.");
        setStatus("error");
        return null;
      }
      return run(async () => {
        let blob;
        try {
          const res = await api.get(`${API}/profile/cv/${cvFileId}`, { responseType: "blob" });
          blob = res.data;
        } catch {
          throw new Error("Could not download your saved CV. Please log in again and retry.");
        }
        return new File([blob], cvName || "cv.pdf", { type: blob.type || "application/pdf" });
      });
    },
    [data, cvFileId, cvName, run],
  );

  const value = useMemo(
    () => ({ status, data, error, hasSavedCv: !!cvFileId, parsing: status === "parsing", ensureParsed }),
    [status, data, error, cvFileId, ensureParsed],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
