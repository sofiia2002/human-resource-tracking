import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { GeneralData } from "./Context";
import { Refetch } from "./Context";
import BasicPage from "./components/BasicPage.js";
import Navbar from "./components/Navbar.js";

function App() {
  const [userData, setUserData] = useState({});
  const [refetch, setRefetch] = useState(false);

  return (
    <GeneralData.Provider
      value={{
        userData,
        setUserData,
      }}
    >
      <Refetch.Provider
        value={{
          refetch,
          setRefetch,
        }}
      >
        <Router hashType="noslash">
          <Navbar />
          <BasicPage />
        </Router>
      </Refetch.Provider>
    </GeneralData.Provider>
  );
}

export default App;
