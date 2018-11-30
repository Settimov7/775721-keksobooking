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
var mainPin = mapPins.querySelector('.map__pin--main');
var mapFilter = document.querySelector('.map__filters');

var adForm = document.querySelector('.ad-form');
var inputType = adForm.querySelector('#type');
var inputPrice = adForm.querySelector('#price');
var inputTimeIn = adForm.querySelector('#timein');
var inputTimeOut = adForm.querySelector('#timeout');
var inputRoomNumber = adForm.querySelector('#room_number');
var inputCapacity = adForm.querySelector('#capacity');

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

  for (var i = 0; i < getRandomNumber(1, ALL_FEATURES.length + 1); i++) {
    array.push(getRandomElement(ALL_FEATURES, false));
  }

  return array;
}

function randomSort() {
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
      photos: PHOTOS.sort(randomSort)
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

function turnOnElements(elements) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = false;
  }
}

function onMainPinClick(evt) {
  evt.preventDefault();

  showElement(map);
  adForm.classList.remove('ad-form--disabled');
  turnOnElements(adForm.querySelectorAll('fieldset'));
  turnOnElements(mapFilter.querySelectorAll('select'));
  turnOnElements(mapFilter.querySelectorAll('fieldset'));
}

function getCurrentAddress() {
  return (mainPin.getBoundingClientRect().left + pageXOffset + mainPin.offsetWidth / 2).toString()
          + ', ' + (mainPin.getBoundingClientRect().top + pageYOffset + mainPin.offsetHeight).toString();
}

function checkLocation(element, announcement) {
  var elementX = Number(element.style.left.substring(0, element.style.left.length - 2));
  var elementY = Number(element.style.top.substring(0, element.style.top.length - 2));
  var announcementX = Number(announcement.location.x);
  var announcementY = Number(announcement.location.y);

  return elementX === announcementX && elementY === announcementY;
}

function changeMapCard(element, announcements) {
  var oldCard = map.querySelector('.map__card');

  if (oldCard) {
    map.removeChild(oldCard);
  }

  for (var i = 0; i < announcements.length; i++) {
    if (checkLocation(element, announcements[i])) {
      var newCard = generateMapCard(announcements[i]);
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

function showMapPins() {
  mapPins.appendChild(allMapPins);
  mainPin.removeEventListener('click', showMapPins);
}

function changeMinPrice() {
  switch (inputType.value) {
    case 'bungalo': {
      inputPrice.min = 0;
      inputPrice.placeholder = 0;
      break;
    }

    case 'flat': {
      inputPrice.min = 1000;
      inputPrice.placeholder = 1000;
      break;
    }

    case 'house': {
      inputPrice.min = 5000;
      inputPrice.placeholder = 5000;
      break;
    }

    case 'palace': {
      inputPrice.min = 10000;
      inputPrice.placeholder = 10000;
      break;
    }

    default: {
      break;
    }
  }
}

function changeTimeOut() {
  switch (inputTimeIn.value) {
    case '12:00': {
      inputTimeOut.value = '12:00';
      break;
    }

    case '13:00': {
      inputTimeOut.value = '13:00';
      break;
    }

    case '14:00': {
      inputTimeOut.value = '14:00';
      break;
    }

    default: {
      break;
    }
  }
}

function changeTimeIn() {
  switch (inputTimeOut.value) {
    case '12:00': {
      inputTimeIn.value = '12:00';
      break;
    }

    case '13:00': {
      inputTimeIn.value = '13:00';
      break;
    }

    case '14:00': {
      inputTimeIn.value = '14:00';
      break;
    }

    default: {
      break;
    }
  }
}

function changeCapacity() {
  switch (inputRoomNumber.value) {
    case '1': {
      inputCapacity.querySelector('option[value="1"]').disabled = false;
      inputCapacity.querySelector('option[value="2"]').disabled = true;
      inputCapacity.querySelector('option[value="3"]').disabled = true;
      inputCapacity.querySelector('option[value="0"]').disabled = true;
      inputCapacity.querySelector('option[value="1"]').selected = true;
      break;
    }

    case '2': {
      inputCapacity.querySelector('option[value="1"]').disabled = false;
      inputCapacity.querySelector('option[value="2"]').disabled = false;
      inputCapacity.querySelector('option[value="3"]').disabled = true;
      inputCapacity.querySelector('option[value="0"]').disabled = true;
      inputCapacity.querySelector('option[value="1"]').selected = true;
      break;
    }

    case '3': {
      inputCapacity.querySelector('option[value="1"]').disabled = false;
      inputCapacity.querySelector('option[value="2"]').disabled = false;
      inputCapacity.querySelector('option[value="3"]').disabled = false;
      inputCapacity.querySelector('option[value="0"]').disabled = true;
      inputCapacity.querySelector('option[value="1"]').selected = true;
      break;
    }

    case '100': {
      inputCapacity.querySelector('option[value="1"]').disabled = true;
      inputCapacity.querySelector('option[value="2"]').disabled = true;
      inputCapacity.querySelector('option[value="3"]').disabled = true;
      inputCapacity.querySelector('option[value="0"]').disabled = false;
      inputCapacity.querySelector('option[value="0"]').selected = true;
      break;
    }

    default: {
      break;
    }
  }
}

mainPin.addEventListener('click', onMainPinClick);
mainPin.addEventListener('click', showMapPins);

mainPin.addEventListener('mouseup', function (evt) {
  evt.preventDefault();

  adForm.querySelector('#address').value = getCurrentAddress();
});

map.addEventListener('click', onMapPinClick);

var allAnnouncement = generateAnnouncementList(ANNOUNCEMENT_QUANTITY);
var allMapPins = generateMapPinsFragment(allAnnouncement);

inputType.addEventListener('change', changeMinPrice);
inputTimeIn.addEventListener('change', changeTimeOut);
inputTimeOut.addEventListener('change', changeTimeIn);
inputRoomNumber.addEventListener('change', changeCapacity);
