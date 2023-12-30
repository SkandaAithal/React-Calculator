import React from "react";
import { actions } from "./Calculator";
const DigitButton = ({ dispatch, digit }) => {
  return (
    <button
      onClick={() => {
        dispatch({ type: actions.ADD_DIGIT, payload: { digit } });
      }}
    >
      {digit}
    </button>
  );
};

export default DigitButton;
