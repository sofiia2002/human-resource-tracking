import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { GeneralData } from "../Context";
import "../styles/Login.css";
import LoginInput from "../helpers/LoginInput";
import axios from "axios";

function Login() {
  const { setUserData } = useContext(GeneralData);
  const history = useHistory();

  //form states
  const [userType, setUserType] = useState("");
  const [employeeForm, setEmployeeForm] = useState({});
  const [participantForm, setParticipantForm] = useState({});
  const [errorHere, setErrorHere] = useState(true);

  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    setUserData(userInfo);
    if (Object.keys(userInfo).length!==0){
      history.push("/");
    }
  }, [userInfo]);

  const login = async (e) => {
    e.preventDefault();
    // axios i endpoint z logowaniem
    const o = {
      imie: "Sofiia",
      nazwisko: "Levchenko",
      haslo: "hardpass36",
    };
    const o2 = {
      email: "kzyn@email.com",
      haslo: "litepass1",
    };
    if (!userType) return;
    if (userType === "pracownik") {
      try {
        const res = await axios.post("/api/login_pracownicy", o);
        setUserInfo(res.data[0]);
        setErrorHere(false);
      } catch (error) {
        console.log(error);
        window.alert('Nieprawidłowe dane! Spróbuj ponownie!');
      }
    }
    if (userType === "uczestnik") {
      try {
        const res = await axios.post("/api/login_uczestnicy", o2);
        setUserInfo({ ...res.data[0], stanowisko: "Uczestnik" });
        setErrorHere(false);
      } catch (error) {
        console.log(error);
        window.alert('Nieprawidłowe dane! Spróbuj ponownie!')
      }
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
      <h1>Logowanie</h1>
      <h3>Zaloguj sie jako:</h3>
      <form onSubmit={login}>
        <div className="user-type-radios">
          <label className="radio_button">
            <input
              name="pracownik"
              type="radio"
              value="pracownik"
              checked={userType === "pracownik"}
              onChange={(e) => {
                setUserType(e.target.value);
                setParticipantForm({});
              }}
            />
            <span className="checkmark"></span>
            Pracownik
          </label>
          <label className="radio_button">
            <input
              name="uczestnik"
              type="radio"
              value="uczestnik"
              checked={userType === "uczestnik"}
              onChange={(e) => {
                setUserType(e.target.value);
                setEmployeeForm({});
              }}
            />
            <span className="checkmark"></span>
            Uczestnik
          </label>
        </div>
        {userType === "pracownik" ? (
          <div className="form-group">
            <LoginInput
              text="Imię"
              type="text"
              name="imie"
              setter={(e) => change(e, setEmployeeForm)}
            />
            <LoginInput
              text="Nazwisko"
              type="text"
              name="nazwisko"
              setter={(e) => change(e, setEmployeeForm)}
            />
            <LoginInput
              text="Hasło"
              type="password"
              name="haslo"
              setter={(e) => change(e, setEmployeeForm)}
            />
          </div>
        ) : (
          ""
        )}
        {userType === "uczestnik" ? (
          <div className="form-group">
            <LoginInput
              text="Email"
              type="email"
              name="email"
              setter={(e) => change(e, setParticipantForm)}
            />
            <LoginInput
              text="Hasło"
              type="password"
              name="haslo"
              setter={(e) => change(e, setParticipantForm)}
            />
            <small>
              Nie masz konta uczestnika{" "}
              <Link to="/register">Zarejestruj się</Link>
            </small>
          </div>
        ) : (
          ""
        )}

        {userType && (
          <button className="submit-button" type="submit">
            Zaloguj się
          </button>
        )}
      </form>
    </div>
  );
}

export default Login;
