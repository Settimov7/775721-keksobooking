'use strict';

(function () {
  var KeyCode = {
    ESC: 27
  };

  function isEscEvent(evt, action) {
    if (evt.keyCode === KeyCode.ESC) {
      action();
    }
  }

  window.util = {
    isEscEvent: isEscEvent
  };
})();
