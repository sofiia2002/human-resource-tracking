import React, { useContext, useState, useEffect } from "react";
import { GeneralData } from "../Context";
import ChangePopup from "../helpers/ChangePopup";
import "../styles/MyProfile.css";
import Loader from "react-loader-spinner";
import axios from "axios";
import moment from "moment";

function ParticipantProfile() {
  const { userData } = useContext(GeneralData);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [eventChanged, setEventChanged] = useState(false);
  const [allInfo, setAllInfo] = useState({});

  useEffect(() => {
    console.log(allInfo);
  }, [allInfo]);

  useEffect(() => {
    async function serve() {
      const servePart = await serveParticipants();
      Promise.all([servePart]).then(() => {
        setDataLoaded(true);
        setEventChanged(false);
      });
    }
    serve();
    console.log("fetching for new data");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventChanged]);

  const serveParticipants = async () => {
    let res = {
      wystawa: [],
      warsztat: [],
    };

    const wystawyIWarsztatyUczestnika = await axios(
      "/api/wydarzenia_uczestnika/" + userData.id
    );
    const wystawy = await axios("/api/wystawy");
    const warsztaty = await axios("/api/warsztaty");
    Promise.all([wystawy, warsztaty])
      .then(() => {
        res.wystawa = [
          ...wystawy.data.filter(
            (wystawa) =>
              wystawyIWarsztatyUczestnika.data
                .filter((w) => w.typ === "wystawa")
                .map((w) => w.id)
                .indexOf(wystawa.id) !== -1
          ),
        ];
        res.warsztat = [
          ...warsztaty.data.filter(
            (warsztat) =>
              wystawyIWarsztatyUczestnika.data
                .filter((w) => w.typ === "warsztat")
                .map((w) => w.id)
                .indexOf(warsztat.id) !== -1
          ),
        ];
        setAllInfo(res);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="wrapper">
      <div className="header">
        <h1>Zalogowany jako: {userData.stanowisko}</h1>
      </div>
      <div className="dashboard">
        <div
          className="personal-data"
          style={{ width: "700px", marginBottom: "5rem" }}
        >
          <h3>Twoje dane:</h3>
          <Uczestnik uczestnik={userData} />
        </div>
        <div className="event-data-participant">
          <h3>Jesteś zapisany na wydarzenia:</h3>
          <div className="wydarzenia" style={{ width: "700px" }}>
            {dataLoaded && allInfo ? (
              Object.keys(allInfo).map((key) => (
                <div className="event_group" key={key}>
                  <h4>{`Rodzaj: ${key}`} </h4>
                  <ul>
                    {allInfo[key].length !== 0 ? (
                      allInfo[key].map((event, i) => {
                        return (
                          <WydarzanieCard
                            event={event}
                            key={event.id}
                            setEventChanged={setEventChanged}
                          />
                        );
                      })
                    ) : (
                      <p>
                        Nie jesteś zapisany na żadne wydarzenie tego rodzaju
                      </p>
                    )}
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
    </div>
  );
}

function WydarzanieCard({ event, setEventChanged }) {
  const { userData } = useContext(GeneralData);
  let data = moment.utc(event.data).local("pl").format("LL");
  let godzina = moment.utc(event.data).format("HH:mm");

  const unsign = async () => {
    console.log("unsign");
    const url = "/api/wydarzenia_uczestnika";
    const params = {
      id_uczestnika: userData.id,
      id_wydarzenia: event.id,
    };
    console.log(params);
    await axios.delete(url, {
      data: Object.assign({}, params),
      headers: { "Content-Type": "application/json" },
    });
    setEventChanged(true);
  };

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
          <p>{godzina+" - "+((parseInt(godzina.toString().substring(0,2))+event.czas_trwania)>23 ? (parseInt(godzina.toString().substring(0,2))+event.czas_trwania) - 24 : (parseInt(godzina.toString().substring(0,2))+event.czas_trwania) )+godzina.toString().substring(2,5)}</p>
        </div>
      </div>
      <div className="buttons-wystawa" style={{'margin': '0 0 0 auto', 'width': '8.5rem'}}>
        <button
          className="popup_submit classic_button_style red"
          onClick={unsign}
        >
          Wypisz się
        </button>
      </div>
    </div>
  );
}

function Uczestnik({ uczestnik }) {
  const [tooglePopup, setTooglePopup] = useState(false);

  return (
    <div className="worker">
      <p>
        {uczestnik ? uczestnik.imie : ""}
        {uczestnik ? " " + uczestnik.nazwisko : ""}
      </p>
      <p>{uczestnik ? "Email: " + uczestnik.email : ""}</p>
      <p>{uczestnik ? "Telefon: " + uczestnik.telefon : ""}</p>
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
          typ="uczestnik"
          data={uczestnik}
          popupHandler={() => setTooglePopup(false)}
          url={`/api/uczestnicy?id=${uczestnik.id}`}
        />
      )}
    </div>
  );
}

export default ParticipantProfile;
