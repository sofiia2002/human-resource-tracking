import React, { useState, useEffect } from "react";
//import { GeneralData } from "../Context";
import axios from "axios";
import "../styles/Events.css";
import "../styles/Exhibitions.css";

function Exhibitions() {
  //const { userData } = useContext(GeneralData);
  const [selectedDomKultury, setSelectedDomKultury] = useState(1);
  const [domyKultury, setDomyKultury] = useState([]);
  const [wystawy, setWystawy] = useState([]);

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
      const resultWystawy = await axios("/api/wystawy");
      result = [
        ...resultWystawy.data.filter(
          (wystawa) => resultWydarzenia.indexOf(wystawa.id) !== -1
        ),
      ];
      setWystawy(result);
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
          <h2>Wystawy w domie Kultury numer {selectedDomKultury}:</h2>
          <div className="wystawy">
            {wystawy.length !== 0 ? (
              wystawy.map((element, index) => (
                <Wystawa key={index} index={index} wystawa={element} />
              ))
            ) : (
              <h4>Niestety nie znalezlismy zadnych wystaw</h4>
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

function Wystawa({ wystawa }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="wystawa">
      <h2>{wystawa ? wystawa.temat : ""}</h2>
      <div>
        <h5>Wystawa {wystawa ? wystawa.typ_wystawy : ""}</h5>
        <h5>
          {wystawa
            ? wystawa.imie_wystawiajacego +
              " " +
              wystawa.nazwisko_wystawiajacego
            : ""}
        </h5>
      </div>
      {open ? (
        <div>
          <h5>Opis:</h5>
          <p>{wystawa.opis}</p>
        </div>
      ) : (
        ""
      )}
      {open ? (
        <i className="las la-angle-up" onClick={() => setOpen(false)}></i>
      ) : (
        <i className="las la-angle-down" onClick={() => setOpen(true)}></i>
      )}
    </div>
  );
}

export default Exhibitions;
