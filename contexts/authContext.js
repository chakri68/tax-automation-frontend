import React, { useEffect, useState } from "react";

export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({ token: "" });

  let [initLoad, setInitLoad] = useState(true);

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      setAuthState({ token });
    }
    setInitLoad(false);
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
        initLoad,
        setAuthToken: (token) => setUserAuthInfo(token),
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
