'use strict';

(function () {
  var SAVE_URL = 'https://js.dump.academy/keksobooking';
  var DISABLE_CLASS_NAME = 'ad-form--disabled';

  var typeToMinPrice = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  var timeToAnotherTime = {
    '12:00': '12:00',
    '13:00': '13:00',
    '14:00': '14:00'
  };

  var roomNumberToCapacity = {
    '1': [1],
    '2': [1, 2],
    '3': [1, 2, 3],
    '100': [0]
  };

  var form = document.querySelector('.ad-form');
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

  function turnOnForm() {
    window.util.showElement(form, DISABLE_CLASS_NAME);
    window.util.turnOnElements(form.querySelectorAll('fieldset'));
    window.images.addImagesHandlers();
  }

  function turnOffForm() {
    window.util.disableElement(form, DISABLE_CLASS_NAME);
    window.util.turnOffElements(form.querySelectorAll('fieldset'));
    window.images.resetImages();
  }

  function setAdress(value) {
    form.querySelector('#address').value = value;
  }

  function onChangeMinPrice() {
    inputPrice.min = typeToMinPrice[inputType.value];
    inputPrice.placeholder = typeToMinPrice[inputType.value];
  }

  function changeTime(firstTime, secondTime) {
    secondTime.value = timeToAnotherTime[firstTime.value];
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
    turnOnCapacityOption(roomNumberToCapacity[inputRoomNumber.value]);
  }

  function resetForm() {
    inputTitle.value = '';
    inputAdress.value = '';
    inputType.value = 'flat';
    onChangeMinPrice();
    inputPrice.value = '';
    inputTimeIn.value = timeToAnotherTime['12:00'];
    inputTimeOut.value = timeToAnotherTime['12:00'];
    inputRoomNumber.value = '1';
    turnOnCapacityOption([1]);

    for (var i = 0; i < inputFeatures.length; i++) {
      inputFeatures[i].checked = false;
    }

    inputDescription.value = '';
  }

  function onResetClick() {
    resetForm();
    window.map.turnOffMap();
    window.popup.onSuccessPopup();
  }

  function onSubmit(evt) {
    evt.preventDefault();

    window.backend.save(SAVE_URL, new FormData(form), onResetClick, window.popup.onErrorPopup);
  }

  inputType.addEventListener('change', onChangeMinPrice);
  form.addEventListener('change', onChangeTime);
  inputRoomNumber.addEventListener('change', onChangeCapacity);
  form.addEventListener('submit', onSubmit);

  resetButton.addEventListener('click', onResetClick);

  window.form = {
    turnOnForm: turnOnForm,
    turnOffForm: turnOffForm,
    setAdress: setAdress
  };
})();
