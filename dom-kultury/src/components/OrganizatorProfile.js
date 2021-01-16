import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GeneralData } from "../Context";
import moment from "moment";
import ChangePopup from "../helpers/ChangePopup";
import "../styles/MyProfile.css";

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

export default OrganizatorProfile;
