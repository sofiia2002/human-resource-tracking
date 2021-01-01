import React, { useState, useEffect, useContext } from "react";
import { GeneralData } from "../Context";
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
    <div class="nav">
      <div className="logo">
        <i class="las la-university"></i>
        <div class="logo-text">
          <span>Warszwskie</span>
          <span>Domy</span>
          <span>Kultury</span>
          <span>FLEX</span>
        </div>
      </div>
      <div className="links">
        <span>Glowna</span>
        <span>Kalendarz</span>
        <span>Wydarzenia</span>
        <span>Moj profil</span>
      </div>
      <div class="user">
        {userData.name ? (
          <span class="login-name">Witaj, {userData.name}!</span>
        ) : (
          ""
        )}
        {userData.isLoggedIn ? <span onClick={logout}>Exit</span> : ""}
      </div>
    </div>
  );
}

export default Navbar;
