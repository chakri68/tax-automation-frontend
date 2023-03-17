import { useRouter } from "next/router";
import { useContext } from "react";
import { Header, Image } from "semantic-ui-react";
import { AppContext } from "../contexts/appContext";
import NavButtons from "./NavButtons";

function Navbar() {
  const appContext = useContext(AppContext);
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
        back={() => router.back()}
        home={
          appContext.appData.return_url
            ? () => router.replace(appContext.appData.return_url)
            : () => { }
        }
      />
    </>
  );
}

export default Navbar;
