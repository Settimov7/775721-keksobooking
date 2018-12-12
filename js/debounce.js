'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 300;

  function debounce(action) {
    var lastTimeout = null;

    function addTimeout() {
      var parametrs = arguments;

      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }

      lastTimeout = setTimeout(function () {
        action.apply(null, parametrs);
      }, DEBOUNCE_INTERVAL);
    }

    return addTimeout;
  }

  window.debounce = debounce;
})();
