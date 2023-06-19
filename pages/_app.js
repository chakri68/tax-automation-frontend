import "semantic-ui-css/semantic.min.css";
import AppProvider from "../contexts/appContext";
import AuthProvider from "../contexts/authContext";
import ErrorProvider from "../contexts/errorContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppProvider>
        <ErrorProvider>
          <Component {...pageProps} />
        </ErrorProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default MyApp;
