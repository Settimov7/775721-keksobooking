'use strict';

(function () {
  var Price = {
    LOW: 10000,
    HIGH: 50000
  };

  var STANDART_VALUE = 'any';

  var filter = document.querySelector('.map__filters');
  var typeField = filter.querySelector('#housing-type');
  var priceField = filter.querySelector('#housing-price');
  var roomsField = filter.querySelector('#housing-rooms');
  var guestsField = filter.querySelector('#housing-guests');
  var features = filter.querySelector('#housing-features');
  var featuresCheckboxes = features.querySelectorAll('.map__checkbox');

  function compareFeatures(announcement, checkedFeatures) {
    var numberMatches = 0;

    for (var i = 0; i < checkedFeatures.length; i++) {
      for (var j = 0; j < announcement.offer.features.length; j++) {
        if (checkedFeatures[i].value === announcement.offer.features[j]) {
          numberMatches++;
        }
      }
    }

    return numberMatches === checkedFeatures.length;
  }

  function filterAnnouncements(announcements) {
    var typeValue = typeField.value;
    var priceValue = priceField.value;
    var roomsValue = roomsField.value;
    var guestsValue = guestsField.value;
    var checkedFeatures = features.querySelectorAll('.map__checkbox:checked');

    var filteredAnnouncements = announcements
      .filter(function (announcement) {
        return (announcement.offer.type === typeValue || typeValue === STANDART_VALUE);
      })
      .filter(function (announcement) {
        if (priceValue === 'any') {
          return true;
        }

        if (priceValue === 'middle') {
          return (announcement.offer.price >= Price.LOW && announcement.offer.price <= Price.HIGH);
        }

        if (priceValue === 'low') {
          return (announcement.offer.price < Price.LOW);
        }

        if (priceValue === 'high') {
          return (announcement.offer.price > Price.HIGH);
        }

        return false;
      })
      .filter(function (announcement) {
        return (announcement.offer.rooms === parseInt(roomsValue, 10) || roomsValue === STANDART_VALUE);
      })
      .filter(function (announcement) {
        return (announcement.offer.guests === parseInt(guestsValue, 10) || guestsValue === STANDART_VALUE);
      })
      .filter(function (announcement) {
        return compareFeatures(announcement, checkedFeatures);
      });

    return filteredAnnouncements;
  }

  function addChangeHandler(map, announcements) {
    function onFilterChanged(evt) {
      evt.preventDefault();
      window.pin.update(map, filterAnnouncements(announcements));
    }

    filter.addEventListener('change', window.debounce(onFilterChanged));
  }

  function turnOn(map, announcements) {
    window.util.turnOnElements(filter.querySelectorAll('select'));
    window.util.turnOnElements(filter.querySelectorAll('fieldset'));

    addChangeHandler(map, announcements);
  }

  function reset() {
    typeField.value = STANDART_VALUE;
    priceField.value = STANDART_VALUE;
    roomsField.value = STANDART_VALUE;
    guestsField.value = STANDART_VALUE;

    for (var i = 0; i < featuresCheckboxes.length; i++) {
      featuresCheckboxes[i].checked = false;
    }
  }

  function turnOff() {
    reset();
    window.util.turnOffElements(filter.querySelectorAll('select'));
    window.util.turnOffElements(filter.querySelectorAll('fieldset'));
  }

  window.filter = {
    turnOn: turnOn,
    turnOff: turnOff
  };
})();
