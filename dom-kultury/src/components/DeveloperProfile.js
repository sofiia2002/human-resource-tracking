import React, { useContext } from "react";
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
          <h5>Zmiana danych / utworzenie pracownika</h5>
        </div>
        <div className="change-event">
          <h5>Zmiana danych / utworzenie wydarzenia</h5>
        </div>
      </div>
    </div>
  );
}

export default DeveloperProfile;
