import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GeneralData } from "../Context";
import ChangePopup from "../helpers/ChangePopup";
import "../styles/MyProfile.css";

function ParticipantProfile() {
  const { userData, setUserData } = useContext(GeneralData);

  return (
    <div className="wrapper">
      <div className="header">
        <h1>Zalogowany jako: {userData.stanowisko}</h1>
      </div>
      <div className="dashboard-wrapper">
        <div className="personal-data">
          <h3>Twoje dane:</h3>
          <Uczestnik uczestnik={userData} />
        </div>
      </div>
    </div>
  );
}

function Uczestnik({ uczestnik }) {
  const [tooglePopup, setTooglePopup] = useState(false);
  return (
    <div className="worker">
      <p>
        {uczestnik ? uczestnik.imie : ""}
        {uczestnik ? " " + uczestnik.nazwisko : ""}
      </p>
      <p>{uczestnik ? "Email: " + uczestnik.email : ""}</p>
      <p>{uczestnik ? "Telefon: " + uczestnik.telefon : ""}</p>
      <button
        className="classic_button_style"
        onClick={() => {
          setTooglePopup(true);
        }}
      >
        Zmień dane
      </button>
      {tooglePopup && (
        <ChangePopup
          typ="uczestnik"
          data={uczestnik}
          popupHandler={() => setTooglePopup(false)}
          url={`/api/uczestnicy?id=${uczestnik.id}`}
        />
      )}
    </div>
  );
}

export default ParticipantProfile;
