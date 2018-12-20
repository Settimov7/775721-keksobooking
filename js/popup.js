'use strict';

(function () {
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');

  var main = document.querySelector('main');
  var currentPopup;

  function close() {
    document.removeEventListener('keydown', onEscPress);
    document.removeEventListener('click', onClick);
    main.removeChild(currentPopup);
  }

  function onEscPress(evt) {
    window.util.isEscEvent(evt, close);
  }

  function onClick(evt) {
    evt.preventDefault();

    close();
  }

  function open(popup) {
    document.addEventListener('keydown', onEscPress);
    document.addEventListener('click', onClick);

    currentPopup = popup;
    main.appendChild(popup);
  }

  function showError(errorMessage, action) {
    var error = errorTemplate.cloneNode(true);

    error.querySelector('.error__message').textContent = 'Ошибка загрузки объявления: ' + errorMessage;
    error.querySelector('.error__button').addEventListener('click', function () {
      action();
    });

    open(error);
  }

  function showSuccess() {
    var success = successTemplate.cloneNode(true);

    open(success);
  }

  window.popup = {
    showError: showError,
    showSuccess: showSuccess
  };
})();
