'use strict';

(function () {
  var MIN_PRICE = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  function addFormChangeListeners(form) {
    var inputType = form.querySelector('#type');
    var inputPrice = form.querySelector('#price');
    var inputTimeIn = form.querySelector('#timein');
    var inputTimeOut = form.querySelector('#timeout');
    var inputRoomNumber = form.querySelector('#room_number');
    var inputCapacity = form.querySelector('#capacity');
    var allCapacityOptions = inputCapacity.querySelectorAll('option');

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
        case '12:00': {
          secondTime.value = '12:00';
          break;
        }

        case '13:00': {
          secondTime.value = '13:00';
          break;
        }

        case '14:00': {
          secondTime.value = '14:00';
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

    inputType.addEventListener('change', onChangeMinPrice);
    form.addEventListener('change', onChangeTime);
    inputRoomNumber.addEventListener('change', onChangeCapacity);
  }

  window.addFormChangeListeners = addFormChangeListeners;
})();
