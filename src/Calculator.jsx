import React, { useReducer } from "react";
import "./styles.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
export const actions = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};
const Calculator = () => {
  function reducer(cstate, { type, payload }) {
    switch (type) {
      // ^ add digit
      case actions.ADD_DIGIT:
        if (cstate.eval) {
          return { ...cstate, currentOperand: payload.digit, eval: false };
        }
        if (payload.digit === "0" && cstate.currentOperand === "0") {
          return cstate;
        } else if (
          payload.digit === "." &&
          cstate.currentOperand.includes(".")
        ) {
          return cstate;
        }
        if (payload.digit === "." && cstate.currentOperand === ".") {
          return cstate;
        }
        return {
          ...cstate,
          currentOperand: `${cstate.currentOperand || ""}${payload.digit}`,
        };

      // ^clear state
      case actions.CLEAR:
        return {
          currentOperand: "",
          previousOperand: "",
          operation: "",
          eval: false,
        };

      // ^ choose operator
      case actions.CHOOSE_OPERATION:
        if (cstate.currentOperand === "" && cstate.previousOperand === "") {
          return cstate;
        }
        if (cstate.previousOperand === "") {
          return {
            ...cstate,
            operation: payload.operation,
            previousOperand: cstate.currentOperand,
            currentOperand: "",
          };
        } else if (cstate.currentOperand === "") {
          return { ...cstate, operation: payload.operation };
        }
        return {
          ...cstate,
          operation: payload.operation,
          previousOperand: evaluate(cstate),
          currentOperand: "",
        };

      // ^evaluation result
      case actions.EVALUATE:
        if (cstate.currentOperand === "") {
          return cstate;
        } else if (cstate.previousOperand !== "") {
          return {
            ...cstate,
            currentOperand: evaluate(cstate),
            previousOperand: "",
            operation: "",
            eval: true,
          };
        } else {
          return cstate;
        }

      // ^delete digit
      case actions.DELETE_DIGIT:
        if (cstate.currentOperand === "") {
          return {
            ...cstate,
            currentOperand: cstate.previousOperand,
            operation: "",
            previousOperand: "",
          };
        } else if (cstate.eval) {
          return { ...cstate, currentOperand: "", eval: false };
        } else {
          return {
            ...cstate,
            currentOperand: cstate.currentOperand.slice(
              0,
              cstate.currentOperand.length - 1
            ),
          };
        }
      default:
        return cstate;
    }
  }
  let evaluate = ({ currentOperand, previousOperand, operation }) => {
    let current = parseFloat(currentOperand);
    let prev = parseFloat(previousOperand);
    let result = "";
    if (isNaN(current) || isNaN(prev)) return "";

    switch (operation) {
      case "+":
        result = prev + current;
        break;
      case "-":
        result = prev - current;
        break;
      case "*":
        result = prev * current;
        break;
      case "/":
        result = prev / current;
        break;
    }
    return String(result);
  };

  const INTEGER_FORMATTER = new Intl.NumberFormat("en-in", {
    maximumFractionDigits: 0,
  });
  function formatoperand(operand) {
    if (operand == null) return;
    const [integer, decimal] = operand.split(".");
    if (decimal == null) return INTEGER_FORMATTER.format(integer);
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
  }
  let [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    { currentOperand: "", previousOperand: "", operation: "", eval: false }
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatoperand(previousOperand) == 0
            ? previousOperand
            : formatoperand(previousOperand)}
          {operation}
        </div>
        <div className="current-operand">{formatoperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: actions.CLEAR })}
      >
        AC
      </button>
      <button
        onClick={() =>
          dispatch({ type: actions.DELETE_DIGIT, payload: { eval: true } })
        }
      >
        DEL
      </button>
      <OperationButton dispatch={dispatch} operation="/" />
      <DigitButton dispatch={dispatch} digit="1" />
      <DigitButton dispatch={dispatch} digit="2" />
      <DigitButton dispatch={dispatch} digit="3" />
      <OperationButton dispatch={dispatch} operation="*" />
      <DigitButton dispatch={dispatch} digit="4" />
      <DigitButton dispatch={dispatch} digit="5" />
      <DigitButton dispatch={dispatch} digit="6" />
      <OperationButton dispatch={dispatch} operation="+" />
      <DigitButton dispatch={dispatch} digit="7" />
      <DigitButton dispatch={dispatch} digit="8" />
      <DigitButton dispatch={dispatch} digit="9" />
      <OperationButton dispatch={dispatch} operation="-" />
      <DigitButton dispatch={dispatch} digit="." />
      <DigitButton dispatch={dispatch} digit="0" />
      <button
        className="span-two"
        onClick={() => dispatch({ type: actions.EVALUATE })}
      >
        =
      </button>
    </div>
  );
};

export default Calculator;
