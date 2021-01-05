import React from "react";

const LoginInput = ({ name, setter, text, type }) => {
  let label = `${text}:`;
  return (
    <>
      <div className="text_button">
        <input
          className="form__field"
          type={type}
          name={name}
          onChange={setter}
          placeholder={name}
        />
        <label className="form__label" htmlFor={name}>
          {label}
        </label>
      </div>
    </>
  );
};

export default LoginInput;
