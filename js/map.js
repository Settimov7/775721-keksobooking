'use strict';

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
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var ANNOUNCEMENT_QUANTITY = 8;

var map = document.querySelector('.map');
var mapPins = map.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapCardTemplate = document.querySelector('#card').content.querySelector('.map__card');

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
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

  for (var i = 0; i < getRandomNumber(1, 9); i++) {
    array.push(getRandomElement(ALL_FEATURES, false));
  }

  return array;
}

function RandomSort() {
  return Math.random() - 0.5;
}

function generateAnnouncement(index) {
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
      photos: PHOTOS.sort(RandomSort)
    },
    location: {
      x: getRandomNumber(0, map.offsetWidth + 1),
      y: getRandomNumber(LOCATION_Y_MIN, LOCATION_Y_MAX + 1)
    }
  };
}

function generateAnnouncementList(quantity) {
  var announcementList = [];

  for (var i = 0; i < quantity; i++) {
    announcementList.push(generateAnnouncement(i + 1));
  }

  return announcementList;
}

function generateMapPin(announcement) {
  var mapPin = mapPinTemplate.cloneNode(true);

  mapPin.style.left = announcement.location.x - mapPin.offsetWidth / 2 + 'px';
  mapPin.style.top = announcement.location.y - mapPin.offsetHeight + 'px';
  mapPin.src = announcement.author.avatar;
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

function generateMapCard(announcement) {
  var mapCard = mapCardTemplate.cloneNode(true);
  var mapType = mapCard.querySelector('.popup__type');

  mapCard.querySelector('.popup__title').textContent = announcement.offer.title;
  mapCard.querySelector('.popup__text--address').textContent = announcement.offer.address;
  mapCard.querySelector('.popup__text--price').textContent = announcement.offer.price + '₽/ночь';
  switch (announcement.offer.type) {
    case 'flat': {
      mapType.textContent = 'Квартира';
      break;
    }

    case 'bungalo': {
      mapType.textContent = 'Бунгало';
      break;
    }

    case 'house': {
      mapType.textContent = 'Дом';
      break;
    }

    case 'palace': {
      mapType.textContent = 'Дворец';
      break;
    }

    default: {
      mapType.textContent = 'Неизвестно';
    }
  }
  mapCard.querySelector('.popup__text--capacity').textContent = announcement.offer.rooms + ' комнаты для ' + announcement.offer.guests + ' гостей';
  mapCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + announcement.offer.checkin + ', выезд до ' + announcement.offer.checkout;
  changeFeaturesElementsList(announcement.offer.features, mapCard);
  changePhototosElementList(announcement.offer.photos, mapCard);
  mapCard.querySelector('.popup__avatar').src = announcement.author.avatar;

  return mapCard;
}

function changeFeaturesElementsList(features, card) {
  var featuresElementsList = mapCardTemplate.querySelector('.popup__features').cloneNode(false);

  for (var i = 0; i < features.length; i++) {
    var featureElement = document.createElement('li');
    featureElement.classList.add('popup__feature');
    featureElement.classList.add('popup__feature--' + features[i]);
    featuresElementsList.appendChild(featureElement);
  }
  card.replaceChild(featuresElementsList, card.querySelector('.popup__features'));
}

function changePhototosElementList(photos, card) {
  var phototosElementList = mapCardTemplate.querySelector('.popup__photos').cloneNode(false);

  for (var i = 0; i < photos.length; i++) {
    var photoElement = mapCardTemplate.querySelector('.popup__photo').cloneNode(false);
    photoElement.src = photos[i];
    phototosElementList.appendChild(photoElement);
  }
  card.replaceChild(phototosElementList, card.querySelector('.popup__photos'));
}

function showElement(element) {
  element.classList.remove('map--faded');
}

showElement(map);
var allAnnouncement = generateAnnouncementList(ANNOUNCEMENT_QUANTITY);
mapPins.appendChild(generateMapPinsFragment(allAnnouncement));
map.insertBefore(generateMapCard(allAnnouncement[0]), map.querySelector('.map__filters-container'));
