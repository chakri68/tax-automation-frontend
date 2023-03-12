import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";
import { useState } from "react";
import AppContext from "../contexts/appContext.js";

function MyApp({ Component, pageProps }) {
  let [appData, setAppData] = useState({
    GSTINList: [],
    empDetails: null,
    scode: null,
  });
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
        value={{
          appData,
          updateGSTINList,
          updateEmpDetails,
          update,
        }}
      >
        <Component {...pageProps} />
      </AppContext.Provider>
  );
}

export default MyApp;
