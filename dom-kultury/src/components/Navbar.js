import React, { useState, useEffect, useContext } from "react";
import { GeneralData } from "../Context";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const { setUserData, userData } = useContext(GeneralData);

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
        <Link to="/calendar">Kalendarz</Link>
        <Link to="/events">Wydarzenia</Link>
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
        {userData.userType&&userData.userType!=="guest" ? (
          <Link to="/myprofile">Moj profil</Link>
        ) : (
          ""
        )}
      </div>
      <div className="user">
        {userData.name ? (
          <span className="login-name">Witaj, {userData.name}!</span>
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
