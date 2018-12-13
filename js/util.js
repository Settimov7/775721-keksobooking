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

  function turnOnElements(elements) {
    elements.forEach(function (element) {
      element.disabled = false;
    });
  }

  function turnOffElements(elements) {
    elements.forEach(function (element) {
      element.disabled = true;
    });
  }

  function showElement(element, className) {
    element.classList.remove(className);
  }

  function disableElement(element, className) {
    element.classList.add(className);
  }

  window.util = {
    isEscEvent: isEscEvent,
    turnOnElements: turnOnElements,
    turnOffElements: turnOffElements,
    showElement: showElement,
    disableElement: disableElement
  };
})();
