'use strict';

(function () {
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var main = document.querySelector('main');

  function closePopup() {
    var successPopup = document.querySelector('.success');
    var errorPopup = document.querySelector('.error');

    document.removeEventListener('keydown', onPopupEscPress);
    document.removeEventListener('click', onPopupClick);

    if (successPopup) {
      main.removeChild(successPopup);
    }

    if (errorPopup) {
      main.removeChild(errorPopup);
    }
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

    main.appendChild(popup);
  }

  function onErrorPopup(errorMessage) {
    var error = errorTemplate.cloneNode(true);
    error.querySelector('.error__message').textContent = 'Ошибка загрузки объявления: ' + errorMessage;

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
