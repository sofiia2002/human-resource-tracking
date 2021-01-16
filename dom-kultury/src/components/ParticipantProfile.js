import React, { useContext, useState, useEffect } from "react";
import { GeneralData } from "../Context";
import { Refetch } from "../Context";
import ChangePopup from "../helpers/ChangePopup";
import "../styles/MyProfile.css";
import Loader from "react-loader-spinner";
import axios from "axios";
import moment from "moment";

function ParticipantProfile() {
  const { userData } = useContext(GeneralData);
  const { refetch, setRefetch } = useContext(Refetch);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [allInfo, setAllInfo] = useState({});

  useEffect(() => {
    console.log(allInfo);
  }, [allInfo]);

  useEffect(() => {
    async function serve() {
      const servePart = await serveParticipants();
      Promise.all([servePart]).then(() => setDataLoaded(true));
    }
    serve();
    console.log("fetching for new data");
  }, [refetch]);

  const serveParticipants = async () => {
    let res = {
      wystawa: [],
      warsztat: [],
    };
    const wystawy = await axios("/api/wystawy?id_uczestnika=" + userData.id);
    const warsztaty = await axios(
      "/api/warsztaty?id_uczestnika=" + userData.id
    );
    Promise.all([wystawy, warsztaty])
      .then(() => {
        res.wystawa = [...wystawy.data];
        res.warsztat = [...warsztaty.data];
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
        <div className="personal-data" style={{'width': '700px', 'margin-bottom': '5rem'}}>
            <h3>Twoje dane:</h3>
            <Uczestnik uczestnik={userData} />
        </div>
        <div className="event-data-participant">
          <h3>Jesteś zapisany na wydarzenia:</h3>
          <div className="wydarzenia" style={{'width': '700px'}}>
            {dataLoaded && allInfo ? (
              Object.keys(allInfo).map((key) => (
                <div className="event_group" key={key}>
                  <h4>{`Rodzaj: ${key}`} </h4>
                  <ul>
                    {allInfo[key].length!==0 ? 
                    allInfo[key].map((event, i) => {
                      return (
                        <WydarzanieCard
                          event={event}
                          key={event.id}
                          userData={userData}
                        />
                      );
                    }) : 
                    <p>Nie jesteś zapisany na żadne wydarzenie tego rodzaju</p>}
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

function WydarzanieCard({ event }) {
  let data = moment.utc(event.data).local("pl").format("LL");
  let godzina = moment.utc(event.data).format("LTS");

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
        </div>
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
