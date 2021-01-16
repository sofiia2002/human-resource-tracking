import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GeneralData } from "../Context";
import ChangePopup from "../helpers/ChangePopup";
import moment from "moment";
import "../styles/MyProfile.css";

function DeveloperProfile() {
  const { userData, setUserData } = useContext(GeneralData);

  return (
    <div className="wrapper">
      <div className="header">
        <h1>Zalogowany jako: {userData.stanowisko}</h1>
      </div>
      <div className="dashboard-wrapper">
        <div className="personal-data">
          <h3>Twoje dane:</h3>
          <Pracownik pracownik={userData} />
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
    </div>
  );
}

function Pracownik({ pracownik }) {
  const dataUr = moment.utc(pracownik.data_urodzenia).format("L");
  const [tooglePopup, setTooglePopup] = useState(false);
  return (
    <div className="worker">
      <p>
        {pracownik ? pracownik.imie : ""}
        {pracownik ? " " + pracownik.nazwisko : ""}
      </p>
      <p>
        {pracownik
          ? "Plec: " + (pracownik.plec === "K" ? "Kobieta" : "Mężczyzna")
          : ""}
      </p>
      <p>{pracownik ? "Data ur.: " + dataUr : ""}</p>
      <p>{pracownik ? "Pesel: " + pracownik.pesel : "Nima"}</p>
      <p>{pracownik ? "Telefon: " + pracownik.telefon : ""}</p>
      <p>{pracownik ? "Pensja: " + pracownik.pensja : ""}</p>
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
          typ="pracownik"
          data={pracownik}
          popupHandler={() => setTooglePopup(false)}
          url={`/api/pracownicy?id=${pracownik.id}`}
        />
      )}
    </div>
  );
}

export default DeveloperProfile;
