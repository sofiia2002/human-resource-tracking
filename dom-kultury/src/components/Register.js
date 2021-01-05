import React from "react";
import LoginInput from "../helpers/LoginInput";
import { Link, useHistory } from "react-router-dom";
import { useState } from "react";

function Register() {
  const history = useHistory();
  const [registerInfo, setRegisterInfo] = useState({});
  const login = async (e) => {
    e.preventDefault();
    // try {
    //   const res = await axios.post("/api/login_pracownicy", o);

    //   setUserInfo(res.data[0]);
    // } catch (error) {
    //   console.log(error);
    // }
    history.push("/login");
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
