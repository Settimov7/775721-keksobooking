'use strict';

(function () {
  var ClassName = {
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

  var template = document.querySelector('#card').content.querySelector('.' + ClassName.CARD);

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
    var featuresElement = card.querySelector('.' + ClassName.FEATURES);

    if (features.length) {
      var featuresElementsList = template.querySelector('.' + ClassName.FEATURES).cloneNode(false);

      features.forEach(function (feature) {
        var featureElement = document.createElement('li');
        featureElement.classList.add(ClassName.FEATURE);
        featureElement.classList.add(ClassName.FEATURE + '--' + feature);
        featuresElementsList.appendChild(featureElement);
      });

      card.replaceChild(featuresElementsList, featuresElement);
    } else {
      card.removeChild(featuresElement);
    }
  }

  function generatePhotos(card, photos) {
    var photosElement = card.querySelector('.' + ClassName.PHOTOS);

    if (photos.length) {
      var phototosElementList = template.querySelector('.' + ClassName.PHOTOS).cloneNode(false);

      photos.forEach(function (photo) {
        var photoElement = template.querySelector('.' + ClassName.PHOTO).cloneNode(false);
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

  function generateCard(announcement) {
    var card = template.cloneNode(true);

    generateTextContent(card.querySelector('.' + ClassName.TITLE), announcement.offer.title);
    generateTextContent(card.querySelector('.' + ClassName.ADDRESS), announcement.offer.address);
    generateTextContent(card.querySelector('.' + ClassName.PRICE), announcement.offer.price + '₽/ночь');
    generateOfferType(card.querySelector('.' + ClassName.TYPE), announcement.offer.type);
    generateCapacity(card.querySelector('.' + ClassName.CAPACITY), announcement.offer.rooms, announcement.offer.guests);
    generateTime(card.querySelector('.' + ClassName.TIME), announcement.offer.checkin, announcement.offer.checkout);
    generateFeatures(card, announcement.offer.features);
    generatePhotos(card, announcement.offer.photos);
    generateAvatar(card.querySelector('.' + ClassName.AVATAR), announcement.author.avatar);

    return card;
  }

  function checkLocation(element, announcement) {
    var elementX = parseInt(element.style.left, 10);
    var elementY = parseInt(element.style.top, 10);
    var announcementX = parseInt(announcement.location.x, 10);
    var announcementY = parseInt(announcement.location.y, 10);

    return elementX === announcementX && elementY === announcementY;
  }

  function onEscPress(evt) {
    window.util.isEscEvent(evt, remove);
  }

  function remove() {
    var oldCard = document.querySelector('.' + ClassName.CARD);

    if (oldCard) {
      oldCard.parentNode.removeChild(oldCard);
    }

    document.removeEventListener('keydown', onEscPress);
  }


  function change(map, element, announcements) {
    remove();

    for (var i = 0; i < announcements.length; i++) {
      if (checkLocation(element, announcements[i])) {
        var newCard = generateCard(announcements[i]);
        break;
      }
    }

    map.insertBefore(newCard, map.querySelector('.map__filters-container'));

    newCard.querySelector('.' + ClassName.CLOSE).addEventListener('click', function () {
      map.removeChild(newCard);
    });

    document.addEventListener('keydown', onEscPress);
  }

  window.card = {
    change: change,
    remove: remove
  };
})();
