import React, { useContext, useEffect } from "react";
import LoginInput from "../helpers/LoginInput";
import axios from "axios";
import { GeneralData } from "../Context";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";

function Register() {
  const history = useHistory();
  const { userData, setUserData } = useContext(GeneralData);
  const [registerInfo, setRegisterInfo] = useState({});
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    setUserData(userInfo);
    if (Object.keys(userInfo).length!==0){
      history.push("/");
    }
  }, [userInfo]);

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/uczestnicy/", registerInfo);
      setUserInfo({ ...res.data, stanowisko: "Uczestnik" });
      history.push("/login");
    } catch (error) {
      window.alert("Something went wrong! Try again!")
      console.log(error);
    }
  };
  const change = (e, setter) => {
    let { name, value } = e.target;
    setter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <div className="wrapper">
      <h1>Rejestraja uczestnika:</h1>
      <form onSubmit={login}>
        <div className="form-group">
          <LoginInput
            text="Imie"
            type="text"
            name="imie"
            setter={(e) => change(e, setRegisterInfo)}
          />
          <LoginInput
            text="Nazwisko"
            type="text"
            name="nazwisko"
            setter={(e) => change(e, setRegisterInfo)}
          />
          <LoginInput
            text="Telefon"
            type="text"
            name="telefon"
            setter={(e) => change(e, setRegisterInfo)}
          />
          <LoginInput
            text="Email"
            type="email"
            name="email"
            setter={(e) => change(e, setRegisterInfo)}
          />
          <LoginInput
            text="Hasło"
            type="password"
            name="haslo"
            setter={(e) => change(e, setRegisterInfo)}
          />
          <LoginInput
            text="Powtórz hasło"
            type="password"
            name="powtorzhaslo"
            setter={(e) => change(e, setRegisterInfo)}
          />
        </div>

        <button className="submit-button" type="submit">
          Zarejestruj się
        </button>
      </form>
    </div>
  );
}

export default Register;
