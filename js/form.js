'use strict';

(function () {
  var SAVE_URL = 'https://js.dump.academy/keksobooking';
  var MIN_PRICE = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var TIME_VALUES = ['12:00', '13:00', '14:00'];

  function addFormChangeListeners(form) {
    var inputTitle = form.querySelector('#title');
    var inputAdress = form.querySelector('#address');
    var inputType = form.querySelector('#type');
    var inputPrice = form.querySelector('#price');
    var inputTimeIn = form.querySelector('#timein');
    var inputTimeOut = form.querySelector('#timeout');
    var inputRoomNumber = form.querySelector('#room_number');
    var inputCapacity = form.querySelector('#capacity');
    var allCapacityOptions = inputCapacity.querySelectorAll('option');
    var inputFeatures = form.querySelectorAll('.feature__checkbox');
    var inputDescription = form.querySelector('#description');
    var resetButton = form.querySelector('.ad-form__reset');

    function onChangeMinPrice() {
      switch (inputType.value) {
        case 'bungalo': {
          inputPrice.min = MIN_PRICE.bungalo;
          inputPrice.placeholder = MIN_PRICE.bungalo;
          break;
        }

        case 'flat': {
          inputPrice.min = MIN_PRICE.flat;
          inputPrice.placeholder = MIN_PRICE.flat;
          break;
        }

        case 'house': {
          inputPrice.min = MIN_PRICE.house;
          inputPrice.placeholder = MIN_PRICE.house;
          break;
        }

        case 'palace': {
          inputPrice.min = MIN_PRICE.palace;
          inputPrice.placeholder = MIN_PRICE.palace;
          break;
        }

        default: {
          break;
        }
      }
    }

    function changeTime(firstTime, secondTime) {
      switch (firstTime.value) {
        case TIME_VALUES[0]: {
          secondTime.value = TIME_VALUES[0];
          break;
        }

        case TIME_VALUES[1]: {
          secondTime.value = TIME_VALUES[1];
          break;
        }

        case TIME_VALUES[2]: {
          secondTime.value = TIME_VALUES[2];
          break;
        }

        default: {
          break;
        }
      }
    }

    function onChangeTime(evt) {
      if (evt.target.closest('#timein')) {
        changeTime(inputTimeIn, inputTimeOut);
      }

      if (evt.target.closest('#timeout')) {
        changeTime(inputTimeOut, inputTimeIn);
      }
    }

    function turnOnCapacityOption(allIncludedValues) {
      for (var i = 0; i < allCapacityOptions.length; i++) {
        for (var j = 0; j < allIncludedValues.length; j++) {
          if (parseInt(allCapacityOptions[i].value, 10) === allIncludedValues[j]) {
            allCapacityOptions[i].disabled = false;
            break;
          } else {
            allCapacityOptions[i].disabled = true;
          }
        }
      }

      for (i = 0; i < allCapacityOptions.length; i++) {
        if (allCapacityOptions[i].disabled === false) {
          allCapacityOptions[i].selected = true;
          break;
        }
      }
    }

    function onChangeCapacity() {
      var allIncludedCapacityOptionsValues = [];

      switch (inputRoomNumber.value) {
        case '1': {
          allIncludedCapacityOptionsValues.push(1);
          break;
        }

        case '2': {
          allIncludedCapacityOptionsValues.push(1, 2);
          break;
        }

        case '3': {
          allIncludedCapacityOptionsValues.push(1, 2, 3);
          break;
        }

        case '100': {
          allIncludedCapacityOptionsValues.push(0);
          break;
        }

        default: {
          break;
        }
      }

      turnOnCapacityOption(allIncludedCapacityOptionsValues);
    }

    function resetForm() {
      inputTitle.value = '';
      inputAdress.value = '';
      inputType.value = 'flat';
      onChangeMinPrice();
      inputPrice.value = '';
      inputTimeIn.value = TIME_VALUES[0];
      inputTimeOut.value = TIME_VALUES[0];
      inputRoomNumber.value = '1';
      turnOnCapacityOption([1]);
      for (var i = 0; i < inputFeatures.length; i++) {
        inputFeatures[i].checked = false;
      }
      inputDescription.value = '';
    }

    function fullReset() {
      resetForm();
      window.turnOffMap();
      window.popup.onSuccessPopup();
    }

    function onSubmit(evt) {
      evt.preventDefault();

      window.backend.save(SAVE_URL, new FormData(form), fullReset, window.popup.onErrorPopup);
    }

    inputType.addEventListener('change', onChangeMinPrice);
    form.addEventListener('change', onChangeTime);
    inputRoomNumber.addEventListener('change', onChangeCapacity);
    form.addEventListener('submit', onSubmit);

    resetButton.addEventListener('click', fullReset);
  }

  window.addFormChangeListeners = addFormChangeListeners;
})();
