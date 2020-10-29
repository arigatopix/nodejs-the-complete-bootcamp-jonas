/* eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

import { displayMap } from './mapbox';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector(
  '.form-user-password',
);

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
    const form = new FormData();

    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    // updateData
    updateSettings(form, 'data');

    e.preventDefault();
  });
}
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();

    // เปลี่ยนปุ่มให้แสดงผลว่ากำลัง update
    document.querySelector('.btn--save-password').textContent =
      'Updating...';

    const currentPassword = document.getElementById(
      'password-current',
    ).value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById(
      'password-confirm',
    ).value;

    // updat password
    await updateSettings(
      { currentPassword, password, passwordConfirm },
      'password',
    );

    // update password success
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';

    document.querySelector('.btn--save-password').textContent =
      'Save password.';
  });
}
