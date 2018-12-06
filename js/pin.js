'use strict';

(function () {
  var ACTIVE_CLASS_NAME = 'map__pin--active';

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

    for (var i = 0; i < announcements.length; i++) {
      mapPinsFragment.appendChild(generateMapPin(announcements[i]));
    }

    return mapPinsFragment;
  }

  function showMapPins(announcements, mapPinsList) {
    mapPinsList.appendChild(generateMapPinsFragment(announcements));
  }

  function removeMapPins(mapPinsList) {
    if (mapPinsList) {
      var mapPins = mapPinsList.querySelectorAll('.map__pin');

      for (var i = 0; i < mapPins.length; i++) {
        if (!mapPins[i].classList.contains('map__pin--main')) {
          mapPinsList.removeChild(mapPins[i]);
        }
      }
    }
  }

  function activate(mapPin) {
    var oldActiveMapPin = document.querySelector('.' + ACTIVE_CLASS_NAME);

    if (oldActiveMapPin) {
      oldActiveMapPin.classList.remove(ACTIVE_CLASS_NAME);
    }

    mapPin.classList.add(ACTIVE_CLASS_NAME);
  }

  window.pin = {
    showMapPins: showMapPins,
    removeMapPins: removeMapPins,
    activate: activate
  };
})();
