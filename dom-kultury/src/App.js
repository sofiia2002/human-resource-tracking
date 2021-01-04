import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { GeneralData } from "./Context";
import BasicPage from "./components/BasicPage.js";
import Navbar from "./components/Navbar.js";
import Login from "./components/Login.js";

function App() {
  const [userData, setUserData] = useState({
    isLoggedIn: false,
    userType: "",
    name: "",
  });

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
