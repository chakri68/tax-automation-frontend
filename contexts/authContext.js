import React, { useEffect, useState } from "react";

export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({ token: "" });

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      setAuthState({ token });
    }
  }, []);

  function setUserAuthInfo(token) {
    localStorage.setItem("token", token);
    setAuthState({ token });
  }

  function isAuthenticated() {
    return !!authState.token;
  }

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthToken: (token) => setUserAuthInfo(token),
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
