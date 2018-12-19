'use strict';

(function () {
  var CardElementClassName = {
    CARD: 'map__card',
    TITLE: 'popup__title',
    ADDRESS: 'popup__text--address',
    PRICE: 'popup__text--price',
    TYPE: 'popup__type',
    CAPACITY: 'popup__text--capacity',
    TIME: 'popup__text--time',
    FEATURES: 'popup__features',
    FEATURE: 'popup__feature',
    PHOTOS: 'popup__photos',
    PHOTO: 'popup__photo',
    AVATAR: 'popup__avatar',
    CLOSE: 'popup__close'
  };

  var typeToText = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец',
    unknown: 'Неизвестно'
  };

  var mapCardTemplate = document.querySelector('#card').content.querySelector('.' + CardElementClassName.CARD);

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
    var featuresElement = card.querySelector('.' + CardElementClassName.FEATURES);

    if (features.length) {
      var featuresElementsList = mapCardTemplate.querySelector('.' + CardElementClassName.FEATURES).cloneNode(false);

      features.forEach(function (feature) {
        var featureElement = document.createElement('li');
        featureElement.classList.add(CardElementClassName.FEATURE);
        featureElement.classList.add(CardElementClassName.FEATURE + '--' + feature);
        featuresElementsList.appendChild(featureElement);
      });

      card.replaceChild(featuresElementsList, featuresElement);
    } else {
      card.removeChild(featuresElement);
    }
  }

  function generatePhotos(card, photos) {
    var photosElement = card.querySelector('.' + CardElementClassName.PHOTOS);

    if (photos.length) {
      var phototosElementList = mapCardTemplate.querySelector('.' + CardElementClassName.PHOTOS).cloneNode(false);

      photos.forEach(function (photo) {
        var photoElement = mapCardTemplate.querySelector('.' + CardElementClassName.PHOTO).cloneNode(false);
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

    generateTextContent(mapCard.querySelector('.' + CardElementClassName.TITLE), announcement.offer.title);
    generateTextContent(mapCard.querySelector('.' + CardElementClassName.ADDRESS), announcement.offer.address);
    generateTextContent(mapCard.querySelector('.' + CardElementClassName.PRICE), announcement.offer.price + '₽/ночь');
    generateOfferType(mapCard.querySelector('.' + CardElementClassName.TYPE), announcement.offer.type);
    generateCapacity(mapCard.querySelector('.' + CardElementClassName.CAPACITY), announcement.offer.rooms, announcement.offer.guests);
    generateTime(mapCard.querySelector('.' + CardElementClassName.TIME), announcement.offer.checkin, announcement.offer.checkout);
    generateFeatures(mapCard, announcement.offer.features);
    generatePhotos(mapCard, announcement.offer.photos);
    generateAvatar(mapCard.querySelector('.' + CardElementClassName.AVATAR), announcement.author.avatar);

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
    var oldCard = map.querySelector('.' + CardElementClassName.CARD);

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
    newCard.querySelector('.' + CardElementClassName.CLOSE).addEventListener('click', function () {
      map.removeChild(newCard);
    });
  }

  window.card = {
    changeMapCard: changeMapCard,
    removeMapCard: removeMapCard
  };
})();
