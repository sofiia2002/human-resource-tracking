import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Events.css";

function Events() {
  const [selectedDomKultury, setSelectedDomKultury] = useState(1);
  const [domyKultury, setDomyKultury] = useState([]);
  const [wydarzenia, setWydarzenia] = useState([]);

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
        "/api/wydarzenia?dom_kultury=" + selectedDomKultury
      );
      setWydarzenia(result.data);
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
          <h2>Wydarzenia w domie Kultury numer {selectedDomKultury}:</h2>
          <div className="wydarzenia">
            {wydarzenia.length !== 0 ? (
              wydarzenia.map((element, index) => (
                <Wydarzenie key={index} index={index} wydarzenie={element} />
              ))
            ) : (
              <h4>Niestety nie znalezlismy zadnych wydarzen</h4>
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
      <h5>
        {domKultury
          ? "Opens: " + domKultury.opens.slice(11, 16)
          : ""}
      </h5>
      <h5>
        {domKultury
          ? "Closes: " +
            domKultury.closes.slice(11, 16)
          : ""}
      </h5>
    </div>
  );
}

function Wydarzenie({ wydarzenie }) {
  return (
    <div className="wydarzenie">
      <h5>{wydarzenie ? "Typ: " + wydarzenie.typ : ""}</h5>
      <h5>{wydarzenie ? "Data: " + wydarzenie.data.slice(0, 10) : ""}</h5>
      <h5>
        {wydarzenie
          ? "Od: " + wydarzenie.data.slice(11, 16)
          : ""}
      </h5>
      <h5>
        {wydarzenie
          ? "Do: " + (parseInt(wydarzenie.data.slice(11, 13))+wydarzenie.czas_trwania).toString()+wydarzenie.data.slice(13, 16)
          : ""}
      </h5>
      <h5>{wydarzenie ? "Sala: " + wydarzenie.numer_sali : ""}</h5>
    </div>
  );
}

export default Events;
