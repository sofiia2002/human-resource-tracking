import React, { useState, useEffect, useContext } from "react";
import { GeneralData } from "../Context";
import axios from "axios";
import "../styles/Events.css";
import "../styles/Exhibitions.css";

function Lessons() {
  const { userData } = useContext(GeneralData);
  const [selectedDomKultury, setSelectedDomKultury] = useState(1);
  const [domyKultury, setDomyKultury] = useState([]);
  const [warsztaty, setWarsztaty] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await axios("/api/domy_kultury/");
      setDomyKultury(result.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      let result = [];
      let resultWydarzenia = await axios(
        "/api/wydarzenia?dom_kultury=" + selectedDomKultury
      );
      resultWydarzenia = resultWydarzenia.data.map(
        (wydarzenie) => wydarzenie.id
      );
      const resultWarsztaty = await axios("/api/warsztaty");
      result = [
        ...resultWarsztaty .data.filter(
          (warsztat) => resultWydarzenia.indexOf(warsztat.id) !== -1
        ),
      ];
      setWarsztaty(result);
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
          <h2>Warsztaty w domie Kultury numer {selectedDomKultury}:</h2>
          <div className="wystawy">
            {warsztaty.length !== 0 ? (
                warsztaty.map((element, index) => (
                <Warsztat key={index} index={index} warsztat={element} />
              ))
            ) : (
              <h4>Niestety nie znalezlismy zadnych warsztatow</h4>
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

function Warsztat({ warsztat }) {
  return (
    <div className="wystawa">
      <h2>{warsztat ? warsztat.temat : ""}</h2>
      <div>
        <h5>
          {warsztat
            ? "Wykladowca: " + warsztat.imie_wykladowcy +
              " " +
              warsztat.nazwisko_wykladowcy
            : ""}
        </h5>
      </div>
    </div>
  );
}

export default Lessons;
