import React, { useState, useEffect, useContext } from "react";
import { GeneralData } from "../Context";
import axios from "axios";
import moment from "moment";
import "../styles/Events.css";
import "../styles/Exhibitions.css";

function Exhibitions() {
  const { userData } = useContext(GeneralData);
  const [selectedDomKultury, setSelectedDomKultury] = useState(1);
  const [domyKultury, setDomyKultury] = useState([]);
  const [wystawy, setWystawy] = useState([]);
  const [isWystawyChanged, setWystawyChanged] = useState(true);
  const [wystawyOfParticipant, setWystawyOfParticipant] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await axios("/api/domy_kultury/");
      setDomyKultury(result.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if ((userData.stanowisko === "Uczestnik")&&(isWystawyChanged)) {
      async function fetchData() {
        const result = await axios("/api/wydarzenia_uczestnika/" + userData.id);
        setWystawyOfParticipant(result.data);
      }
      fetchData();
      setWystawyChanged(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWystawyChanged]);

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
      Promise.all([resultWystawy]).then(()=>{
        let newResultWystawy = resultWystawy.data.filter(
          (wystawa) => resultWydarzenia.indexOf(wystawa.id) !== -1
        );
        //console.log(newResultWystawy);
        newResultWystawy.forEach((obj) => {
          if (result.map((o) => o.id ).indexOf(obj.id)===-1) result.push(obj);
        });
        setWystawy(result);
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
              <option key={index} value={element.id}>Dom Kultury numer {element.id}</option>
            ))}
          </select>
          <DomKultury domKultury={domyKultury[selectedDomKultury - 1]} />
        </div>
        <div className="container-right">
          <h2>Wystawy w domie Kultury numer {selectedDomKultury}:</h2>
          <div className="wystawy">
            {wystawy.length !== 0 ? (
              wystawy.map((element, index) => (
                <Wystawa
                  uczestnik={userData.stanowisko === "Uczestnik"}
                  id = {userData.id}
                  index={index}
                  key={index}
                  wystawa={element}
                  setWystawyChanged={setWystawyChanged}
                  wystawyOfParticipant = {wystawyOfParticipant}
                />
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

function Wystawa({ wystawa, uczestnik, id, wystawyOfParticipant, setWystawyChanged, index}) {
  const [open, setOpen] = useState(false);
  let data = moment.utc(wystawa.data).local("pl").format("LL");
  let godzina = moment.utc(wystawa.data).format("HH:mm");

  const sign = async () => {
    const url = "/api/wydarzenia_uczestnika"
    const params = { 
      id_uczestnika: parseInt(id), 
      id_wydarzenia: parseInt(wystawa.id)
    };
    try {
      await axios.post(url, params);
      setWystawyChanged(true);
    } catch (error) {
      console.log(error);
    }
  }

  const unsign = async () => {
    const url = "/api/wydarzenia_uczestnika"
    const params = { 
      id_uczestnika: parseInt(id), 
      id_wydarzenia: parseInt(wystawa.id)
    };
    try {
      await axios.delete(url, { data: Object.assign({}, params), headers: {"Content-Type": "application/json"} });
      setWystawyChanged(true);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="wystawa" key={index}>
      <div>
        <h2>{wystawa ? wystawa.temat : ""}</h2>
        {uczestnik ? 
          ((wystawyOfParticipant.findIndex(wys => wys.id === wystawa.id))===-1) ?
          <div className="buttons-wystawa">
            <button
              className="popup_submit classic_button_style"
              onClick={sign}
            >
              Zapisz się
            </button>
          </div>
            :
            <div className="buttons-wystawa">
            <button
              className="popup_submit classic_button_style red"
              onClick={unsign}
            >
              Wypisz się
            </button>
            </div>
        : (
          <></>
        )}
      </div>
      <div>
        <h5>Wystawa {wystawa ? wystawa.typ_wystawy : ""}</h5>
        <h5>
          {wystawa
            ? wystawa.imie_wystawiajacego +
              " " +
              wystawa.nazwisko_wystawiajacego
            : ""}
        </h5>
        <p className="sala">{`Numer sali: ${wystawa.numer_sali}`}</p>
        <div className="date">
          <p>{data}</p>
          <p>{godzina+" - "+((parseInt(godzina.toString().substring(0,2))+wystawa.czas_trwania)>23 ? (parseInt(godzina.toString().substring(0,2))+wystawa.czas_trwania) - 24 : (parseInt(godzina.toString().substring(0,2))+wystawa.czas_trwania) )+godzina.toString().substring(2,5)}</p>
        </div>
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
