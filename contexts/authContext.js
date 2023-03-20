import React, { useEffect, useState } from "react";

export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({ token: "" });

  let [initLoad, setInitLoad] = useState(true);

  async function checkLoginStatus(token) {
    let res = await fetch("/api/verify", {
      method: "POST",
      body: JSON.stringify({
        token: token,
      }),
    });
    let data = await res.json();
    return data.success && data.data.verified;
  }

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      checkLoginStatus(token).then((verified) => {
        if (verified) setAuthState({ token });
        else {
          localStorage.removeItem("token");
        }
        setInitLoad(false);
      });
    } else {
      setInitLoad(false);
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
        initLoad,
        setAuthToken: (token) => setUserAuthInfo(token),
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
