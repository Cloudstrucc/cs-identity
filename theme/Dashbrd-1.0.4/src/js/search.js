//
// search.js
//

const searchInput = document.querySelector('#topnavSearchInput');

document.addEventListener('keydown', (e) => {
  if (e.metaKey && e.key === 'k') {
    e.preventDefault();
    searchInput.focus();
  }
});
