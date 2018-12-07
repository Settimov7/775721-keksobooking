'use strict';

(function () {
  var KEY_CODE = {
    esc: 27
  };

  function isEscEvent(evt, action) {
    if (evt.keyCode === KEY_CODE.esc) {
      action();
    }
  }

  window.util = {
    isEscEvent: isEscEvent
  };
})();
