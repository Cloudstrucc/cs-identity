//
// inputmask.js
//

import Inputmask from 'inputmask';

const toggles = document.querySelectorAll('[data-inputmask]');

const options = {
  rightAlign: false,
};

Inputmask(options).mask(toggles);

// Make available globally for users of the /dist folder
// Feel free to comment this out if you're working in the /src folder
window.Inputmask = Inputmask;
