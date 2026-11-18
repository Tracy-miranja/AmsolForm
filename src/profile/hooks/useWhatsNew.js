import { useCallback, useEffect, useState } from "react";

// Shows an announcement once per user (per browser). Change `version` to announce something new later.
export const WHATS_NEW_VERSION = "cv-ai-2026-11";

export default function useWhatsNew(userId, ready, version = WHATS_NEW_VERSION) {
  const key = `amsol_whatsnew_${version}_${userId || "guest"}`;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    let seen = false;
    try { seen = !!localStorage.getItem(key); } catch { /* storage unavailable: show it */ }
    if (seen) return;
    const timer = setTimeout(() => setOpen(true), 700); // let the page settle first
    return () => clearTimeout(timer);
  }, [ready, key]);

  const dismiss = useCallback(() => {
    setOpen(false);
    try { localStorage.setItem(key, "1"); } catch { /* ignore */ }
  }, [key]);

  return { open, dismiss };
}
