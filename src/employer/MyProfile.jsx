import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../api/axiosInstance";
import { getSession, saveSession } from "./employerAuth";

const SIZES = ["1–10", "11–50", "51–200", "201–500", "500+"];
const BLANK = { companyName: "", industry: "", companySize: "", website: "", phone: "", country: "", city: "", about: "", billing: { email: "", taxId: "", address: "" } };

const MyProfile = () => {
  const [f, setF] = useState(null);
  const [account, setAccount] = useState({ email: "", hasPassword: false });
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [pwBusy, setPwBusy] = useState(false);

  useEffect(() => {
    api.get("/api/employer/profile").then(({ data }) => {
      setF({ ...BLANK, ...data, billing: { ...BLANK.billing, ...data.billing } });
      setAccount({ email: data.email, hasPassword: data.hasPassword });
    }).catch(() => { setF(BLANK); toast.error("Could not load your profile."); });
  }, []);

  if (!f) return <div className="ed-empty">Loading…</div>;

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const setBill = (k) => (e) => setF((s) => ({ ...s, billing: { ...s.billing, [k]: e.target.value } }));
  const done = [f.companyName, f.industry, f.phone, f.country, f.about, f.billing.email].filter(Boolean).length;
  const pct = Math.round((done / 6) * 100);

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.put("/api/employer/profile", f);
      setF({ ...BLANK, ...data, billing: { ...BLANK.billing, ...data.billing } });
      // Show the company name in the sidebar straight away
      saveSession({ role: "employer", name: data.companyName || getSession()?.name || data.username });
      window.dispatchEvent(new Event("employer:session"));
      toast.success("Profile saved.");
    } catch (e) { toast.error(e.response?.data?.message || "Could not save your profile."); }
    finally { setSaving(false); }
  };

  const changePassword = async () => {
    setPwBusy(true);
    try {
      await api.post("/api/employer/profile/password", pw);
      setPw({ currentPassword: "", newPassword: "" });
      toast.success("Password updated.");
    } catch (e) { toast.error(e.response?.data?.message || "Could not change the password."); }
    finally { setPwBusy(false); }
  };

  return (
    <>
      <div className="ep-head">
        <div><h2>My profile</h2><p>Your company details are shown to candidates, and your billing details are used for payments and receipts.</p></div>
        <button className="ep-btn amber" disabled={saving} onClick={save}>{saving ? "Saving…" : "Save changes"}</button>
      </div>

      <div className="ep-card">
        <div className="ep-split"><b>Profile completeness</b><b>{pct}%</b></div>
        <div className="ep-bar" style={{ marginTop: 8 }}><i style={{ width: `${pct}%` }} /></div>
      </div>

      <div className="ep-card">
        <h4 className="ep-h4 first">Company</h4>
        <div className="ep-grid2">
          <label className="ep-field">Company name<input className="ep-in" value={f.companyName} onChange={set("companyName")} /></label>
          <label className="ep-field">Industry<input className="ep-in" value={f.industry} onChange={set("industry")} placeholder="e.g. Healthcare" /></label>
          <label className="ep-field">Company size
            <select className="ep-in" value={f.companySize} onChange={set("companySize")}><option value="">Select</option>{SIZES.map((s) => <option key={s}>{s}</option>)}</select>
          </label>
          <label className="ep-field">Website<input className="ep-in" value={f.website} onChange={set("website")} placeholder="https://" /></label>
          <label className="ep-field">Phone<input className="ep-in" value={f.phone} onChange={set("phone")} /></label>
          <label className="ep-field">Country<input className="ep-in" value={f.country} onChange={set("country")} /></label>
          <label className="ep-field">City<input className="ep-in" value={f.city} onChange={set("city")} /></label>
        </div>
        <label className="ep-field" style={{ marginTop: 14 }}>About the company
          <textarea className="ep-in" rows={4} value={f.about} onChange={set("about")} placeholder="What does your company do? What is it like to work there?" />
        </label>
      </div>

      <div className="ep-card">
        <h4 className="ep-h4 first">Billing details</h4>
        <div className="ep-grid2">
          <label className="ep-field">Billing email<input className="ep-in" type="email" value={f.billing.email} onChange={setBill("email")} placeholder="accounts@company.com" /></label>
          <label className="ep-field">Tax ID (KRA PIN / TIN / VAT)<input className="ep-in" value={f.billing.taxId} onChange={setBill("taxId")} /></label>
        </div>
        <label className="ep-field" style={{ marginTop: 14 }}>Billing address<input className="ep-in" value={f.billing.address} onChange={setBill("address")} /></label>
      </div>

      <div className="ep-card">
        <h4 className="ep-h4 first">Account</h4>
        <p className="ep-sub">Signed in as <b>{account.email}</b></p>
        {account.hasPassword ? (
          <div className="ep-grid2" style={{ marginTop: 12 }}>
            <label className="ep-field">Current password<input className="ep-in" type="password" value={pw.currentPassword} onChange={(e) => setPw((s) => ({ ...s, currentPassword: e.target.value }))} autoComplete="current-password" /></label>
            <label className="ep-field">New password<input className="ep-in" type="password" value={pw.newPassword} onChange={(e) => setPw((s) => ({ ...s, newPassword: e.target.value }))} autoComplete="new-password" /></label>
            <div><button className="ep-btn ghost" disabled={pwBusy || !pw.currentPassword || !pw.newPassword} onClick={changePassword}>{pwBusy ? "Updating…" : "Change password"}</button></div>
          </div>
        ) : <p className="ep-sub">This account signs in with Google, so there is no password to manage.</p>}
      </div>
    </>
  );
};

export default MyProfile;