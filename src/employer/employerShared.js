export const kes = (n) => `KES ${Number(n || 0).toLocaleString("en-KE")}`;

export const STAGE_LABEL = {
  applied: ["New", "info"], shortlisted: ["Shortlisted", "ok"], interview: ["Interview", "warn"],
  offer: ["Offer", "info"], hired: ["Hired", "ok"], rejected: ["Rejected", "bad"],
};

// Opens the checkout page where the employer pays from the wallet, tops up, or pays directly
export function startCheckout(profileIds, searchId) {
  const ret = searchId ? `/employer/find-talent?search=${searchId}` : window.location.pathname + window.location.search;
  const q = new URLSearchParams({ ids: profileIds.join(","), return: ret });
  if (searchId) q.set("search", searchId);
  window.location.assign(`/employer/checkout?${q.toString()}`);
  return "redirect";
}