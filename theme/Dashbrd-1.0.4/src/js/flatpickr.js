//
// flatpickr.js
//

import flatpickr from 'flatpickr';

const toggles = document.querySelectorAll('[data-flatpickr]');

toggles.forEach((toggle) => {
  const options = toggle.dataset.flatpickr ? JSON.parse(toggle.dataset.flatpickr) : {};

  flatpickr(toggle, options);
});

// Make available globally for users of the /dist folder
// Feel free to comment this out if you're working in the /src folder
window.flatpickr = flatpickr;
