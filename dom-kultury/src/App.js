import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { GeneralData } from "./Context";
import BasicPage from "./components/BasicPage.js";
import Navbar from "./components/Navbar.js";

function App() {
  const [userData, setUserData] = useState({});

  return (
    <GeneralData.Provider
      value={{
        userData,
        setUserData,
      }}
    >
      <Router hashType="noslash">
        <Navbar />
        <BasicPage />
      </Router>
    </GeneralData.Provider>
  );
}

export default App;
