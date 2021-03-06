'use strict';

(function () {
  var StatusCode = {
    OK: 200
  };

  var TIMEOUT = 10000;
  var RESPONSE_TYPE = 'json';

  function createXhr(onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = RESPONSE_TYPE;

    xhr.addEventListener('error', function () {
      onError('Ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не выполнился за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    return xhr;
  }

  function load(url, onLoad, onError) {
    var xhr = createXhr(onError);

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.open('GET', url);
    xhr.send();
  }

  function save(url, data, onLoad, onError) {
    var xhr = createXhr(onError);

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad();
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.open('POST', url);
    xhr.send(data);
  }

  window.backend = {
    load: load,
    save: save
  };
})();
