import { useEffect, useState } from "react";
import useCountries from "../hooks/useCountries";
import { useCvAutofill } from "../hooks/CvAutofillContext";
import CvImportModal from "../modals/CvImportModal";
import { buildImportPlan } from "./buildImportPlan";

/**
 * Runs the "read my CV and fill my whole profile" flow.
 * request = { id, file } — file is the CV just uploaded (or null to use the saved CV).
 * Must be rendered inside <CvAutofillProvider>.
 */
export default function CvImportFlow({ data, request, onClose }) {
  const { ensureParsed, error } = useCvAutofill();
  const { countries } = useCountries();
  const [stage, setStage] = useState(null); // null | reading | review | error
  const [plan, setPlan] = useState([]);

  useEffect(() => {
    if (!request) { setStage(null); return; }
    let cancelled = false;
    (async () => {
      setStage("reading");
      const cv = await ensureParsed(request.file ? { file: request.file } : {});
      if (cancelled) return;
      if (!cv) { setStage("error"); return; }
      setPlan(buildImportPlan(cv, data, countries));
      setStage("review");
    })();
    return () => { cancelled = true; };
  }, [request?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!request || !stage) return null;

  const apply = async (sections) => {
    const patch = Object.assign({}, ...sections.map((s) => s.patch));
    const ok = await data.applyCvImport(patch);
    if (ok) onClose();
  };

  return <CvImportModal stage={stage} plan={plan} error={error} saving={data.saving} onApply={apply} onClose={onClose} />;
}
