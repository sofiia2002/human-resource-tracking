import React, { useState, useEffect, useContext } from "react";
//import { GeneralData } from "../Context";
import axios from "axios";
import "../styles/Events.css";
import moment from "moment";
import ChangePopup from "../helpers/ChangePopup";
import { Refetch } from "../Context";

function Employees() {
  //const { userData } = useContext(GeneralData);
  const [selectedDomKultury, setSelectedDomKultury] = useState(1);
  const [domyKultury, setDomyKultury] = useState([]);
  const [pracownicy, setPracownicy] = useState([]);
  const { refetch, setRefetch } = useContext(Refetch);

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
    console.log("refetch");
  }, [selectedDomKultury, refetch]);

  const serveWorkerList = (workersList, workerPosition) => {
    let workers = workersList.filter((worker) => {
      return worker.stanowisko === workerPosition;
    });
    return workers.map((element, index) => {
      return <Pracownik pracownik={element} key={index} index={index} />;
    });
  };

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
              <option key={index} value={element.id}>
                Dom Kultury numer {element.id}
              </option>
            ))}
          </select>
          <DomKultury domKultury={domyKultury[selectedDomKultury - 1]} />
        </div>
        <div className="container-right">
          <h2>Pracownicy w domie Kultury numer {selectedDomKultury}:</h2>
          {/* <button className="classic_button_style">Dodaj Pracownika</button> */}
          <div className="workers_group">
            {pracownicy.length !== 0 ? (
              <>
                <div className="workers_wrapper">
                  <h3>Developerzy:</h3>
                  <div className="participant_group">
                    {serveWorkerList(pracownicy, "Developer")}
                  </div>
                </div>
                <div className="workers_wrapper">
                  <h3>Organizatorzy:</h3>
                  {serveWorkerList(pracownicy, "Organizator")}
                </div>
                <div className="workers_wrapper">
                  <h3>Developerzy:</h3>
                  {serveWorkerList(pracownicy, "Administrator")}
                </div>
              </>
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

export default Employees;
