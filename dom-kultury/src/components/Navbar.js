import React, { useContext, useEffect, useState } from "react";
import { GeneralData } from "../Context";
import { Link, useHistory } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const { userData, setUserData } = useContext(GeneralData);
  const [userType, setUserType] = useState(null);
  const [isLoggedOut, setLoggedOut] = useState(false);
  const history = useHistory();
  const logout = () => {
    setUserData({});
    setLoggedOut(true);
  };

    useEffect(()=>{
    if ((userData.stanowisko)||(isLoggedOut)){
      setUserType(userData.stanowisko);
    }
  }, [userData]);

  return (
    <nav className="nav">
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
        <Link to="/">Główna</Link>
        {/* <Link to="/events">Wydarzenia</Link> */}
        <Link to="/exhibitions">Wystawy</Link>
        <Link to="/lessons">Warsztaty</Link>
        {userType === "Developer" ||
        userType === "Organizator" ? (
          <Link to="/participants">Uczestnicy</Link>
        ) : (
          <></>
        )}
        {userType === "Developer" ? (
          <Link to="/employees">Pracownicy</Link>
        ) : (
          <></>
        )}
        {userType? (
          <Link to="/myprofile">Moj profil</Link>
        ) : (
          <></>
        )}
      </div>
      <div className="user">
        {!userData.imie ? (
          <Link className="login-as" to="/login">
            Zaloguj się
          </Link>
        ) : (
          <></>
        )}

        {userData.imie ? (
          <span className="login-name" onClick={() => history.push("/")}>
            Witaj, {userData.imie}!
          </span>
        ) : (
          <></>
        )}
        {userData.imie ? (
          <Link to="/">
            <span onClick={logout}>Exit</span>
          </Link>
        ) : (
          <></>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
