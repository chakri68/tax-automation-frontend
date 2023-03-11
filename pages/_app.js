import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";
import AppProvider from "../contexts/appContext.js";
import { useState } from "react";
import AppContext from "../contexts/appContext.js";

function MyApp({ Component, pageProps }) {
  let [appData, setAppData] = useState({ GSTINList: [], empDetails: null });
  console.log("RERENDER", appData);
  function updateGSTINList(list) {
    console.log("LIST AT _APP", list);
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
      value={{
        appData,
        updates: { updateGSTINList, updateEmpDetails, update },
      }}
    >
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;
