'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 300;

  function debounce(action) {
    var lastTimeout = null;

    function addTimeout() {
      var parameters = arguments;

      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }

      lastTimeout = setTimeout(function () {
        action(parameters[0]);
      }, DEBOUNCE_INTERVAL);
    }

    return addTimeout;
  }

  window.debounce = debounce;
})();
