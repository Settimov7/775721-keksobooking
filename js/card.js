'use strict';

(function () {
  var mapCardTemplate = document.querySelector('#card').content.querySelector('.map__card');

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

  window.generateMapCard = generateMapCard;
})();
