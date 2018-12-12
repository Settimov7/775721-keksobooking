'use strict';

(function () {
  var Price = {
    LOW: 10000,
    HIGH: 50000
  };

  function compareFeatures(announcement, checkedFeatures) {
    var numberMatches = 0;

    for (var i = 0; i < checkedFeatures.length; i++) {
      for (var j = 0; j < announcement.offer.features.length; j++) {
        if (checkedFeatures[i].value === announcement.offer.features[j]) {
          numberMatches++;
        }
      }
    }

    if (numberMatches === checkedFeatures.length) {
      return true;
    } else {
      return false;
    }
  }

  function filterAnnouncements(filter, announcements) {
    var typeValue = filter.querySelector('#housing-type').value;
    var priceValue = filter.querySelector('#housing-price').value;
    var roomsValue = filter.querySelector('#housing-rooms').value;
    var guestsValue = filter.querySelector('#housing-guests').value;
    var checkedFeatures = filter.querySelectorAll('.map__checkbox:checked');

    var filteredAnnouncements = announcements
      .filter(function (announcement) {
        return (announcement.offer.type === typeValue || typeValue === 'any');
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
        return (announcement.offer.rooms === parseInt(roomsValue, 10) || roomsValue === 'any');
      })
      .filter(function (announcement) {
        return (announcement.offer.guests === parseInt(guestsValue, 10) || guestsValue === 'any');
      })
      .filter(function (announcement) {
        return compareFeatures(announcement, checkedFeatures);
      });

    return filteredAnnouncements;
  }

  window.filterAnnouncements = filterAnnouncements;
})();
