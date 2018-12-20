'use strict';

(function () {
  var MAX_PINS = 5;

  var MainPinData = {
    HEIGHT: 84,
    START_LEFT: 570,
    START_TOP: 375,
    MIN_Y: 130,
    MAX_Y: 630
  };

  var PinClassName = {
    PIN: 'map__pin',
    MAIN_PIN: 'map__pin--main',
    ACTIVE: 'map__pin--active',
    LIST: 'map__pins',
    USER_CONTAINER: 'map__user-pins-container'
  };

  function Coords(x, y) {
    this.x = x;
    this.y = y;
  }

  Coords.prototype = {
    setX: function (x) {
      this.x = x;
    },

    getX: function () {
      return this.x;
    },

    setY: function (y) {
      this.y = y;
    },

    getY: function () {
      return this.y;
    }
  };


  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.' + PinClassName.PIN);
  var mapPinsList = document.querySelector('.' + PinClassName.LIST);
  var mainPin = mapPinsList.querySelector('.' + PinClassName.MAIN_PIN);

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

    mapPinsContaier.classList.add(PinClassName.USER_CONTAINER);

    for (var i = 0; (i < announcements.length && i < MAX_PINS); i++) {
      mapPinsContaier.appendChild(generateMapPin(announcements[i]));
    }

    mapPinsFragment.appendChild(mapPinsContaier);

    return mapPinsFragment;
  }

  function getElementWidth(element) {
    return element.getBoundingClientRect().right - element.getBoundingClientRect().left;
  }

  function getCurrentAddress() {
    return Math.round(mainPin.getBoundingClientRect().left + pageXOffset + getElementWidth(mainPin) / 2 - window.map.getMapBoundingRect().left).toString()
            + ', ' + (mainPin.getBoundingClientRect().top + pageYOffset + MainPinData.HEIGHT).toString();
  }

  function checkMainPinCoords(newPosition) {
    return (newPosition.top >= (MainPinData.MIN_Y - MainPinData.HEIGHT) && newPosition.top <= MainPinData.MAX_Y - MainPinData.HEIGHT &&
            newPosition.left >= 0 && newPosition.left <= (window.map.getMapBoundingRect().right - window.map.getMapBoundingRect().left) - getElementWidth(mainPin));
  }

  function dragMainPin(evt) {
    evt.preventDefault();

    var startCoords = new Coords(evt.clientX, evt.clientY);

    if (window.map.checkStatusMap()) {
      window.map.turnOnMap();
    }

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var shift = new Coords(startCoords.getX() - moveEvt.clientX, startCoords.getY() - moveEvt.clientY);

      startCoords.setX(moveEvt.clientX);
      startCoords.setY(moveEvt.clientY);

      var newPosition = {
        top: mainPin.offsetTop - shift.getY(),
        left: mainPin.offsetLeft - shift.getX()
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

  function addDragMainPin() {
    mainPin.addEventListener('mousedown', dragMainPin);
  }

  function addPinClickHandler(map, announcements) {
    function onMapPinClick(evt) {
      var target = evt.target;
      var parentElement = target.closest('.' + PinClassName.PIN);

      if (announcements && parentElement && !parentElement.classList.contains(PinClassName.MAIN_PIN)) {
        evt.preventDefault();

        activateMapPin(parentElement);
        window.card.changeMapCard(map, parentElement, announcements);
      }
    }

    map.addEventListener('click', onMapPinClick);
  }

  function showMapPins(map, announcements) {
    mapPinsList.appendChild(generateMapPinsFragment(announcements));
    addPinClickHandler(map, announcements);
  }

  function removeMapPins() {
    var mapPinsContaier = mapPinsList.querySelector('.' + PinClassName.USER_CONTAINER);

    if (mapPinsContaier) {
      mapPinsList.removeChild(mapPinsContaier);
    }
  }

  function updateMapPins(map, announcements) {
    window.card.removeMapCard(map);
    removeMapPins(map);
    showMapPins(map, announcements);
  }

  function activateMapPin(mapPin) {
    var oldActiveMapPin = document.querySelector('.' + PinClassName.ACTIVE);

    if (oldActiveMapPin) {
      oldActiveMapPin.classList.remove(PinClassName.ACTIVE);
    }

    mapPin.classList.add(PinClassName.ACTIVE);
  }

  function resetMainPin() {
    mainPin.style.left = MainPinData.START_LEFT + 'px';
    mainPin.style.top = MainPinData.START_TOP + 'px';

    window.form.setAdress(getCurrentAddress());
  }

  window.pin = {
    addDragMainPin: addDragMainPin,
    showMapPins: showMapPins,
    removeMapPins: removeMapPins,
    updateMapPins: updateMapPins,
    resetMainPin: resetMainPin
  };
})();
