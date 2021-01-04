import React, { useState, useEffect } from "react";
import axios from "axios";
import background from "../images/background.jpg";
import "../styles/Home.css";

function Home() {
  const [domyKultury, setDomyKultury] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchData() {
      const result = await axios("/api/domy_kultury/");
      setDomyKultury(result.data);
    }
    fetchData();
  }, []);

  return (
    <div className="home">
      <div className="jumbotron">
        {/* <img src={background} alt="" /> */}
        <span>Witamy w naszym domie kultury</span>
      </div>

      <div className="domy-kultury-text">Nasze lokalizacje</div>
      {domyKultury.length > 0 ? (
        <div className="wrapper-domy-kultury">
          <i
            className="las la-angle-left"
            onClick={() =>
              page > 1 ? setPage(page - 1) : setPage(domyKultury.length)
            }
          />
          <div className="domy-kultury">
            {/* {domyKultury.map((element, index) => (
            <DomKultury data={element} key={index}/>
          ))} */}
            <DomKultury data={domyKultury[page - 1]} />
          </div>
          <i
            className="las la-angle-right"
            onClick={() =>
              page < 2 && domyKultury.length > page
                ? setPage(page + 1)
                : setPage(1)
            }
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

function DomKultury({ data }) {
  const streetString = data.street.toLowerCase().replace(" ", "%20");

  return (
    <div className="dom-kultury">
      <iframe
        title={data.id}
        width="500"
        height="350"
        frameBorder="0"
        style={{ border: 0 }}
        src={
          "https://www.google.com/maps/embed/v1/place?q=" +
          data.city.toLowerCase() +
          "%20" +
          streetString +
          "&key=AIzaSyBwPaCKWoM2plzH9m-1MqJ7zWCuIzAu-10"
        }
        allowFullScreen
      ></iframe>
      <div>
        <h5>{data ? data.city : ""}</h5>
        <h5>{data ? data.street + "/" + data.apartment : ""}</h5>
        <h5>{data ? data.postal_code : ""}</h5>
        <h5>{data ? data.phone : ""}</h5>
      </div>
    </div>
  );
}

export default Home;
