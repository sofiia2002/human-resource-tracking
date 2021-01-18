import React, { useState, useEffect, useContext } from "react";
import { GeneralData } from "../Context";
import axios from "axios";
import moment from "moment";
import "../styles/Events.css";
import "../styles/Exhibitions.css";

function Lessons() {
  const { userData } = useContext(GeneralData);
  const [selectedDomKultury, setSelectedDomKultury] = useState(1);
  const [domyKultury, setDomyKultury] = useState([]);
  const [warsztaty, setWarsztaty] = useState([]);
  const [isWarsztatyChanged, setWarsztatyChanged] = useState(false);
  const [warsztatyOfParticipant, setWarsztatyOfParticipant] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await axios("/api/domy_kultury/");
      setDomyKultury(result.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if ((userData.stanowisko === "Uczestnik") && (isWarsztatyChanged)) {
      async function fetchData() {
        const result = await axios("/api/wydarzenia_uczestnika/" + userData.id);
        setWarsztatyOfParticipant(result.data);
        console.log(result.data);
      }
      fetchData();
      setWarsztatyChanged(false);
    }
  }, [isWarsztatyChanged]);

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
      Promise.all([resultWarsztaty]).then(()=>{
        let newResultWarsztaty = resultWarsztaty.data.filter(
          (wystawa) => resultWydarzenia.indexOf(wystawa.id) !== -1
        );
        console.log(newResultWarsztaty);
        newResultWarsztaty.forEach((obj) => {
          if (result.map((o) => o.id ).indexOf(obj.id)===-1) result.push(obj);
        });
        setWarsztaty(result);
      })
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
                <Warsztat
                  uczestnik={userData.stanowisko === "Uczestnik"}
                  id={userData.id}
                  key={index}
                  index={index}
                  setWarsztatyChanged={setWarsztatyChanged}
                  warsztatyOfParticipant={warsztatyOfParticipant}
                  warsztat={element}
                />
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

function Warsztat({
  warsztat,
  uczestnik,
  id,
  warsztatyOfParticipant,
  setWarsztatyChanged,
}) {
  let data = moment.utc(warsztat.data).local("pl").format("LL");
  let godzina = moment.utc(warsztat.data).format("HH:mm");

  const sign = async () => {
    console.log("sign");
    const url = "/api/wydarzenia_uczestnika";
    const params = {
      id_uczestnika: parseInt(id),
      id_wydarzenia: parseInt(warsztat.id),
    };
    console.log(params);
    await axios.post(url, params);
    setWarsztatyChanged(true);
  };

  const unsign = async () => {
    console.log("unsign");
    const url = "/api/wydarzenia_uczestnika";
    const params = {
      id_uczestnika: id,
      id_wydarzenia: warsztat.id,
    };
    console.log(params);
    await axios.delete(url, { data: Object.assign({}, params), headers: {"Content-Type": "application/json"} });
    setWarsztatyChanged(true);
  };

  return (
    <div className="wystawa">
      <div>
        <h2>{warsztat ? warsztat.temat : ""}</h2>
        {uczestnik ? (
          warsztatyOfParticipant.findIndex((wys) => wys.id === warsztat.id) ===
          -1 ? (
            <div className="buttons-wystawa">
              <button
                className="popup_submit classic_button_style"
                onClick={sign}
              >
                Zapisz się
              </button>
            </div>
          ) : (
            <div className="buttons-wystawa">
              <button
                className="popup_submit classic_button_style red"
                onClick={unsign}
              >
                Wypisz się
              </button>
            </div>
          )
        ) : (
          <></>
        )}
      </div>
      <div>
        <h5>
          {warsztat
            ? "Wykladowca: " +
              warsztat.imie_wykladowcy +
              " " +
              warsztat.nazwisko_wykladowcy
            : ""}
        </h5>
        <p className="sala">{`Numer sali: ${warsztat.numer_sali}`}</p>
        <div className="date">
          <p>{data ? data : ""}</p>
          <p>{godzina ? godzina+" - "+((parseInt(godzina.toString().substring(0,2))+warsztat.czas_trwania)>23 ? (parseInt(godzina.toString().substring(0,2))+warsztat.czas_trwania) - 24 : (parseInt(godzina.toString().substring(0,2))+warsztat.czas_trwania) )+godzina.toString().substring(2,5) : ""}</p>
        </div>
      </div>
    </div>
  );
}

export default Lessons;
