'use strict';

(function () {
  var DATA_URL = 'https://js.dump.academy/keksobooking/data';
  var MAIN_PIN = {
    height: 84,
    startleft: 570,
    startTop: 375
  };
  var MAP_COORDS_CONFINES = {
    minY: 130,
    maxY: 630
  };
  var HIDDEN_CLASS_NAME = 'map--faded';

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mainPin = mapPins.querySelector('.map__pin--main');

  var AllAnnouncements;

  function onLoad(announcements) {
    window.pin.showMapPins(announcements, mapPins);
    AllAnnouncements = announcements;
  }

  function turnOnMap() {
    window.util.showElement(map, HIDDEN_CLASS_NAME);
    window.filter.turnOnFilter();
    window.form.turnOnForm();

    window.backend.load(DATA_URL, onLoad, window.popup.onErrorPopup);
  }

  function resetMainPin() {
    mainPin.style.left = MAIN_PIN.startleft + 'px';
    mainPin.style.top = MAIN_PIN.startTop + 'px';

    window.form.setAdress(getCurrentAddress());
  }

  function turnOffMap() {
    window.util.disableElement(map, HIDDEN_CLASS_NAME);
    window.filter.turnOffFilter();
    window.form.turnOffForm();

    window.card.removeMapCard(map);
    window.pin.removeMapPins(mapPins);
    resetMainPin();
  }

  function checkMainPinCoords(newPosition) {
    return (newPosition.top >= MAP_COORDS_CONFINES.minY && newPosition.top <= MAP_COORDS_CONFINES.maxY - MAIN_PIN.height &&
            newPosition.left >= 0 && newPosition.left <= map.offsetWidth - mainPin.offsetWidth);
  }

  function getCurrentAddress() {
    return Math.round(mainPin.getBoundingClientRect().left + pageXOffset + mainPin.offsetWidth / 2 - map.getBoundingClientRect().left).toString()
            + ', ' + (mainPin.getBoundingClientRect().top + pageYOffset + MAIN_PIN.height).toString();
  }

  function dragMainPin(evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    if (map.classList.contains(HIDDEN_CLASS_NAME)) {
      turnOnMap();
    }

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var newPosition = {
        top: mainPin.offsetTop - shift.y,
        left: mainPin.offsetLeft - shift.x
      };

      if (checkMainPinCoords(newPosition)) {
        window.form.setAdress(getCurrentAddress());
        mainPin.style.top = newPosition.top + 'px';
        mainPin.style.left = newPosition.left + 'px';
      }
    }

    function onMouseUp(downEvt) {
      downEvt.preventDefault();

      window.form.setAdress(getCurrentAddress());
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function onMapPinClick(evt) {
    var target = evt.target;
    var parentElement = target.closest('.map__pin');

    if (AllAnnouncements && parentElement && !parentElement.classList.contains('map__pin--main')) {
      evt.preventDefault();

      window.pin.activate(parentElement);
      window.card.changeMapCard(map, parentElement, AllAnnouncements);
    }
  }

  function onFilterChanged(evt) {
    evt.preventDefault();

    window.pin.updateMapPins(map, mapPins, window.filter.filterAnnouncements(AllAnnouncements));
  }

  mainPin.addEventListener('mousedown', dragMainPin);
  map.addEventListener('click', onMapPinClick);
  window.filter.filterElement.addEventListener('change', window.debounce(onFilterChanged));

  window.turnOffMap = turnOffMap;
})();
