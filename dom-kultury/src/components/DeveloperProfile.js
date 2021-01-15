import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { GeneralData } from "../Context";

function DeveloperProfile() {
  const { userData, setUserData } = useContext(GeneralData);

  return (
    <div className="wrapper">
      <div className="header">
        <h1>Zalogowany jako: {userData.stanowisko}</h1>
      </div>
      <div className="dashboard">
        <h3>Panel sterowania:</h3>
        <div className="change-worker">
          <Link to="/employees">
            <h5>Zmiana danych pracownika</h5>
          </Link>
        </div>
        <div className="change-event">
          <Link to="/participants">
            <h5>Zmiana danych / utworzenie wydarzenia</h5>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DeveloperProfile;
