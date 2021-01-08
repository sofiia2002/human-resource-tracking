import React, { useState, useEffect, useContext } from "react";
import { GeneralData } from "../Context";
import axios from "axios";
import moment, { locales } from "moment";
import localization from "moment/locale/pl";
import "../styles/Events.css";

moment.updateLocale("pl", localization);

function Participants() {
  const { userData } = useContext(GeneralData);
  const [selectedDomKultury, setSelectedDomKultury] = useState(1);
  const [domyKultury, setDomyKultury] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [allInfo, setAllInfo] = useState({});

  const serveParticipants = async ({ stanowisko }) => {
    let res = {
      wystawa: [],
      warsztat: [],
    };
    const { data: wydarzeniaR } = await axios("/api/wydarzenia");
    const { data: wystawyR } = await axios("/api/wystawy");
    const { data: warsztatyR } = await axios("/api/warsztaty");
    const all = [...wystawyR, ...warsztatyR];

    await Promise.all(
      wydarzeniaR.map(async (event) => {
        let match = all.find((element) => element.id == event.id);
        const { data: uczestnicyLista } = await axios(
          `/api/uczestnicy?wydarzenie=${event.id}`
        );
        let final = { ...event, ...match, uczestnicyLista };
        res[event.typ].push(final);
      })
    );
    return res;
  };

  useEffect(() => {
    async function fetchData() {
      const result = await axios("/api/domy_kultury/");
      setDomyKultury(result.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function serve() {
      const info = await serveParticipants(userData);
      setAllInfo(info);
      setDataLoaded(true);
    }
    if (dataLoaded == false) {
      serve();
    }
  }, [dataLoaded]);

  return (
    <div className="box">
      <div className="wrapper">
        <h2>Uczestnicy wydarzen:</h2>
        <div className="wydarzenia">
          {dataLoaded
            ? Object.entries(allInfo).map(([key, events], i) => (
                <div className="event_group" key={i}>
                  <h4>{`Rodzaj: ${key}`} </h4>
                  <ul>
                    {events.map((event, i) => {
                      {
                        console.log(event.temat);
                      }
                      return <Wydarzanie_card event={event} />;
                    })}
                  </ul>
                </div>
              ))
            : "chwilka"}
        </div>
      </div>
    </div>
  );
}

function Uczestnik({ uczestnik }) {
  return (
    <div className="participant">
      <p>
        {uczestnik ? uczestnik.imie : ""}
        {uczestnik ? ` ${uczestnik.nazwisko}` : ""}
      </p>
      <p>{uczestnik ? "Tel: " + uczestnik.telefon : ""}</p>
      <p>{uczestnik ? "Email: " + uczestnik.email : ""}</p>
    </div>
  );
}

function Wydarzanie_card({ event }) {
  const [open, setOpen] = useState(false);
  let data = moment(event.data).local("pl").format("LL");
  let godzina = moment(event.data).local("pl").format("LTS");
  const [haveP, setHaveP] = useState(event.uczestnicyLista.length !== 0);
  return (
    <div className="event">
      {console.log()}
      <div className="basic_info">
        <div className="info">
          <h3>{event ? event.temat : ""}</h3>
          <p>
            {event.imie_wystawiajacego
              ? `${event.imie_wystawiajacego} ${event.nazwisko_wystawiajacego}`
              : `${event.imie_wykladowcy} ${event.nazwisko_wykladowcy}`}
          </p>
          <p className="sala">{`Numer sali: ${event.numer_sali}`}</p>
        </div>

        <div className="date">
          <p>{data}</p>
          <p>{godzina}</p>
          <button className="classic_button_style">Zmień dane</button>
        </div>
      </div>

      <div className="participant_group">
        {open
          ? haveP
            ? event.uczestnicyLista.map((element) => {
                console.log(element);
                return <Uczestnik uczestnik={element} />;
              })
            : "nie jeszcze ma uczestników"
          : ""}
      </div>
      {open ? (
        <i className="las la-angle-up" onClick={() => setOpen(false)}></i>
      ) : (
        <i className="las la-angle-down" onClick={() => setOpen(true)}></i>
      )}
    </div>
  );
}

export default Participants;
