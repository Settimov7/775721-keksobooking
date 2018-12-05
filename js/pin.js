'use strict';

(function () {
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  function generateMapPin(announcement) {
    var mapPin = mapPinTemplate.cloneNode(true);

    mapPin.style.left = announcement.location.x - mapPin.offsetWidth / 2 + 'px';
    mapPin.style.top = announcement.location.y - mapPin.offsetHeight + 'px';
    mapPin.querySelector('img').src = announcement.author.avatar;
    mapPin.alt = announcement.offer.description;

    return mapPin;
  }

  function generateMapPinsFragment(announcements) {
    var mapPinsFragment = document.createDocumentFragment();

    for (var i = 0; i < announcements.length; i++) {
      mapPinsFragment.appendChild(generateMapPin(announcements[i]));
    }

    return mapPinsFragment;
  }

  window.generateMapPinsFragment = generateMapPinsFragment;
})();
