import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GeneralData } from "../Context";

function OrganizatorProfile() {
  const { userData, setUserData } = useContext(GeneralData);
  return (
    <div className="wrapper">
      <div className="header">
        <h1>Zalogowany jako: {userData.stanowisko}</h1>
      </div>
    </div>
  );
}

export default OrganizatorProfile;
