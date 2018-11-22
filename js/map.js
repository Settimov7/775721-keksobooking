// В файле map.js:
// Создайте массив, состоящий из 8 сгенерированных JS объектов, которые будут описывать похожие объявления неподалёку. Структура объектов должна быть следующей:
// {
//   "author": {
//     "avatar": строка, адрес изображения вида img/avatars/user{{xx}}.png, где {{xx}} это число от 1 до 8 с ведущим нулём. Например, 01, 02 и т. д. Адреса изображений не повторяются
//   },

//   "offer": {
//     "title": строка, заголовок предложения, одно из фиксированных значений "Большая уютная квартира", "Маленькая неуютная квартира",
//              "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик",
//              "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде". Значения не должны повторяться.
//     "address": строка, адрес предложения, представляет собой запись вида "{{location.x}}, {{location.y}}", например, "600, 350"
//     "price": число, случайная цена от 1000 до 1 000 000
//     "type": строка с одним из четырёх фиксированных значений: palace, flat, house или bungalo
//     "rooms": число, случайное количество комнат от 1 до 5
//     "guests": число, случайное количество гостей, которое можно разместить
//     "checkin": строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00,
//     "checkout": строка с одним из трёх фиксированных значений: 12:00, 13:00 или 14:00
//     "features": массив строк случайной длины из ниже предложенных: "wifi", "dishwasher", "parking", "washer", "elevator", "conditioner",
//     "description": пустая строка,
//     "photos": массив из строк "http://o0.github.io/assets/images/tokyo/hotel1.jpg", "http://o0.github.io/assets/images/tokyo/hotel2.jpg" и
//               "http://o0.github.io/assets/images/tokyo/hotel3.jpg" расположенных в произвольном порядке
//   },

//   "location": {
//     «x»: случайное число, координата x метки на карте. Значение ограничено размерами блока, в котором перетаскивается метка.
//     «y»: случайное число, координата y метки на карте от 130 до 630.
//   }
// }

// У блока .map уберите класс .map--faded.
// Это временное решение, этот класс переключает карту из неактивного состояния в активное. В последующих заданиях, в соответствии с ТЗ вы будете переключать режимы страницы:
// неактивный, в котором карта и обе формы заблокированы и активный режим, в котором производится ввод данных и просмотр похожих объявлений.
// Сейчас, для тестирования функции генерации похожих объявлений мы временно сымитируем активный режим, а в последующих разделах запрограммируем его полностью.
// На основе данных, созданных в первом пункте, создайте DOM-элементы, соответствующие меткам на карте, и заполните их данными из массива.
// Итоговую разметку метки .map__pin можно взять из шаблона .map__card.

// У метки должны быть следующие данные:
// Координаты:style="left: {{location.x}}px; top: {{location.y}}px;"
// src="{{author.avatar}}"
// alt="{{заголовок объявления}}"
// Обратите внимание

// Координаты X и Y, которые вы вставите в разметку, это не координаты левого верхнего угла блока метки, а координаты, на которые указывает метка своим острым концом.
// Чтобы найти эту координату нужно учесть размеры элемента с меткой.
// Отрисуйте сгенерированные DOM-элементы в блок .map__pins. Для вставки элементов используйте DocumentFragment.

// На основе первого по порядку элемента из сгенерированного массива и шаблона .map__card создайте DOM-элемент объявления,
// заполните его данными из объекта и вставьте полученный DOM-элемент в блок .map перед блоком.map__filters-container:
// Выведите заголовок объявления offer.title в заголовок .popup__title.
// Выведите адрес offer.address в блок .popup__text--address.
// Выведите цену offer.price в блок .popup__text--price строкой вида {{offer.price}}₽/ночь. Например, 5200₽/ночь.
// В блок .popup__type выведите тип жилья offer.type: Квартира для flat, Бунгало для bungalo, Дом для house, Дворец для palace.
// Выведите количество гостей и комнат offer.rooms и offer.guests в блок .popup__text--capacity строкой вида {{offer.rooms}} комнаты для {{offer.guests}} гостей.
// Например, 2 комнаты для 3 гостей.
// Время заезда и выезда offer.checkin и offer.checkout в блок .popup__text--time строкой вида Заезд после {{offer.checkin}}, выезд до {{offer.checkout}}.
// Например, заезд после 14:00, выезд до 12:00.
// В список .popup__features выведите все доступные удобства в объявлении.
// В блок .popup__description выведите описание объекта недвижимости offer.description.
// В блок .popup__photos выведите все фотографии из списка offer.photos. Каждая из строк массива photos должна записываться как src соответствующего изображения.
// Замените src у аватарки пользователя — изображения, которое записано в .popup__avatar — на значения поля author.avatar отрисовываемого объекта.

'use strict';

var AVATAR_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];
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

function generateAnnouncement() {
  return {
    author: {
      avatar: 'img/avatars/user' + '0' + getRandomElement(AVATAR_NUMBERS, false) + '.png'
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
    announcementList.push(generateAnnouncement());
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

  mapCard.querySelector('.popup__title').textContent = announcement.offer.title;
  mapCard.querySelector('.popup__text--address').textContent = announcement.offer.address;
  mapCard.querySelector('.popup__text--price').textContent = announcement.offer.price + '₽/ночь';
  switch (announcement.offer.type) {
    case 'flat': {
      mapCard.querySelector('.popup__type').textContent = 'Квартира';
      break;
    }

    case 'bungalo': {
      mapCard.querySelector('.popup__type').textContent = 'Бунгало';
      break;
    }

    case 'house': {
      mapCard.querySelector('.popup__type').textContent = 'Дом';
      break;
    }

    case 'palace': {
      mapCard.querySelector('.popup__type').textContent = 'Дворец';
      break;
    }

    default: {
      mapCard.querySelector('.popup__type').textContent = 'Неизвестно';
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

map.classList.remove('map--faded');
var allAnnouncement = generateAnnouncementList(ANNOUNCEMENT_QUANTITY);
mapPins.appendChild(generateMapPinsFragment(allAnnouncement));
console.log(generateMapCard(allAnnouncement[0]));
map.insertBefore(generateMapCard(allAnnouncement[0]), map.querySelector('.map__filters-container'));
