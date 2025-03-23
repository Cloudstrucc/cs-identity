//
// autosize.js
//

import autosize from 'autosize';

const toggles = document.querySelectorAll('[data-autosize]');

toggles.forEach((toggle) => {
  autosize(toggle);
});

// Make available globally for users of the /dist folder
// Feel free to comment this out if you're working in the /src folder
window.autosize = autosize;
