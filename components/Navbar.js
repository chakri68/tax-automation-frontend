import { useRouter } from "next/router";
import { useContext } from "react";
import { Header, Image } from "semantic-ui-react";
import { AppContext } from "../contexts/appContext";
import { AuthContext } from "../contexts/authContext";
import NavButtons from "./NavButtons";

function Navbar() {
  const appContext = useContext(AppContext);
  const authContext = useContext(AuthContext);
  const router = useRouter();
  return (
    <>
      <nav className="nav">
        <div className="nav_container">
          <Image
            src="https://comtax.up.nic.in/GSThome/sites/default/files/logo.png"
            alt="Logo"
          />
          <div className="nav_main">
            <Header as="h1" className="heading">
              Department of Commercial Tax <br />
              <span className="ui header subheading">Uttar-Pradesh</span>
            </Header>
          </div>
          <Image
            src="https://comtax.up.nic.in/GSThome/sites/default/files/upgov.png"
            alt="Govt. of UP"
          />
        </div>
      </nav>
      <NavButtons
        back={router.asPath === "/" ? null : () => router.replace("/")}
        home={
          appContext.appData.return_url
            ? () => router.replace(appContext.appData.return_url)
            : () => {}
        }
        handleEntryFormSubmit={async (formData) => {
          try {
            let res = await fetch("/api/misdata", {
              method: "POST",
              body: JSON.stringify({
                token: authContext.authState.token,
                boweb: formData?.boweb || 0,
                drc: formData?.drc || 0,
                further_action: formData?.further_action || 0,
                gstin_array: formData?.gstin_array || [],
              }),
            });
            let data = await res.json();
            if (!data.success) throw new Error(data?.message);
          } catch (e) {
            throw e;
          }
        }}
      />
    </>
  );
}

export default Navbar;
