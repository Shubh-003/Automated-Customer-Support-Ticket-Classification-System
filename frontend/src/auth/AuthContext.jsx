/*
File: AuthContext.jsx

Purpose:
Global authentication state for the entire frontend.

Responsibilities:
- Store JWT token
- Decode role from token
- Provide login/logout functions
- Allow any component to access auth state
*/

import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // store JWT token
  const [token, setToken] = useState(
    localStorage.getItem("accessToken")
  );

  // store user role extracted from JWT
  const [role, setRole] = useState(
    token ? jwtDecode(token).role : null
  );

  const login = (accessToken) => {

    // save token
    localStorage.setItem("accessToken", accessToken);

    // decode token
    const decoded = jwtDecode(accessToken);

    console.log("Decoded token:", decoded);
    setToken(accessToken);
    setRole(decoded.role);
    console.log("Decoded token:", decoded);
  };

  const logout = () => {

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, role, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);