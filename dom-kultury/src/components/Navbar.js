import React, { useState, useEffect, useContext } from "react";
import { GeneralData } from "../Context";
import { Link, Router, useHistory } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const { setUserData, userData } = useContext(GeneralData);
  const history = useHistory();
  const logout = () => {
    setUserData({
      isLoggedIn: false,
      userType: null,
      name: null,
    });
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
        <Link to="/events">Wydarzenia</Link>
        <Link to="/exhibitions">Wystawy</Link>
        <Link to="/lessons">Warsztaty</Link>
        {userData.userType === "developer" ||
        userData.userType === "organizator" ? (
          <Link to="/participants">Uczestnicy</Link>
        ) : (
          ""
        )}
        {userData.userType === "developer" ? (
          <Link to="/employees">Pracownicy</Link>
        ) : (
          ""
        )}
        {userData.userType && userData.userType !== "guest" ? (
          <Link to="/myprofile">Moj profil</Link>
        ) : (
          ""
        )}
      </div>
      <div className="user">
        {!userData.isLoggedIn ? (
          <Link className="login-as" to="/login">
            Zaloguj się
          </Link>
        ) : (
          ""
        )}

        {userData.name ? (
          <span className="login-name" onClick={() => history.push("/")}>
            Witaj, {userData.name}!
          </span>
        ) : (
          ""
        )}
        {userData.isLoggedIn ? (
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
