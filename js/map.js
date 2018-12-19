'use strict';

(function () {
  var DATA_URL = 'https://js.dump.academy/keksobooking/data';
  var HIDDEN_CLASS_NAME = 'map--faded';

  var map = document.querySelector('.map');

  function onLoad(data) {
    window.pin.showMapPins(map, data);
    window.filter.turnOnFilter(map, data);
  }

  function turnOnMap() {
    window.util.showElement(map, HIDDEN_CLASS_NAME);
    window.form.turnOnForm();

    window.backend.load(DATA_URL, onLoad, window.popup.onErrorPopup);
  }

  function turnOffMap() {
    window.util.disableElement(map, HIDDEN_CLASS_NAME);
    window.filter.turnOffFilter();
    window.form.turnOffForm();

    window.card.removeMapCard(map);
    window.pin.removeMapPins();
    window.pin.resetMainPin();
  }

  function checkStatusMap() {
    return map.classList.contains(HIDDEN_CLASS_NAME);
  }

  function getMapBoundingRect() {
    return map.getBoundingClientRect();
  }

  window.pin.addDragMainPin();

  window.map = {
    checkStatusMap: checkStatusMap,
    getMapBoundingRect: getMapBoundingRect,
    turnOnMap: turnOnMap,
    turnOffMap: turnOffMap
  };
})();
