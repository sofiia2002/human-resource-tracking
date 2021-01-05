import React from "react";

const LoginInput = ({ name, setter, text, type }) => {
  return (
    <label>
      {text}:
      <input type={type} name={name} onChange={setter} />
    </label>
  );
};

export default LoginInput;
