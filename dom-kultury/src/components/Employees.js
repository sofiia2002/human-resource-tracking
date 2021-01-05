import React, { useState, useEffect } from "react";
//import { GeneralData } from "../Context";
import axios from "axios";
import "../styles/Events.css";

function Employees() {
  //const { userData } = useContext(GeneralData);
  const [selectedDomKultury, setSelectedDomKultury] = useState(1);
  const [domyKultury, setDomyKultury] = useState([]);
  const [pracownicy, setPracownicy] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await axios("/api/domy_kultury/");
      setDomyKultury(result.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        "/api/pracownicy?dom_kultury=" + selectedDomKultury
      );
      setPracownicy(result.data);
    }
    fetchData();
  }, [selectedDomKultury]);

  return (
    <div className="box">
      <div className="container">
        <div className="container-left">
          <h2>Wybierz Dom Kultury:</h2>
          <select
            name="domKultury"
            onChange={(event) =>
              setSelectedDomKultury(parseInt(event.target.value))
            }
          >
            {domyKultury.map((element, index) => (
              <option value={element.id}>Dom Kultury numer {element.id}</option>
            ))}
          </select>
          <DomKultury domKultury={domyKultury[selectedDomKultury - 1]} />
        </div>
        <div className="container-right">
          <h2>Pracownicy w domie Kultury numer {selectedDomKultury}:</h2>
          <div className="wydarzenia">
            {pracownicy.length !== 0 ? (
              pracownicy.map((element, index) => (
                <Pracownik key={index} index={index} pracownik={element} />
              ))
            ) : (
              <h4>Niestety nie znalezlismy zadnych pracownikow</h4>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DomKultury({ domKultury }) {
  return (
    <div>
      <h5>{domKultury ? "City: " + domKultury.city : ""}</h5>
      <h5>
        {domKultury
          ? "Street: " + domKultury.street + "/" + domKultury.apartment
          : ""}
      </h5>
      <h5>{domKultury ? "Postal code: " + domKultury.postal_code : ""}</h5>
      <h5>{domKultury ? "Phone: " + domKultury.phone : ""}</h5>
      <h5>{domKultury ? "Opens: " + domKultury.opens.slice(11, 16) : ""}</h5>
      <h5>{domKultury ? "Closes: " + domKultury.closes.slice(11, 16) : ""}</h5>
    </div>
  );
}

function Pracownik({ pracownik }) {
  return (
    <div className="wydarzenie">
      <h5>{pracownik ? "Imie: " + pracownik.imie : ""}</h5>
      <h5>{pracownik ? "Nazwisko: " + pracownik.nazwisko : ""}</h5>
      <h5>
        {pracownik
          ? "Plec: " + (pracownik.plec === "K" ? "Kobieta" : "Mężczyzna")
          : ""}
      </h5>
      <h5>
        {pracownik
          ? "Data urodzenia: " + pracownik.data_urodzenia.slice(0, 10)
          : ""}
      </h5>
      <h5>{pracownik ? "Pesel: " + pracownik.pesel : ""}</h5>
      <h5>{pracownik ? "Telefon: " + pracownik.telefon : ""}</h5>
      <h5>{pracownik ? "Stanowisko: " + pracownik.stanowisko : ""}</h5>
      <h5>{pracownik ? "Pensja: " + pracownik.pensja : ""}</h5>
    </div>
  );
}

export default Employees;
