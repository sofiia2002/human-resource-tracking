import React, { useState, useEffect, useContext } from "react";
import { GeneralData } from "../Context";
import axios from "axios";
import "../styles/Events.css";

function Employees() {
  const { userData } = useContext(GeneralData);
  const [selectedDomKultury, setSelectedDomKultury] = useState(1);
  const [domyKultury, setDomyKultury] = useState([]);
  const [uczestnicy, setUczestnicy] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await axios("/api/domy_kultury/");
      setDomyKultury(result.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const result = await axios("/api/uczestnicy_wydarzenia");
      setUczestnicy(result.data);
    }
    fetchData();
  }, [selectedDomKultury]);

  return (
    <div className="box">
      <div className="container">
        <h2>Uczestnicy wydarzen:</h2>
        <div className="wydarzenia">
          {uczestnicy.length !== 0 ? (
            uczestnicy.map((element, index) => (
              <Uczestnik key={index} index={index} uczestnik={element} />
            ))
          ) : (
            <h4>Niestety nie znalezlismy zadnych uczestnikow</h4>
          )}
        </div>
      </div>
    </div>
  );
}

function Uczestnik({ uczestnik }) {
  return (
    <div className="wydarzenie">
      <h5>{uczestnik ? "Imie: " + uczestnik.imie : ""}</h5>
      <h5>{uczestnik ? "Nazwisko: " + uczestnik.nazwisko : ""}</h5>
      <h5>{uczestnik ? "Telefon: " + uczestnik.telefon : ""}</h5>
      <h5>{uczestnik ? "Stanowisko: " + uczestnik.email : ""}</h5>
    </div>
  );
}

export default Employees;
