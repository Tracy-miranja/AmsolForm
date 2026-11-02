import React, { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import api from "../../api/axiosInstance";
import { kes } from "./employerShared";
import { fmtDate, fmtTime } from "./employerUtils";

const Billing = () => {
  const [params, setParams] = useSearchParams();
  const [w, setW] = useState(null);
  const [act, setAct] = useState({ transactions: [], openTopups: [] });
  const [direct, setDirect] = useState([]);
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  const load = useCallback(() => Promise.all([
    api.get("/api/employer/billing/wallet").then(({ data }) => setW(data)),
    api.get("/api/employer/billing/activity").then(({ data }) => setAct(data)),
    api.get("/api/employer/payments").then(({ data }) => setDirect(data.filter((d) => d.status === "success"))),
  ]).catch(() => toast.error("Could not load billing.")), []);

  const verify = useCallback(async (ref) => {
    const url = ref.startsWith("TOP-") ? "/api/employer/billing/topup/verify" : "/api/employer/payments/verify";
    try { const { data } = await api.get(url, { params: { reference: ref } }); setResult({ ...data, kind: ref.startsWith("TOP-") ? "topup" : "unlock" }); }
    catch (e) { setResult({ status: "error", message: e.response?.data?.message }); }
    load();
  }, [load]);

  useEffect(() => {
    const ref = params.get("reference") || params.get("trxref");
    if (ref) { verify(ref); setParams({}, { replace: true }); } else load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topUp = async () => {
    const n = Math.round(Number(amount));
    if (!n || n < w.minTopup || n > w.maxTopup) return toast.error(`Enter an amount between ${kes(w.minTopup)} and ${kes(w.maxTopup)}.`);
    setBusy(true);
    try { const { data } = await api.post("/api/employer/billing/topup", { amount: n }); window.location.href = data.authorizationUrl; }
    catch (e) { toast.error(e.response?.data?.message || "Could not start the top-up."); setBusy(false); }
  };

  const saved = (() => { try { return JSON.parse(sessionStorage.getItem("employerCheckout") || "null"); } catch { return null; } })();

  const rows = [
    ...act.transactions.map((t) => ({ key: t.id, at: t.createdAt, label: t.description, sign: t.type === "credit" ? 1 : -1, amount: t.amount, after: t.balanceAfter })),
    ...direct.map((d) => ({ key: d.reference, at: d.paidAt || d.createdAt, label: `Direct payment: ${d.count} candidate${d.count === 1 ? "" : "s"}`, sign: 0, amount: d.amount })),
  ].sort((a, b) => new Date(b.at) - new Date(a.at));

  if (!w) return <div className="ed-empty">Loading…</div>;
  const funded = w.balance > 0 || act.transactions.some((t) => t.type === "credit");

  return (
    <>
      <div className="ep-head"><div><h2>Billing</h2><p>Top up your wallet once, then unlock candidates whenever you need them. Each unlock costs {kes(w.unlockPrice)} and stays unlocked for you.</p></div></div>

      {result && (
        <div className={`ep-note ${result.status === "success" ? "ok" : result.status === "pending" ? "warn" : "bad"}`}>
          {result.status === "success" && result.kind === "topup" && (<>Top-up received. Your balance is {kes(result.balance)}.{" "}
            {saved?.resume ? <Link to={saved.resume}>Continue to checkout</Link> : <Link to="/employer/find-talent">Find talent</Link>}</>)}
          {result.status === "success" && result.kind === "unlock" && (<>Payment received. {result.count} candidate{result.count === 1 ? "" : "s"} unlocked.{" "}
            <Link to={saved?.ret || (result.searchId ? `/employer/find-talent?search=${result.searchId}` : "/employer/applicants")}>Continue</Link></>)}
          {result.status === "pending" && "Your payment is still processing. Check again in a moment."}
          {result.status === "failed" && "That payment didn't go through, and you haven't been charged."}
          {result.status === "error" && (result.message || "We couldn't confirm that payment.")}
        </div>
      )}

      <div className="ep-wallet">
        <small>Wallet balance</small>
        <b>{kes(w.balance)}</b>
        <span>{w.balance >= w.unlockPrice ? `Enough for ${Math.floor(w.balance / w.unlockPrice)} unlock${Math.floor(w.balance / w.unlockPrice) === 1 ? "" : "s"}` : "Top up to start unlocking candidates"}</span>
      </div>

      <div className="ep-steps">
        <div className={`ep-step ${w.billingDetailsComplete ? "done" : ""}`}>
          {w.billingDetailsComplete ? <FaCheckCircle /> : <FaRegCircle />}
          <div><b>1. Billing details</b><p>{w.billingDetailsComplete ? "Saved." : <>Add your company name and billing email in <Link to="/employer/profile">My Profile</Link>.</>}</p></div>
        </div>
        <div className={`ep-step ${funded ? "done" : ""}`}>
          {funded ? <FaCheckCircle /> : <FaRegCircle />}
          <div><b>2. Fund your wallet</b><p>{funded ? "Done. Top up any time below." : "Choose an amount below."}</p></div>
        </div>
        <div className="ep-step">
          <FaRegCircle />
          <div><b>3. Unlock candidates</b><p><Link to="/employer/find-talent">Find talent</Link> or open your <Link to="/employer/applicants">applicants</Link>.</p></div>
        </div>
      </div>

      <div className="ep-card">
        <h4 style={{ margin: "0 0 10px" }}>Top up your wallet</h4>
        <div className="ep-presets">
          {w.presets.map((p) => <button key={p} type="button" className={Number(amount) === p ? "on" : ""} onClick={() => setAmount(String(p))}>{kes(p)}</button>)}
        </div>
        <div className="ep-actions">
          <input className="ep-in" style={{ maxWidth: 220 }} type="number" min={w.minTopup} max={w.maxTopup} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Other amount (KES)" />
          <button className="ep-btn amber" disabled={busy || !amount} onClick={topUp}>{busy ? "Opening checkout…" : amount ? `Top up ${kes(amount)}` : "Top up"}</button>
        </div>
        <p className="ep-sub">You'll pay on a secure checkout page (card or mobile money). Minimum {kes(w.minTopup)}, maximum {kes(w.maxTopup)} per top-up. Your balance updates as soon as the payment is confirmed.</p>
      </div>

      {act.openTopups.length > 0 && (
        <div className="ep-card">
          <h4 style={{ margin: "0 0 8px" }}>Unfinished top-ups</h4>
          {act.openTopups.map((t) => (
            <div key={t.reference} className="ep-split" style={{ padding: "6px 0" }}>
              <span>{kes(t.amount)} · {fmtDate(t.createdAt)} <span className={`ep-chip ${t.status === "failed" ? "bad" : "warn"}`}>{t.status}</span></span>
              {t.status === "pending" && <button className="ep-btn sm ghost" onClick={() => verify(t.reference)}>I've paid. Check status</button>}
            </div>
          ))}
        </div>
      )}

      <h4 className="ep-h4">Activity</h4>
      {rows.length === 0 && <div className="ep-card ep-center"><p className="ep-sub">No activity yet.</p></div>}
      {rows.map((r) => (
        <article key={r.key} className="ep-row ep-act">
          <div><b>{r.label}</b><p className="ep-sub">{fmtDate(r.at)}, {fmtTime(r.at)}</p></div>
          <b className={`ep-amt ${r.sign > 0 ? "plus" : r.sign < 0 ? "minus" : ""}`}>{r.sign > 0 ? "+" : r.sign < 0 ? "−" : ""}{kes(r.amount)}</b>
          <span className="ep-sub">{r.after != null ? `Balance ${kes(r.after)}` : "Card payment"}</span>
        </article>
      ))}
    </>
  );
};

export default Billing;