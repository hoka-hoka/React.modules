import React from 'react';
import ReactDOM from 'react-dom';
// import './scss/main.scss';
import IntegList from './components/IntegList/Index';

document.addEventListener('DOMContentLoaded', () => {
  const cont = document.querySelector('#root');
  ReactDOM.render(<IntegList />, cont);
});
