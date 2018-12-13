'use strict';

(function () {
  var ACTIVE_CLASS_NAME = 'map__pin--active';
  var USER_MAP_PINS_CLASS_NAME = 'map__user-pins-container';
  var MAX_PINS = 5;

  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  function checkAnnoucement(announcement) {
    return (announcement.location.x && announcement.location.y && announcement.author.avatar && announcement.offer.description);
  }

  function generateMapPin(announcement) {
    var mapPin = mapPinTemplate.cloneNode(true);

    if (checkAnnoucement(announcement)) {
      mapPin.style.left = announcement.location.x - mapPin.offsetWidth / 2 + 'px';
      mapPin.style.top = announcement.location.y - mapPin.offsetHeight + 'px';
      mapPin.querySelector('img').src = announcement.author.avatar;
      mapPin.alt = announcement.offer.description;
    }
    return mapPin;
  }

  function generateMapPinsFragment(announcements) {
    var mapPinsFragment = document.createDocumentFragment();
    var mapPinsContaier = document.createElement('div');
    mapPinsContaier.classList.add(USER_MAP_PINS_CLASS_NAME);

    for (var i = 0; (i < announcements.length && i < MAX_PINS); i++) {
      mapPinsContaier.appendChild(generateMapPin(announcements[i]));
    }

    mapPinsFragment.appendChild(mapPinsContaier);
    return mapPinsFragment;
  }

  function showMapPins(announcements, mapPinsList) {
    mapPinsList.appendChild(generateMapPinsFragment(announcements));
  }

  function removeMapPins(mapPinsList) {
    var mapPinsContaier = mapPinsList.querySelector('.' + USER_MAP_PINS_CLASS_NAME);

    if (mapPinsContaier) {
      mapPinsList.removeChild(mapPinsContaier);
    }
  }

  function activate(mapPin) {
    var oldActiveMapPin = document.querySelector('.' + ACTIVE_CLASS_NAME);

    if (oldActiveMapPin) {
      oldActiveMapPin.classList.remove(ACTIVE_CLASS_NAME);
    }

    mapPin.classList.add(ACTIVE_CLASS_NAME);
  }

  function updateMapPins(map, mapPinsList, announcements) {
    window.card.removeMapCard(map);
    removeMapPins(mapPinsList);
    showMapPins(announcements, mapPinsList);
  }

  window.pin = {
    showMapPins: showMapPins,
    removeMapPins: removeMapPins,
    updateMapPins: updateMapPins,
    activate: activate
  };
})();
