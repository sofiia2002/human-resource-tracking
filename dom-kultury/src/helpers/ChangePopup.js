import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Refetch } from "../Context";
import moment from "moment";
import "../styles/Popup.css";

function ChangePopup({ data, popupHandler }) {
  const [positions, setPositions] = useState([]);
  const [workerInfo, setWorkerInfo] = useState(data);
  const { refetch, setRefetch } = useContext(Refetch);
  useEffect(() => {
    async function fetch() {
      const positions = await axios("/api/stanowiska");
      setPositions(positions.data);
    }
    fetch();
  }, []);

  const infoAboutPosition = (position) => {
    const res = positions.filter((el) => {
      return el.nazwa === position;
    });
    return res[0];
  };
  const change = (e, setter) => {
    let { name, value } = e.target;
    if (name === "data_urodzenia") {
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
      case "stanowisko":
        return (
          <select
            name={key}
            value={workerInfo[key]}
            onChange={(e) => {
              change(e, setWorkerInfo);
              setWorkerInfo((prevState) => ({
                ...prevState,
                id_stanowiska: infoAboutPosition(e.target.value).id,
                pensja: infoAboutPosition(e.target.value).pensja,
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
        const dataUr = moment.utc(workerInfo[key]).format("YYYY-MM-DD");
        console.log(dataUr);
        return (
          <input
            type="date"
            name={key}
            value={dataUr}
            onChange={(e) => change(e, setWorkerInfo)}
          />
        );
      case "id":
      case "id_adresu":
      case "id_poczty":
        return (
          <input type="text" disabled name={key} value={workerInfo[key]} />
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
            value={workerInfo[key]}
            onChange={(e) => change(e, setWorkerInfo)}
          />
        );
    }
  };
  const renderChangeGroup = (key, i) => {
    switch (key) {
      // case "id":
      case "id_stanowiska":
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
  const handleChange = async (e) => {
    const params = {
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

    await axios.put(`/api/pracownicy?id=${workerInfo.id}`, params);
    //getAuthData(e);
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
          onClick={handleChange}
          className="popup_submit classic_button_style"
        >
          Zapisz Zmiany
        </button>
      </div>
    </div>
  );
}

export default ChangePopup;
