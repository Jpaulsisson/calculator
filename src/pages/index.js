import React, { useReducer, useState } from "react";
import styles from '../styles/Home.module.css';
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const actions = {
  addDigit: 'add-digit',
  chooseOperation: 'choose-operation',
  clear: 'clear',
  deleteDigit: 'delete-digit',
  evaluate: 'evaluate'
}

function reducer(state, { type, payload }) {
  switch(type){
    case actions.addDigit:
      if(state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite:false
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state
      if (payload.digit === "." && state.currentOperand.includes(".")) return state
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
    case actions.deleteDigit:
      if (state.overwrite){
        return{
          ...state,
          overwrite:false,
          currentOperand: null
        }
      }
      if(state.currentOperand == null) return state
      if(state.currentOperand.length === 1) {
        return {...state, currentOperand: null}
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }

    case actions.clear:
      return {}

    case actions.chooseOperation:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }
      if (state.previousOperand == null) {
        return {
        ...state,
        operation: payload.operation,
        previousOperand: state.currentOperand,
        currentOperand: null
      }
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }
    case actions.evaluate:
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
        return state
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let compute = ""
  switch (operation) {
    case "+":
      compute = prev + current
      break;
    case "-":
      compute = prev - current
      break;
    case "*":
      compute = prev * current
      break;
    case "/":
      compute = prev / current
      break;
  }
  return compute.toString()
}

export default function Home() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})
  return (
    <div className={styles.calculatorGrid}>
      <div className={styles.output}>
        <div className={styles.previousOperand}>{previousOperand} {operation}</div>
        <div className={styles.currentOperand}>{currentOperand}</div>
      </div>
      <button onClick={() => dispatch({ type: actions.clear })}className={styles.spanTwo}>AC</button>
      <button onClick={() => dispatch({ type: actions.deleteDigit })}>DEL</button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button onClick={() => dispatch({ type: actions.evaluate })} className={styles.spanTwo}>=</button>
    </div>
    )
  }
