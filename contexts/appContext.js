import React, { useContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { AuthContext } from "./authContext";
export const AppContext = React.createContext();
export default function AppProvider({ children }) {
  let [appData, setAppData] = useState({
    GSTINList: [],
    empDetails: null,
    scode: null,
  });

  let authContext = useContext(AuthContext);

  useEffect(() => {
    if (authContext.authState.token) {
      let { S } = jwt_decode(authContext.authState.token);
      setAppData({ ...appData, scode: S });
    }
  }, [authContext.authState.token]);

  function updateGSTINList(list) {
    setAppData({ ...appData, GSTINList: list });
  }
  function updateEmpDetails(empDetails) {
    setAppData({ ...appData, empDetails: empDetails });
  }
  function update(value) {
    setAppData({ ...appData, ...value });
  }
  return (
    <AppContext.Provider
      value={{ appData, update, updateGSTINList, updateEmpDetails }}
    >
      {children}
    </AppContext.Provider>
  );
}
