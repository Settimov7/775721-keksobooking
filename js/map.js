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
  var DISABLE_CLASS_NAME = 'ad-form--disabled';

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mainPin = mapPins.querySelector('.map__pin--main');

  var mapFilter = document.querySelector('.map__filters');

  var adForm = document.querySelector('.ad-form');
  var AllAnnouncements;

  function showElement(element, className) {
    element.classList.remove(className);
  }

  function disableElement(element, className) {
    element.classList.add(className);
  }

  function turnOnElements(elements) {
    elements.forEach(function (element) {
      element.disabled = false;
    });
  }

  function onLoad(announcements) {
    window.pin.showMapPins(announcements, mapPins);
    AllAnnouncements = announcements;
  }

  function turnOnMap() {
    showElement(map, HIDDEN_CLASS_NAME);
    showElement(adForm, DISABLE_CLASS_NAME);
    turnOnElements(adForm.querySelectorAll('fieldset'));
    turnOnElements(mapFilter.querySelectorAll('select'));
    turnOnElements(mapFilter.querySelectorAll('fieldset'));

    window.backend.load(DATA_URL, onLoad, window.popup.onErrorPopup);
  }

  function turnOffElements(elements) {
    elements.forEach(function (element) {
      element.disabled = true;
    });
  }

  function resetMainPin() {
    mainPin.style.left = MAIN_PIN.startleft + 'px';
    mainPin.style.top = MAIN_PIN.startTop + 'px';

    adForm.querySelector('#address').value = getCurrentAddress();
  }

  function turnOffMap() {
    disableElement(map, HIDDEN_CLASS_NAME);
    disableElement(adForm, DISABLE_CLASS_NAME);
    turnOffElements(adForm.querySelectorAll('fieldset'));
    turnOffElements(mapFilter.querySelectorAll('select'));
    turnOffElements(mapFilter.querySelectorAll('fieldset'));

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
        adForm.querySelector('#address').value = getCurrentAddress();
        mainPin.style.top = newPosition.top + 'px';
        mainPin.style.left = newPosition.left + 'px';
      }
    }

    function onMouseUp(downEvt) {
      downEvt.preventDefault();

      adForm.querySelector('#address').value = getCurrentAddress();

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

    window.pin.updateMapPins(map, mapPins, window.filterAnnouncements(mapFilter, AllAnnouncements));
  }

  mainPin.addEventListener('mousedown', dragMainPin);
  window.addFormChangeListeners(adForm);
  map.addEventListener('click', onMapPinClick);
  mapFilter.addEventListener('change', window.debounce(onFilterChanged));

  window.turnOffMap = turnOffMap;
})();
