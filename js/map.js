'use strict';

(function () {
  var MAIN_PIN_HEIGHT = 84;
  var MAP_COORDS_CONFINES = {
    minY: 130,
    maxY: 630
  };

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mainPin = mapPins.querySelector('.map__pin--main');

  var mapFilter = document.querySelector('.map__filters');

  var adForm = document.querySelector('.ad-form');

  var allAnnouncement = window.generateAnnouncementList(map, MAP_COORDS_CONFINES);
  var allMapPins = window.generateMapPinsFragment(allAnnouncement);

  function showElement(element) {
    element.classList.remove('map--faded');
  }

  function turnOnElements(elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = false;
    }
  }

  function turnOnMap() {
    showElement(map);
    adForm.classList.remove('ad-form--disabled');
    turnOnElements(adForm.querySelectorAll('fieldset'));
    turnOnElements(mapFilter.querySelectorAll('select'));
    turnOnElements(mapFilter.querySelectorAll('fieldset'));
  }

  function showMapPins() {
    mapPins.appendChild(allMapPins);
    mainPin.removeEventListener('click', showMapPins);
  }

  function checkMainPinCoords(newPosition) {
    return (newPosition.top >= MAP_COORDS_CONFINES.minY && newPosition.top <= MAP_COORDS_CONFINES.maxY - MAIN_PIN_HEIGHT &&
            newPosition.left >= 0 && newPosition.left <= map.offsetWidth - mainPin.offsetWidth);
  }

  function getCurrentAddress() {
    return Math.round(mainPin.getBoundingClientRect().left + pageXOffset + mainPin.offsetWidth / 2 - map.getBoundingClientRect().left).toString()
            + ', ' + (mainPin.getBoundingClientRect().top + pageYOffset + MAIN_PIN_HEIGHT).toString();
  }

  function draggingMainPin(evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    turnOnMap();

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

      showMapPins();
      adForm.querySelector('#address').value = getCurrentAddress();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function checkLocation(element, announcement) {
    var elementX = parseInt(element.style.left, 10);
    var elementY = parseInt(element.style.top, 10);
    var announcementX = parseInt(announcement.location.x, 10);
    var announcementY = parseInt(announcement.location.y, 10);

    return elementX === announcementX && elementY === announcementY;
  }

  function changeMapCard(element, announcements) {
    var oldCard = map.querySelector('.map__card');

    if (oldCard) {
      map.removeChild(oldCard);
    }

    for (var i = 0; i < announcements.length; i++) {
      if (checkLocation(element, announcements[i])) {
        var newCard = window.generateMapCard(announcements[i]);
        break;
      }
    }

    map.insertBefore(newCard, map.querySelector('.map__filters-container'));
    newCard.querySelector('.popup__close').addEventListener('click', function () {
      map.removeChild(newCard);
    });
  }

  function onMapPinClick(evt) {
    evt.preventDefault();

    var target = evt.target;
    var parentElement = target.closest('.map__pin');

    if (parentElement && !parentElement.classList.contains('map__pin--main')) {
      changeMapCard(parentElement, allAnnouncement);
    }
  }

  window.addFormChangeListeners(adForm);
  mainPin.addEventListener('mousedown', draggingMainPin);
  map.addEventListener('click', onMapPinClick);
})();
