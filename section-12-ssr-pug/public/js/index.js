/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    // email, password from UI
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // login
    login(email, password);

    e.preventDefault();
  });
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);
