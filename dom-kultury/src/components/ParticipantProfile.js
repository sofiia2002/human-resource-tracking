import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GeneralData } from "../Context";
import { Refetch } from "../Context";

function ParticipantProfile() {
  const { userData, setUserData } = useContext(GeneralData);
  const { refetch, setRefetch } = useContext(GeneralData);
  const [eventsInfo, setEventsInfo] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data: basic } = await axios(
        `/api/wydarzenia_uczestnika/${userData.id}`
      );
    }
    fetchData();
  }, []);

  return (
    <div className="wrapper">
      <div className="header">
        <h1>Zalogowany jako: {userData.stanowisko}</h1>
      </div>
      <div className="dashboard">
        <h5>Wydarzenia na które jestem zapisany:</h5>
        <div className="my-events">
          {eventsInfo.map((el) => {
            return <h4>{el.typ}</h4>;
          })}
        </div>
      </div>
    </div>
  );
}

export default ParticipantProfile;
