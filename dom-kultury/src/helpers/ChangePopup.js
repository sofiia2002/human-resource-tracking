import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Refetch } from "../Context";
import moment from "moment";
import "../styles/Popup.css";

function ChangePopup({ data, popupHandler, typ, url }) {
  const [positions, setPositions] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [workerInfo, setWorkerInfo] = useState(data);
  const { refetch, setRefetch } = useContext(Refetch);
  useEffect(() => {
    async function fetch() {
      switch (typ) {
        case "pracownik":
          const positions = await axios("/api/stanowiska");
          setPositions(positions.data);
          break;
        case "wystawa":
        case "warsztat":
          const res = await axios("/api/sale");
          setRooms(res.data);
          break;
        default: break;  
      }
    }
    fetch();
  }, []);

  const infoAboutPosition = (position, arr) => {
    const res = arr.filter((el) => {
      if (typ === "pracownik") {
        return el.nazwa === position;
      } else {
        return el.numer_sali === position;
      }
    });
    return res[0];
  };
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
  const handleChangeInput = (key) => {
    switch (key) {
      case "plec":
        return (
          <select
            name={key}
            value={workerInfo[key]}
            onChange={(e) => change(e, setWorkerInfo)}
          >
            <option value="K">Kobieta</option>
            <option value="M">Mężczyzna</option>
          </select>
        );
      case "numer_sali":
        return (
          <select
            name={key}
            value={workerInfo[key]}
            onChange={(e) => {
              change(e, setWorkerInfo);

              setWorkerInfo((prevState) => ({
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
      case "stanowisko":
        return (
          <select
            name={key}
            value={workerInfo[key]}
            onChange={(e) => {
              change(e, setWorkerInfo);
              setWorkerInfo((prevState) => ({
                ...prevState,
                id_stanowiska: infoAboutPosition(e.target.value, positions).id,
                pensja: infoAboutPosition(e.target.value, positions).pensja,
              }));
            }}
          >
            {positions.map((position, i) => {
              return (
                <option key={i} value={position.nazwa}>
                  {position.nazwa}
                </option>
              );
            })}
          </select>
        );
      case "data_urodzenia":
      case "data":
        if (typ === "pracownik") {
          const dataUr = moment.utc(workerInfo[key]).format("YYYY-MM-DD");

          console.log(dataUr);
          return (
            <input
              type="date"
              name={key}
              value={dataUr || ""}
              onChange={(e) => change(e, setWorkerInfo)}
            />
          );
        } else {
          const data = moment.utc(workerInfo[key]).format("YYYY-MM-DDTHH:mm");
          return (
            <input
              type="datetime-local"
              name={key}
              value={data || ""}
              onChange={(e) => {
                change(e, setWorkerInfo);
                console.log(e.target.value);
              }}
            />
          );
        }

      case "id":
      case "id_adresu":
      case "id_poczty":
      case "id_sali":
        return (
          <input type="text" disabled name={key} value={workerInfo[key] || ""} />
        );
      case "haslo":
        return (
          <input
            type="password"
            name={key}
            value={workerInfo[key]}
            onChange={(e) => change(e, setWorkerInfo)}
          />
        );
      default:
        return (
          <input
            type="text"
            name={key}
            value={workerInfo[key] || ""}
            onChange={(e) => change(e, setWorkerInfo)}
          />
        );
    }
  };
  const renderChangeGroup = (key, i) => {
    switch (key) {
      // case "id":
      case "id_stanowiska":
      case "id_sali":
      case "uczestnicyLista":
        // case "id_poczty":
        // case "id_adresu":
        return <div></div>;
      default:
        return (
          <div className="change_group" key={i}>
            {handleChangeInput(key)}
            <label htmlFor={key}>{key}</label>
          </div>
        );
    }
  };
  const employeesHandleChange = async (e) => {
    let params;
    switch (typ) {
      case "pracownik":
        params = {
          imie: workerInfo.imie,
          nazwisko: workerInfo.nazwisko,
          pesel: workerInfo.pesel,
          haslo: workerInfo.haslo,
          data_urodzenia: workerInfo.data_urodzenia,
          telefon: workerInfo.telefon,
          plec: workerInfo.plec,
          id_stanowiska: workerInfo.id_stanowiska,
          id_adresu: workerInfo.id_adresu,
          miasto: workerInfo.miasto,
          ulica: workerInfo.ulica,
          nr_lokalu: workerInfo.nr_lokalu,
          id_poczty: workerInfo.id_poczty,
          kod_poczty: workerInfo.kod_poczty,
          poczta: workerInfo.poczta,
        };
        break;
      case "wystawa":
        params = {
          imie_wystawiajacego: workerInfo.imie_wystawiajacego,
          nazwisko_wystawiajacego: workerInfo.nazwisko_wystawiajacego,
          temat: workerInfo.temat,
          typ_wystawy: workerInfo.typ_wystawy,
          opis: workerInfo.opis,
          data: workerInfo.data,
          czas_trwania: workerInfo.czas_trwania,
          id_domu_kultury: workerInfo.id_domu_kultury,
          id_sali: workerInfo.id_sali,
        };

        break;
      case "warsztat":
        params = {
          imie_wykladowcy: workerInfo.imie_wykladowcy,
          nazwisko_wykladowcy: workerInfo.nazwisko_wykladowcy,
          temat: workerInfo.temat,
          email: workerInfo.email,
          telefon: workerInfo.telefon,
          data: workerInfo.data,
          czas_trwania: workerInfo.czas_trwania,
          id_domu_kultury: workerInfo.id_domu_kultury,
          id_sali: workerInfo.id_sali,
        };
        break;
      default: break;  
    }
    await axios.put(url, params);
    setRefetch(!refetch);
    popupHandler();
  };

  return (
    <div className="popup">
      <div className="popup_wrapper">
        <button
          className="close_popup las la-times"
          onClick={popupHandler}
        ></button>
        <h2>Zmień dane {data.imie + " " + data.nazwisko}</h2>

        <div className="change_wrapper">
          {Object.entries(data).map(([key, value], i) =>
            renderChangeGroup(key, i)
          )}
        </div>
        <button
          onClick={employeesHandleChange}
          className="popup_submit classic_button_style"
        >
          Zapisz Zmiany
        </button>
      </div>
    </div>
  );
}

export default ChangePopup;
