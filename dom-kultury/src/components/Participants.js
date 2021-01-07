import React, { useState, useEffect, useContext } from "react";
import { GeneralData } from "../Context";
import axios from "axios";
import "../styles/Events.css";

function Participants() {
  const { userData } = useContext(GeneralData);
  const [selectedDomKultury, setSelectedDomKultury] = useState(1);
  const [domyKultury, setDomyKultury] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [uczestnicy, setUczestnicy] = useState([]);
  const [wydarzenia, setWydarzenia] = useState([]);
  const [warsztaty, setWarsztaty] = useState([]);
  const [wystawy, setWystawy] = useState([]);
  const [allInfo, setAllInfo] = useState({});

  const addParticipants = async (event, res) => {
    const { data: wystawyR } = await axios("/api/wystawy");
    const { data: warsztatyR } = await axios("/api/warsztaty");
    const all = [...wystawyR, ...warsztatyR];
    //console.log(all);
    let match = all.find((element) => element.id == event.id);
    const { data: uczestnicyLista } = await axios(
      `/api/uczestnicy?wydarzenie=${event.id}`
    );
    let final = { ...event, ...match, uczestnicyLista };
    return final;
  };

  const serveParticipants = async ({ stanowisko }) => {
    let res = {
      wystawa: [],
      warsztat: [],
    };
    const { data: wydarzeniaR } = await axios("/api/wydarzenia");

    wydarzeniaR.forEach(async (wydarzenie) => {
      let event = await addParticipants(wydarzenie, res);
      res[event.typ].push(event);
    });
    return res;
    // setAllInfo(res);
    // console.log(allInfo);
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
      let info = await serveParticipants(userData);
      console.log(info);
      setAllInfo(info);
      console.log(allInfo);
      setDataLoaded(true);
    }
    serve();
  }, [dataLoaded]);
  useEffect(() => {
    async function fetchData() {
      const result = await axios("/api/uczestnicy");
      setUczestnicy(result.data);
    }
    fetchData();
  }, [selectedDomKultury]);

  return (
    <div className="box">
      <div className="container">
        <h2>Uczestnicy wydarzen:</h2>
        <div className="wydarzenia">
          {/* {dataLoaded
            ? allInfo.warsztaty.map((element) => {
                return <div>{element.id}</div>;
              })
            : ""} */}
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
      <h5>{uczestnik ? "Email: " + uczestnik.email : ""}</h5>
    </div>
  );
}
{
  /* <Uczestnik key={index} index={index} uczestnik={element} /> */
}

// function Wydarzanie_card({ wydarzenie }) {
//   const [open, setOpen] = useState(false);
//   return (
//     <div className="wystawa">
//       <h2>{wystawa ? wystawa.temat : ""}</h2>

//       {open ? (
//         <div>
//           <h5>Opis:</h5>
//           <p>{wystawa.opis}</p>
//         </div>
//       ) : (
//         ""
//       )}
//       {open ? (
//         <i className="las la-angle-up" onClick={() => setOpen(false)}></i>
//       ) : (
//         <i className="las la-angle-down" onClick={() => setOpen(true)}></i>
//       )}
//     </div>
//   );
// }

export default Participants;
