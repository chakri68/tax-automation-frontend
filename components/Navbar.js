import { Header, Image } from "semantic-ui-react";

function Navbar() {
  return (
    <nav className="nav">
      <div></div>
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
  );
}

export default Navbar;
