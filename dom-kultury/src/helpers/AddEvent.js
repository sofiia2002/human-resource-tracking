import React, { useEffect, useState, useContext } from "react";
import { Refetch } from "../Context";
import axios from "axios";
import moment from "moment";

function AddEvent({ handleActive }) {
  let initWarsztaty = {
    imie_wykladowcy: "",
    nazwisko_wykladowcy: "",
    temat: "",
    email_wykladowcy: "",
    telefon: "",
    data: "",
    czas_trwania: null,
    sala: "",
    id_domu_kultury: null,
    id_sali: null,
  };
  let initWystawy = {
    imie_wystawiajacego: "",
    nazwisko_wystawiajacego: "",
    temat: "",
    typ_wystawy: "",
    data: "",
    czas_trwania: null,
    sala: "",
    id_domu_kultury: null,
    id_sali: null,
    opis: "",
  };
  const { refetch, setRefetch } = useContext(Refetch);
  const [warsztatyInputs, setWarsztatyInputs] = useState(initWarsztaty);
  const [wystawyInputs, setWystawyInputs] = useState(initWystawy);
  const [domyKultury, setDomyKultury] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [eventType, setEventType] = useState(""); 
  const typyWystawy = [
    "malarska",
    "fotograficzna",
    "interaktywna",
    "muzyczna",
    "filmowa"
  ]
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
  useEffect(() => {
    async function fetchData() {
      const res = await axios("/api/sale");
      const resDom = await axios("/api/domy_kultury");
      Promise.all([res, resDom]).then(()=>{
        setDomyKultury(resDom.data);
        setRooms(res.data);
      })
      setRooms(res.data);
    }
    fetchData();
  }, []);
  const infoAboutPosition = (position, arr) => {
    const res = arr.filter((el) => {
      return el.numer_sali === position;
    });
    return res[0];
  };
  const renderInputs = (key, setter) => {
    switch (key) {
      case "sala":
        let sala;
        if (eventType === "warsztat") {
          sala = warsztatyInputs[key];
        } else if (eventType === "wystawa") {
          sala = wystawyInputs[key];
        } 
        return (
          <select
            name={key}
            value={sala}
            onChange={(e) => {
              change(e, setter);

              setter((prevState) => ({
                ...prevState,
                id_sali: infoAboutPosition(e.target.value, rooms).id,
              }));
            }}
          >
            {rooms.map((room, i) => {
              return (
                <option key={i} value={room.numer_sali}>
                  {room.numer_sali}
                </option>
              );
            })}
          </select>
        );
        case "typ_wystawy":
          let typ = wystawyInputs[key] || "malarska";
          return (
            <select
              name={key}
              value={typ}
              onChange={(e) => {
                change(e, setter);
  
                setter((prevState) => ({
                  ...prevState,
                  typ_wystawy: e.target.value,
                }));
              }}
            >
              {typyWystawy.map((typ, i) => {
                return (
                  <option key={i} value={typ}>
                    {typ}
                  </option>
                );
              })}
            </select>
          ); 
      case "id_domu_kultury":
        let dom;
        if (eventType === "warsztat") {
          dom = warsztatyInputs[key] || 1;
        } else if (eventType === "wystawa") {
          dom = wystawyInputs[key] || 1;
        }
        return (
          <select
            name={key}
            value={dom}
            onChange={(e) => {
              change(e, setter);

              setter((prevState) => ({
                ...prevState,
                id_domu_kultury: parseInt(e.target.value) || 1,
              }));
            }}
          >
            {domyKultury.map((dom, i) => {
              return (
                <option key={i} value={dom.id}>
                  {dom.id}
                </option>
              );
            })}
          </select>
        );
      case "data":
        let data;
        if (eventType === "warsztat") {
          data = moment.utc(warsztatyInputs[key]).format("YYYY-MM-DDTHH:mm");
        } else if (eventType === "wystawa") {
          data = moment.utc(wystawyInputs[key]).format("YYYY-MM-DDTHH:mm");
        }
        return (
          <input
            type="datetime-local"
            name={key}
            value={data}
            onChange={(e) => {
              change(e, setter);
              console.log(e.target.value);
            }}
          />
        ); 
      case "czas_trwania":
        return (
          <input type="number" name={key} onChange={(e) => change(e, setter)} />
        );  
      case "opis":
        return (
          <textarea
            name={key}
            cols="10"
            rows="5"
            onChange={(e) => change(e, setter)}
          ></textarea>
        );
      default:
        return (
          <input type="text" name={key} onChange={(e) => change(e, setter)} />
        );
    }
  };

  const renderFormGroup = (key, setter) => {
    switch (key) {
      case "id_sali":
        return <></>;
      default:
        return (
          <div className="change_group">
            {renderInputs(key, setter)}
            <label htmlFor="key">{key.replaceAll(/_/gi, " ")}</label>
          </div>
        );
    }
  };
  const handlePostEvent = async () => {
    if (eventType === "wystawa") {
      const params = {
        imie_wystawiajacego: wystawyInputs.imie_wystawiajacego,
        nazwisko_wystawiajacego: wystawyInputs.nazwisko_wystawiajacego,
        temat: wystawyInputs.temat,
        typ_wystawy: wystawyInputs.typ_wystawy,
        opis: wystawyInputs.opis,
        data: wystawyInputs.data,
        czas_trwania: wystawyInputs.czas_trwania,
        id_domu_kultury: wystawyInputs.id_domu_kultury,
        id_sali: wystawyInputs.id_sali,
      };
      console.log(params);
      try {
        const res = await axios.post("/api/wystawy", params);
        console.log(res);
      } catch (error) {
        window.alert(
          "Something went wrong! Check entered information and try again!"
        );
        console.log(error);
      }
    } else if (eventType === "warsztat") {
      const params = {
        imie_wykladowcy: warsztatyInputs.imie_wykladowcy,
        nazwisko_wykladowcy: warsztatyInputs.nazwisko_wykladowcy,
        temat: warsztatyInputs.temat,
        email: warsztatyInputs.email_wykladowcy,
        telefon: warsztatyInputs.telefon,
        data: warsztatyInputs.data,
        czas_trwania: warsztatyInputs.czas_trwania,
        id_domu_kultury: warsztatyInputs.id_domu_kultury,
        id_sali: warsztatyInputs.id_sali,
      };
      console.log(params);
      try {
        const res = await axios.post("/api/warsztaty", params);
        console.log(res);
      } catch (error) {
        window.alert(
          "Something went wrong! Check entered information and try again!"
        );
        console.log(error);
      }
    }

    setRefetch(!refetch);
    handleActive();
  };

  return (
    <div className="popup">
      <div className="popup_wrapper">
        <button
          className="close_popup las la-times"
          onClick={handleActive}
        ></button>
        <h2>Dodaj wydarzenie</h2>
        <div className="user-type-radios">
          <label className="radio_button">
            <input
              name="warsztat"
              type="radio"
              value="warsztat"
              checked={eventType === "warsztat"}
              onChange={(e) => {
                setEventType(e.target.value);
                setWystawyInputs(initWystawy);
              }}
            />
            <span className="checkmark"></span>
            Warsztat
          </label>
          <label className="radio_button">
            <input
              name="wystawa"
              type="radio"
              value="wystawa"
              checked={eventType === "wystawa"}
              onChange={(e) => {
                setEventType(e.target.value);
                setWarsztatyInputs(initWarsztaty);
              }}
            />
            <span className="checkmark"></span>
            Wystawa
          </label>
        </div>
        <div className="change_wrapper">
          {eventType === "warsztat" &&
            Object.keys(warsztatyInputs).map((key) => {
              return renderFormGroup(key, setWarsztatyInputs);
            })}
          {eventType === "wystawa" &&
            Object.keys(wystawyInputs).map((key) => {
              return renderFormGroup(key, setWystawyInputs);
            })}
        </div>
        <button className="classic_button_style" onClick={handlePostEvent}>
          Dodaj wydarzenie
        </button>
      </div>
    </div>
  );
}

export default AddEvent;
