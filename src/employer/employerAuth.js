const KEY = "amsol_session";

export const EMPLOYER_HOME = "/employer/dashboard";

// Where each role lands after login
export const homeFor = (role) =>
  role === "employer" ? EMPLOYER_HOME : role === "nurse" ? "/NurseForm" : "/profile";

// Only non-sensitive display info lives here. The real auth is your token/cookie
// and your backend must still check the role on every employer endpoint.
export const saveSession = ({ role, name }) =>
  localStorage.setItem(KEY, JSON.stringify({ role: role || "", name: name || "" }));

export const getSession = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
};

export const clearSession = () => localStorage.removeItem(KEY);