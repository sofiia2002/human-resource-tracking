import React, { useState, useEffect, useContext } from "react";
import { GeneralData } from "../Context";
import { Refetch } from "../Context";
import axios from "axios";
import moment from "moment";
import Loader from "react-loader-spinner";
import localization from "moment/locale/pl";
import "../styles/Events.css";
import ChangePopup from "../helpers/ChangePopup";
import AddEvent from "../helpers/AddEvent";

moment.updateLocale("pl", localization);

function Participants() {
  const { userData } = useContext(GeneralData);
  const { refetch, setRefetch } = useContext(Refetch);
  const [selectedDomKultury, setSelectedDomKultury] = useState(1);
  const [domyKultury, setDomyKultury] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [allInfo, setAllInfo] = useState({});
  const [handleAdding, setHandleAdding] = useState(false);

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
    serve();
    console.log("fetching for new data");
  }, [refetch]);

  return (
    <div className="box">
      <div className="wrapper">
        <h2>Uczestnicy wydarzen:</h2>
        <button
          className="classic_button_style"
          onClick={() => setHandleAdding(true)}
        >
          Dodaj wydarzenie
        </button>
        {handleAdding && (
          <AddEvent handleActive={() => setHandleAdding(false)} />
        )}
        <div className="wydarzenia">
          {dataLoaded ? (
            Object.entries(allInfo).map(([key, events], i) => (
              <div className="event_group" key={i}>
                <h4>{`Rodzaj: ${key}`} </h4>
                <ul>
                  {events.map((event, i) => {
                    return <Wydarzanie_card event={event} key={event.id} />;
                  })}
                </ul>
              </div>
            ))
          ) : (
            <div className="loader">
              <Loader type="ThreeDots" color="#2196f3" />
            </div>
          )}
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
const change = (e, setter) => {
  let { name, value } = e.target;
  if (name === "data_urodzenia" || name === "data") {
    setter((prevState) => ({
      ...prevState,
      [name]: moment.utc(value).toISOString(),
    }));
  } else {
    setter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }
};

function Wydarzanie_card({ event }) {
  const serveUrl = () => {
    switch (event.typ) {
      case "wystawa":
        return `/api/wystawy?id=${event.id}`;
      case "warsztat":
        return `/api/warsztaty?id=${event.id}`;
    }
  };
  const [open, setOpen] = useState(false);
  let data = moment.utc(event.data).local("pl").format("LL");
  let godzina = moment.utc(event.data).format("LTS");

  const [haveP, setHaveP] = useState(event.uczestnicyLista.length !== 0);
  const [tooglePopup, setTooglePopup] = useState(false);
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
          <button
            onClick={() => setTooglePopup(true)}
            className="classic_button_style"
          >
            Zmień dane
          </button>
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
      {tooglePopup && (
        <ChangePopup
          data={event}
          popupHandler={() => setTooglePopup(false)}
          url={serveUrl()}
          typ={event.typ}
        />
      )}
    </div>
  );
}

export default Participants;
