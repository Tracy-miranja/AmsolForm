import React, { createContext, useContext, useState, useEffect } from "react";
// Helper to read and clear old cookies
function migrateOldCookieToken() {
  const cookies = document.cookie.split(";").reduce((acc, c) => {
    const [k, v] = c.trim().split("=");
    acc[k] = v;
    return acc;
  }, {});

  const cookieToken = cookies["token"] || cookies["accessToken"] || null;

  if (cookieToken) {
    // Migrate to localStorage
    localStorage.setItem("accessToken", cookieToken);
    // Clear old cookies
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    return cookieToken;
  }

  return null;
}

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserIdState] = useState(
    () => localStorage.getItem("userId") || null
  );
 const [token, setTokenState] = useState(() => {
  const lsToken = localStorage.getItem("accessToken");
  if (lsToken) return lsToken;
  return migrateOldCookieToken(); 
});

  const setUserId = (id) => {
    setUserIdState(id);
    if (id) localStorage.setItem("userId", id);
    else localStorage.removeItem("userId");
  };

  const setToken = (t) => {
    setTokenState(t);
    if (t) localStorage.setItem("accessToken", t);
    else localStorage.removeItem("accessToken");
  };

  const logout = () => {
  setUserIdState(null);
  setTokenState(null);
  localStorage.removeItem("userId");
  localStorage.removeItem("accessToken");
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

  return (
    <UserContext.Provider value={{ userId, token, setUserId, setToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);