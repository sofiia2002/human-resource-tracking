import React, { useContext } from "react";
import { GeneralData } from "../Context";
import { Link, useHistory } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const { setUserData, userData } = useContext(GeneralData);
  const history = useHistory();
  const logout = () => {
    setUserData({});
  };

  return (
    <div className="nav">
      <Link to="/" className="logo">
        <i className="las la-university"></i>
        <div className="logo-text">
          <span>Warszwskie</span>
          <span>Domy</span>
          <span>Kultury</span>
          <span>FLEX</span>
        </div>
      </Link>
      <div className="links">
        <Link to="/">Glowna</Link>
        {/* <Link to="/events">Wydarzenia</Link> */}
        <Link to="/exhibitions">Wystawy</Link>
        <Link to="/lessons">Warsztaty</Link>
        {((userData && userData?.stanowisko === "Developer") ||
          userData?.stanowisko) === "Organizator" ? (
          <Link to="/participants">Uczestnicy</Link>
        ) : (
          ""
        )}
        {userData?.stanowisko === "Developer" ? (
          <Link to="/employees">Pracownicy</Link>
        ) : (
          ""
        )}
        {userData?.stanowisko && userData?.stanowisko !== "guest" ? (
          <Link to="/myprofile">Moj profil</Link>
        ) : (
          ""
        )}
      </div>
      <div className="user">
        {!userData?.imie ? (
          <Link className="login-as" to="/login">
            Zaloguj się
          </Link>
        ) : (
          ""
        )}

        {userData?.imie ? (
          <span className="login-name" onClick={() => history.push("/")}>
            Witaj, {userData.imie}!
          </span>
        ) : (
          ""
        )}
        {userData?.imie ? (
          <Link to="/">
            <span onClick={logout}>Exit</span>
          </Link>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Navbar;
