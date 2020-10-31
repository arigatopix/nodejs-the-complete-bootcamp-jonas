/* eslint-disable */

// ลบ alert element
export const hideAlert = () => {
  const el = document.querySelector('.alert');
  // เลือกที่ body แล้วลบ el
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
export const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  // แสดงผลหลัง body tag
  document
    .querySelector('body')
    .insertAdjacentHTML('afterbegin', markup);

  // disapear after 5 second
  window.setTimeout(() => {
    hideAlert();
  }, 5000);
};
