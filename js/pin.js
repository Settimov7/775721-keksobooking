'use strict';

(function () {
  var MAX_QUANTITY = 5;

  var Data = {
    HEIGHT: 84,
    START_LEFT: 570,
    START_TOP: 375,
    MIN_Y: 130,
    MAX_Y: 630
  };

  var ClassName = {
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


  var template = document.querySelector('#pin').content.querySelector('.' + ClassName.PIN);
  var list = document.querySelector('.' + ClassName.LIST);
  var main = list.querySelector('.' + ClassName.MAIN_PIN);

  function checkAnnoucement(announcement) {
    return (announcement.location.x && announcement.location.y && announcement.author.avatar && announcement.offer.description);
  }

  function generatePin(announcement) {
    var mapPin = template.cloneNode(true);

    if (checkAnnoucement(announcement)) {
      mapPin.style.left = announcement.location.x - mapPin.offsetWidth / 2 + 'px';
      mapPin.style.top = announcement.location.y - mapPin.offsetHeight + 'px';
      mapPin.querySelector('img').src = announcement.author.avatar;
      mapPin.alt = announcement.offer.description;
    }

    return mapPin;
  }

  function generatePinsFragment(announcements) {
    var mapPinsFragment = document.createDocumentFragment();
    var mapPinsContaier = document.createElement('div');

    mapPinsContaier.classList.add(ClassName.USER_CONTAINER);

    for (var i = 0; (i < announcements.length && i < MAX_QUANTITY); i++) {
      mapPinsContaier.appendChild(generatePin(announcements[i]));
    }

    mapPinsFragment.appendChild(mapPinsContaier);

    return mapPinsFragment;
  }

  function getElementWidth(element) {
    return element.getBoundingClientRect().right - element.getBoundingClientRect().left;
  }

  function getCurrentAddress() {
    return Math.round(main.getBoundingClientRect().left + pageXOffset + getElementWidth(main) / 2 - window.map.getBoundingRect().left).toString()
            + ', ' + (main.getBoundingClientRect().top + pageYOffset + Data.HEIGHT).toString();
  }

  function checkCoords(newPosition) {
    return (newPosition.top >= (Data.MIN_Y - Data.HEIGHT) && newPosition.top <= Data.MAX_Y - Data.HEIGHT &&
            newPosition.left >= 0 && newPosition.left <= (window.map.getBoundingRect().right - window.map.getBoundingRect().left) - getElementWidth(main));
  }

  function startDrag(evt) {
    evt.preventDefault();

    var startCoords = new Coords(evt.clientX, evt.clientY);

    if (window.map.checkStatus()) {
      window.map.turnOn();
    }

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var shift = new Coords(startCoords.getX() - moveEvt.clientX, startCoords.getY() - moveEvt.clientY);

      startCoords.setX(moveEvt.clientX);
      startCoords.setY(moveEvt.clientY);

      var newPosition = {
        top: main.offsetTop - shift.getY(),
        left: main.offsetLeft - shift.getX()
      };

      if (checkCoords(newPosition)) {
        window.form.setAdress(getCurrentAddress());
        main.style.top = newPosition.top + 'px';
        main.style.left = newPosition.left + 'px';
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

  function addDrag() {
    main.addEventListener('mousedown', startDrag);
  }

  function addClickHandler(map, announcements) {
    function onMapPinClick(evt) {
      var target = evt.target;
      var parentElement = target.closest('.' + ClassName.PIN);

      if (announcements && parentElement && !parentElement.classList.contains(ClassName.MAIN_PIN)) {
        evt.preventDefault();

        activate(parentElement);
        window.card.change(map, parentElement, announcements);
      }
    }

    map.addEventListener('click', onMapPinClick);
  }

  function show(map, announcements) {
    list.appendChild(generatePinsFragment(announcements));
    addClickHandler(map, announcements);
  }

  function remove() {
    var mapPinsContaier = list.querySelector('.' + ClassName.USER_CONTAINER);

    if (mapPinsContaier) {
      list.removeChild(mapPinsContaier);
    }
  }

  function update(map, announcements) {
    window.card.remove(map);
    remove(map);
    list.appendChild(generatePinsFragment(announcements));
  }

  function activate(mapPin) {
    var oldActiveMapPin = document.querySelector('.' + ClassName.ACTIVE);

    if (oldActiveMapPin) {
      oldActiveMapPin.classList.remove(ClassName.ACTIVE);
    }

    mapPin.classList.add(ClassName.ACTIVE);
  }

  function reset() {
    main.style.left = Data.START_LEFT + 'px';
    main.style.top = Data.START_TOP + 'px';

    window.form.setAdress(getCurrentAddress());
  }

  window.pin = {
    addDrag: addDrag,
    show: show,
    remove: remove,
    update: update,
    reset: reset
  };
})();
