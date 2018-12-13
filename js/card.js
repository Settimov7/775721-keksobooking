'use strict';

(function () {
  var FEATURES_ELEMENT_CLASS_NAME = '.popup__features';
  var PHOTOS_ELEMENT_CLASS_NAME = '.popup__photos';

  var typeToText = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец',
    unknown: 'Неизвестно'
  };

  var mapCardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  function generateTextContent(element, text) {
    if (text) {
      element.textContent = text;
    }
  }

  function generateOfferType(typeElement, type) {
    typeElement.textContent = typeToText[type];
  }

  function generateCapacity(element, rooms, guests) {
    if (rooms && guests) {
      generateTextContent(element, rooms + ' комнаты для ' + guests + ' гостей');
    }
  }

  function generateTime(element, checkin, checkout) {
    if (checkin && checkout) {
      generateTextContent(element, 'Заезд после ' + checkin + ', выезд до ' + checkout);
    }
  }

  function generateFeatures(card, features) {
    var featuresElement = card.querySelector(FEATURES_ELEMENT_CLASS_NAME);

    if (features.length) {
      var featuresElementsList = mapCardTemplate.querySelector(FEATURES_ELEMENT_CLASS_NAME).cloneNode(false);

      features.forEach(function (feature) {
        var featureElement = document.createElement('li');
        featureElement.classList.add('popup__feature');
        featureElement.classList.add('popup__feature--' + feature);
        featuresElementsList.appendChild(featureElement);
      });

      card.replaceChild(featuresElementsList, featuresElement);
    } else {
      card.removeChild(featuresElement);
    }
  }

  function generatePhotos(card, photos) {
    var photosElement = card.querySelector(PHOTOS_ELEMENT_CLASS_NAME);

    if (photos.length) {
      var phototosElementList = mapCardTemplate.querySelector(PHOTOS_ELEMENT_CLASS_NAME).cloneNode(false);

      photos.forEach(function (photo) {
        var photoElement = mapCardTemplate.querySelector('.popup__photo').cloneNode(false);
        photoElement.src = photo;
        phototosElementList.appendChild(photoElement);
      });

      card.replaceChild(phototosElementList, photosElement);
    } else {
      card.removeChild(photosElement);
    }
  }

  function generateAvatar(element, avatar) {
    if (avatar) {
      element.src = avatar;
    }
  }

  function generateMapCard(announcement) {
    var mapCard = mapCardTemplate.cloneNode(true);

    generateTextContent(mapCard.querySelector('.popup__title'), announcement.offer.title);
    generateTextContent(mapCard.querySelector('.popup__text--address'), announcement.offer.address);
    generateTextContent(mapCard.querySelector('.popup__text--price'), announcement.offer.price + '₽/ночь');
    generateOfferType(mapCard.querySelector('.popup__type'), announcement.offer.type);
    generateCapacity(mapCard.querySelector('.popup__text--capacity'), announcement.offer.rooms, announcement.offer.guests);
    generateTime(mapCard.querySelector('.popup__text--time'), announcement.offer.checkin, announcement.offer.checkout);
    generateFeatures(mapCard, announcement.offer.features);
    generatePhotos(mapCard, announcement.offer.photos);
    generateAvatar(mapCard.querySelector('.popup__avatar'), announcement.author.avatar);

    return mapCard;
  }

  function checkLocation(element, announcement) {
    var elementX = parseInt(element.style.left, 10);
    var elementY = parseInt(element.style.top, 10);
    var announcementX = parseInt(announcement.location.x, 10);
    var announcementY = parseInt(announcement.location.y, 10);

    return elementX === announcementX && elementY === announcementY;
  }

  function removeMapCard(map) {
    var oldCard = map.querySelector('.map__card');

    if (oldCard) {
      map.removeChild(oldCard);
    }
  }

  function changeMapCard(map, element, announcements) {
    removeMapCard(map);

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

  window.card = {
    changeMapCard: changeMapCard,
    removeMapCard: removeMapCard
  };
})();
