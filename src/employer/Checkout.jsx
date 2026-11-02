import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../api/axiosInstance";
import { kes } from "./employerShared";

const Checkout = () => {
  const [p] = useSearchParams();
  const navigate = useNavigate();
  const ids = (p.get("ids") || "").split(",").filter(Boolean);
  const searchId = p.get("search") || "";
  const ret = p.get("return") || "/employer/applicants";
  const [w, setW] = useState(null);
  const [busy, setBusy] = useState("");

  useEffect(() => {
    api.get("/api/employer/billing/wallet").then(({ data }) => setW(data)).catch(() => toast.error("Could not load your wallet."));
  }, []);

  if (!ids.length) {
    return <div className="ep-card ep-center"><p className="ep-sub">No candidates selected.</p><Link to="/employer/find-talent" className="ep-btn amber">Find talent</Link></div>;
  }
  if (!w) return <div className="ed-empty">Loading…</div>;

  const total = ids.length * w.unlockPrice;
  const short = Math.max(0, total - w.balance);
  const topupAmount = Math.ceil(Math.max(short, w.minTopup) / 100) * 100;

  // Lets Billing send the employer back here (after a top-up) or to their results (after a direct payment)
  const remember = () => sessionStorage.setItem("employerCheckout", JSON.stringify({ resume: window.location.pathname + window.location.search, ret }));
  const fail = (e, fallback) => { toast.error(e.response?.data?.message || fallback); setBusy(""); };

  const payWallet = async () => {
    setBusy("wallet");
    try {
      await api.post("/api/employer/billing/unlock", { profileIds: ids, searchId });
      toast.success("Candidates unlocked.");
      navigate(ret, { replace: true });
    } catch (e) { fail(e, "Could not unlock the candidates."); }
  };

  const topUp = async () => {
    setBusy("topup"); remember();
    try {
      const { data } = await api.post("/api/employer/billing/topup", { amount: topupAmount });
      window.location.href = data.authorizationUrl;
    } catch (e) { fail(e, "Could not start the top-up."); }
  };

  const direct = async () => {
    setBusy("direct"); remember();
    try {
      const { data } = await api.post("/api/employer/checkout", { profileIds: ids, searchId });
      if (data.alreadyUnlocked) return navigate(ret, { replace: true });
      window.location.href = data.authorizationUrl;
    } catch (e) { fail(e, "Could not start the payment."); }
  };

  return (
    <>
      <div className="ep-head"><div><h2>Unlock {ids.length} candidate{ids.length === 1 ? "" : "s"}</h2><p>You'll see their names, contact details and CVs, and can screen, message and interview them.</p></div></div>

      <div className="ep-card">
        <div className="ep-split"><span>{ids.length} × {kes(w.unlockPrice)}</span><b>{kes(total)}</b></div>
        <div className="ep-split ep-sub"><span>Your wallet balance</span><b>{kes(w.balance)}</b></div>
      </div>

      <div className={`ep-opt ${short === 0 ? "rec" : ""}`}>
        <div><h4>Pay from wallet</h4><p className="ep-sub">{short === 0 ? `${kes(total)} will be deducted. You'll have ${kes(w.balance - total)} left.` : `You need ${kes(short)} more in your wallet.`}</p></div>
        <button className="ep-btn amber" disabled={short > 0 || !!busy} onClick={payWallet}>{busy === "wallet" ? "Unlocking…" : "Unlock now"}</button>
      </div>

      {short > 0 && (
        <div className="ep-opt rec">
          <div><h4>Top up and continue</h4><p className="ep-sub">Add {kes(topupAmount)} to your wallet, then come straight back here to finish. Leftover balance stays in your wallet for next time.</p></div>
          <button className="ep-btn amber" disabled={!!busy} onClick={topUp}>{busy === "topup" ? "Opening…" : `Top up ${kes(topupAmount)}`}</button>
        </div>
      )}

      <div className="ep-opt">
        <div><h4>Pay for this unlock only</h4><p className="ep-sub">Pay {kes(total)} directly on the secure checkout page without topping up your wallet.</p></div>
        <button className="ep-btn ghost" disabled={!!busy} onClick={direct}>{busy === "direct" ? "Opening…" : `Pay ${kes(total)}`}</button>
      </div>

      <Link to={ret} className="ep-sub">← Cancel and go back</Link>
    </>
  );
};

export default Checkout;