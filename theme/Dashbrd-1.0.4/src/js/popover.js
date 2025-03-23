//
// popover.js
//

import { Popover } from 'bootstrap';

const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');

popovers.forEach((popover) => {
  new Popover(popover);
});
