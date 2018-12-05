'use strict';

(function () {
  var OFFER_TITLES = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];
  var OFFER_ADDRESS_COORDINATE_MIN = 0;
  var OFFER_ADDRESS_COORDINATE_MAX = 1000;
  var PRICE_MIN = 1000;
  var PRICE_MAX = 1000000;
  var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
  var ROOMS_QUANTITY_MIN = 1;
  var ROOMS_QUANTITY_MAX = 5;
  var QUESTS_QUANTITY_MIN = 1;
  var QUESTS_QUANTITY_MAX = 10;
  var CHECKINS = ['12:00', '13:00', '14:00'];
  var CHECKOUTS = ['12:00', '13:00', '14:00'];
  var ALL_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];
  var ANNOUNCEMENT_QUANTITY = 8;

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function randomSort() {
    return Math.random() - 0.5;
  }

  function getRandomElement(array, canRepeat) {
    var index = getRandomNumber(0, array.length);
    var element = array[index];

    if (!canRepeat) {
      array.splice(index, 1);
    }

    return element;
  }

  function generateRandomFeatures() {
    var array = [];

    for (var i = 0; i < getRandomNumber(1, ALL_FEATURES.length + 1); i++) {
      array.push(getRandomElement(ALL_FEATURES, false));
    }

    return array;
  }

  function generateAnnouncement(index, map, coordsConfines) {
    return {
      author: {
        avatar: 'img/avatars/user' + '0' + index + '.png'
      },
      offer: {
        title: getRandomElement(OFFER_TITLES, false),
        address:
          getRandomNumber(OFFER_ADDRESS_COORDINATE_MIN, OFFER_ADDRESS_COORDINATE_MAX + 1)
          + ', '
          + getRandomNumber(OFFER_ADDRESS_COORDINATE_MIN, OFFER_ADDRESS_COORDINATE_MAX + 1),
        price: getRandomNumber(PRICE_MIN, PRICE_MAX + 1),
        type: getRandomElement(OFFER_TYPE, true),
        rooms: getRandomNumber(ROOMS_QUANTITY_MIN, ROOMS_QUANTITY_MAX + 1),
        guests: getRandomNumber(QUESTS_QUANTITY_MIN, QUESTS_QUANTITY_MAX + 1),
        checkin: getRandomElement(CHECKINS, true),
        checkout: getRandomElement(CHECKOUTS, true),
        features: generateRandomFeatures(),
        description: '',
        photos: PHOTOS.sort(randomSort)
      },
      location: {
        x: getRandomNumber(0, map.offsetWidth + 1),
        y: getRandomNumber(coordsConfines.minY, coordsConfines.maxY + 1)
      }
    };
  }

  function generateAnnouncementList(map, coordsConfines) {
    var announcementList = [];

    for (var i = 0; i < ANNOUNCEMENT_QUANTITY; i++) {
      announcementList.push(generateAnnouncement(i + 1, map, coordsConfines));
    }

    return announcementList;
  }

  window.generateAnnouncementList = generateAnnouncementList;
})();
