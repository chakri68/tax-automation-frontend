import "semantic-ui-css/semantic.min.css";
import AppProvider from "../contexts/appContext";
import AuthProvider from "../contexts/authContext";
import "../styles/globals.css";

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
