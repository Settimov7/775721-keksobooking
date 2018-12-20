'use strict';

(function () {
  var DATA_URL = 'https://js.dump.academy/keksobooking/data';
  var HIDDEN_CLASS_NAME = 'map--faded';

  var map = document.querySelector('.map');

  function onLoad(data) {
    window.pin.show(map, data);
    window.filter.turnOn(map, data);
  }

  function onError(errorMessage) {
    window.popup.showError(errorMessage, turnOn);
  }

  function turnOn() {
    window.backend.load(DATA_URL, onLoad, onError);

    window.util.showElement(map, HIDDEN_CLASS_NAME);
    window.form.turnOn();
  }

  function turnOff() {
    window.util.disableElement(map, HIDDEN_CLASS_NAME);
    window.filter.turnOff();
    window.form.turnOff();
    window.card.remove();
    window.pin.remove();
    window.pin.reset();
  }

  function checkStatus() {
    return map.classList.contains(HIDDEN_CLASS_NAME);
  }

  function getBoundingRect() {
    return map.getBoundingClientRect();
  }

  window.pin.addDrag();

  window.map = {
    checkStatus: checkStatus,
    getBoundingRect: getBoundingRect,
    turnOn: turnOn,
    turnOff: turnOff
  };
})();
