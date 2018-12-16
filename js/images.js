'use strict';

(function () {
  var IMAGE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var DropBoxColors = {
    HOVER: '#ff5635',
    DEFAULT: '#c7c7c7'
  };

  var ImageSize = {
    WIDTH: '100%',
    HEIGHT: '100%'
  };

  var avatarUpload = document.querySelector('.ad-form-header__upload');
  var avatarChooser = avatarUpload.querySelector('.ad-form-header__input');
  var avatarDropBox = avatarUpload.querySelector('.ad-form-header__drop-zone');
  var avatarPreview = avatarUpload.querySelector('.ad-form-header__preview img');

  var photosContainer = document.querySelector('.ad-form__photo-container');
  var photosChooser = photosContainer.querySelector('.ad-form__input');
  var photosDropBox = photosContainer.querySelector('.ad-form__drop-zone');

  function preventDefaults(evt) {
    evt.stopPropagation();
    evt.preventDefault();
  }

  function onDragEnter(evt) {
    preventDefaults(evt);

    var target = evt.target;

    if (target.tagName.toLowerCase() === 'label') {
      target.style.borderColor = DropBoxColors.HOVER;
    }
  }

  function onDragLeave(evt) {
    preventDefaults(evt);

    var target = evt.target;

    if (target.tagName.toLowerCase() === 'label') {
      target.style.borderColor = DropBoxColors.DEFAULT;
    }
  }

  function addHandlers(fileChooser, dropBox, onChange, onDrop) {
    fileChooser.addEventListener('change', onChange);
    dropBox.addEventListener('dragenter', onDragEnter);
    dropBox.addEventListener('dragover', preventDefaults);
    dropBox.addEventListener('dragleave', onDragLeave);
    dropBox.addEventListener('drop', onDrop);
  }

  function checkImageType(image) {
    return IMAGE_TYPES.some(function (type) {
      return image.name.toLowerCase().endsWith(type);
    });
  }

  function previewAvatar(image) {
    if (checkImageType(image)) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        avatarPreview.src = reader.result;
      });

      reader.readAsDataURL(image, null);
    }
  }

  function previewPhotos(images) {
    var photos = [].slice.apply(images, null);

    if (photos.every(function (photo) {
      return checkImageType(photo);
    })) {

      photos.forEach(function (photo) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          var photoElement = document.createElement('div');
          photoElement.classList.add('ad-form__photo');

          var imageElement = document.createElement('img');
          imageElement.style.width = ImageSize.WIDTH;
          imageElement.style.height = ImageSize.HEIGHT;
          imageElement.src = reader.result;

          photoElement.appendChild(imageElement);
          photosContainer.appendChild(photoElement);
        });

        reader.readAsDataURL(photo, null);
      });
    }
  }

  function onAvatarChange(evt) {
    evt.preventDefault();

    previewAvatar(avatarChooser.files[0]);
  }

  function onAvatarDrop(evt) {
    preventDefaults(evt);

    previewAvatar(evt.dataTransfer.files[0]);
    avatarDropBox.style.borderColor = DropBoxColors.DEFAULT;
  }

  function onPhotosChange(evt) {
    evt.preventDefault();

    previewPhotos(photosChooser.files);
  }

  function onPhotosDrop(evt) {
    preventDefaults(evt);

    previewPhotos(evt.dataTransfer.files);
    photosDropBox.style.borderColor = DropBoxColors.DEFAULT;
  }

  function addImagesHandlers() {
    addHandlers(avatarChooser, avatarDropBox, onAvatarChange, onAvatarDrop);
    addHandlers(photosChooser, photosDropBox, onPhotosChange, onPhotosDrop);
  }

  function reset() {
    var photos = photosContainer.querySelectorAll('.ad-form__photo');

    for (var i = 1; i < photos.length; i++) {
      photosContainer.removeChild(photos[i]);
    }

    avatarPreview.src = 'img/muffin-grey.svg';
  }

  window.images = {
    addImagesHandlers: addImagesHandlers,
    reset: reset
  };
})();
