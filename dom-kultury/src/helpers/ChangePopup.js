import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment";
import "../styles/Popup.css";

function ChangePopup({ data, popupHandler }) {
  const [positions, setPositions] = useState([]);
  const [workerInfo, setWorkerInfo] = useState(data);
  useEffect(() => {
    async function fetch() {
      const positions = await axios("/api/stanowiska");
      setPositions(positions.data);
    }
    fetch();
  }, []);

  const indexOfPosition = (position) => {
    const res = positions.filter((el) => {
      return el.nazwa === position;
    });
    return res[0].id;
  };

  const change = (e, setter) => {
    let { name, value } = e.target;
    if (name === "data_urodzenia") {
      setter((prevState) => ({
        ...prevState,
        [name]: moment(value).toISOString(),
      }));
    } else {
      setter((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleChangeInput = (key, value) => {
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
                id_stanowiska: indexOfPosition(e.target.value),
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
        return (
          <input type="text" disabled name={key} value={workerInfo[key]} />
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
  const renderChangeGroup = (key, value, i) => {
    switch (key) {
      // case "id":
      case "id_stanowiska":
        // case "id_poczty":
        // case "id_adresu":
        return <div></div>;
      default:
        return (
          <div className="change_group" key={i}>
            {handleChangeInput(key, value)}
            <label htmlFor={key}>{key}</label>
          </div>
        );
    }
  };
  return (
    <div className="popup">
      {console.log(workerInfo)}
      <div className="popup_wrapper">
        <button
          className="close_popup las la-times"
          onClick={popupHandler}
        ></button>
        <h2>Zmień dane {data.imie + " " + data.nazwisko}</h2>

        <div className="change_wrapper">
          {Object.entries(data).map(([key, value], i) =>
            renderChangeGroup(key, value, i)
          )}
        </div>
        <button className="popup_submit classic_button_style">
          Zapisz Zmiany
        </button>
      </div>
    </div>
  );
}

export default ChangePopup;
