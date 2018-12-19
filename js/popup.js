'use strict';

(function () {
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');

  var main = document.querySelector('main');
  var currentPopup;

  function closePopup() {
    document.removeEventListener('keydown', onPopupEscPress);
    document.removeEventListener('click', onPopupClick);
    main.removeChild(currentPopup);
  }

  function onPopupEscPress(evt) {
    window.util.isEscEvent(evt, closePopup);
  }

  function onPopupClick(evt) {
    evt.preventDefault();

    closePopup();
  }

  function openPopup(popup) {
    document.addEventListener('keydown', onPopupEscPress);
    document.addEventListener('click', onPopupClick);

    currentPopup = popup;
    main.appendChild(popup);
  }

  function onErrorPopup(errorMessage) {
    var error = errorTemplate.cloneNode(true);

    error.querySelector('.error__message').textContent = 'Ошибка загрузки объявления: ' + errorMessage;
    error.querySelector('.error__button').addEventListener('click', function () {
      window.map.turnOnMap();
    });

    openPopup(error);
  }

  function onSuccessPopup() {
    var success = successTemplate.cloneNode(true);

    openPopup(success);
  }

  window.popup = {
    onErrorPopup: onErrorPopup,
    onSuccessPopup: onSuccessPopup
  };
})();
