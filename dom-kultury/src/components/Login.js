import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { GeneralData } from "../Context";
import "../styles/Login.css";
import LoginInput from "../helpers/LoginInput";

function Login() {
  const { setUserData } = useContext(GeneralData);
  // const [name, setName] = useState("Guest");
  // const [userType, setUserType] = useState("guest");
  const history = useHistory();

  //form states
  const [userType, setUserType] = useState("");
  const [employeeForm, setEmployeeForm] = useState({});
  const [participantForm, setParticipantForm] = useState({});

  const login = (e) => {
    // axios i endpoint z logowaniem

    e.preventDefault();
    // if (userName && userPass && userType) {
    //   setUserData({
    //     isLoggedIn: true,
    //     userType: userType,
    //     name: userName,
    //   });
    // }
    // history.push("/");
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
          <label>
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
            Pracownik
          </label>
          <label>
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
            Uczestnik
          </label>
        </div>
        {userType === "pracownik" ? (
          <div className="form-group">
            <LoginInput
              text="Imię"
              type="text"
              name="name"
              setter={(e) => change(e, setEmployeeForm)}
            />
            <LoginInput
              text="Nazwisko"
              type="text"
              name="surname"
              setter={(e) => change(e, setEmployeeForm)}
            />
            <LoginInput
              text="Hasło"
              type="password"
              name="password"
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
              name="password"
              setter={(e) => change(e, setParticipantForm)}
            />
          </div>
        ) : (
          ""
        )}

        <button className="submit-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Login;
