import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => Cookies.get("userId") || null);
  const [token, setToken] = useState(() => Cookies.get("token") || null);

  useEffect(() => {
    if (userId) {
      Cookies.set("userId", userId, { expires: 7 }); // expires in 7 days
    } else {
      Cookies.remove("userId");
    }
  }, [userId]);

  useEffect(() => {
    if (token) {
      Cookies.set("token", token, { expires: 7 }); // expires in 7 days
    } else {
      Cookies.remove("token");
    }
  }, [token]);

  const logout = () => {
    setUserId(null);
    setToken(null);
  };

  return (
    <UserContext.Provider value={{ userId, token, setUserId, setToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
