import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";
import AuthProvider from "../contexts/authContext";
import AppProvider from "../contexts/appContext";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </AuthProvider>
  );
}

export default MyApp;
