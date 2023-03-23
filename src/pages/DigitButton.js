import React from 'react';
import { actions } from './index';
import styles from '../styles/Home.module.css';

function DigitButton({ dispatch, digit }) {
  return (
  <button onClick={() => dispatch({ type: actions.addDigit, payload: { digit } })}>
    {digit}
  </button>
  )
}

export default DigitButton
