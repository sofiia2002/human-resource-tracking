import React from "react";

const LoginInput = ({ name, setter, text, type }) => {
  return (
    <label>
      {text}:
      <input type={type} name={name} id="" onChange={setter} required />
    </label>
  );
};

export default LoginInput;
