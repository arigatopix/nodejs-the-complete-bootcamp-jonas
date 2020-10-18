/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { updateData } from './updateSettings';

import { displayMap } from './mapbox';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');

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

if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    // updateData
    updateData(name, email);

    e.preventDefault();
  });
}
