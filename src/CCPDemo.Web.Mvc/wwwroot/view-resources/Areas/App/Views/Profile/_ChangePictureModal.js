(function ($) {
  app.modals.ChangeProfilePictureModal = function () {
    var _modalManager;
    var $jcropApi = null;
    var uploadedFileToken = null;

    var _profileService = abp.services.app.profile;

    this.init = function (modalManager) {
      _modalManager = modalManager;

      $('#ChangeProfilePictureModalForm input[name=ProfilePicture]').change(function () {
        $('#ChangeProfilePictureModalForm').submit();
      });

      $('#ChangeProfilePictureModalForm').ajaxForm({
        beforeSubmit: function (formData, jqForm, options) {
          var $fileInput = $('#ChangeProfilePictureModalForm input[name=ProfilePicture]');
          var files = $fileInput.get()[0].files;

          if (!files.length) {
            return false;
          }

          var file = files[0];

          //File type check
          var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
          if ('|jpg|jpeg|png|gif|'.indexOf(type) === -1) {
            abp.message.warn(app.localize('ProfilePicture_Warn_FileType'));
            return false;
          }

          //File size check
          if (file.size > 5242880) {
            //5MB
            abp.message.warn(app.localize('ProfilePicture_Warn_SizeLimit', app.maxProfilePictureBytesUserFriendlyValue));
            return false;
          }

          var mimeType = _.filter(formData, { name: 'ProfilePicture' })[0].value.type;

          formData.push({ name: 'FileType', value: mimeType });
          formData.push({ name: 'FileName', value: 'ProfilePicture' });
          formData.push({ name: 'FileToken', value: app.guid() });

          return true;
        },
        success: function (response) {
          if (response.success) {
            var $profilePictureResize = $('#ProfilePictureResize');

            var profileFilePath =
              abp.appPath +
              'File/DownloadTempFile?fileToken=' +
              response.result.fileToken +
              '&fileName=' +
              response.result.fileName +
              '&fileType=' +
              response.result.fileType +
              '&v=' +
              new Date().valueOf();
            uploadedFileToken = response.result.fileToken;

            if ($jcropApi) {
              $jcropApi.destroy();
            }

            $profilePictureResize.show();
            $profilePictureResize.attr('src', profileFilePath);
            $profilePictureResize.attr('originalWidth', response.result.width);
            $profilePictureResize.attr('originalHeight', response.result.height);

            $profilePictureResize.Jcrop(
              {
                setSelect: [0, 0, 100, 100],
                aspectRatio: 1,
                boxWidth: 400,
                boxHeight: 400,
              },
              function () {
                $jcropApi = this;
              }
            );
          } else {
            abp.message.error(response.error.message);
          }
        },
      });

      $('#ProfilePictureResize').hide();

      $('#Profile_UseGravatarProfilePicture').change(function () {
        var useGravatarProfilePicture = $(this).is(':checked');
        var $modal = _modalManager.getModal();

        if (useGravatarProfilePicture) {
          $('[name="ProfilePicture"]').attr('disabled', 'disabled');
          $modal.find('.jcrop-active').hide();
        } else {
          $('[name="ProfilePicture"]').removeAttr('disabled');
          $modal.find('.jcrop-active').show();
        }
      });
    };

    this.save = function () {
      var input = {};
      var useGravatarProfilePicture = $('#Profile_UseGravatarProfilePicture').is(':checked');

      if (useGravatarProfilePicture) {
        input.useGravatarProfilePicture = useGravatarProfilePicture;
      } else {
        if (!uploadedFileToken) {
          abp.notify.warn(app.localize('PleaseSelectAPicture'));
          return;
        }

        var resizeParams = {};
        if ($jcropApi) {
          resizeParams = $jcropApi.getSelection();
        }

        var containerWidth = $jcropApi.getContainerSize()[0];
        var containerHeight = $jcropApi.getContainerSize()[1];

        var originalWidth = containerWidth;
        var originalHeight = containerHeight;

        if ($('#ProfilePictureResize')) {
          originalWidth = parseInt($('#ProfilePictureResize').attr('originalWidth'));
          originalHeight = parseInt($('#ProfilePictureResize').attr('originalHeight'));
        }

        var widthRatio = originalWidth / containerWidth;
        var heightRatio = originalHeight / containerHeight;

        input = {
          fileToken: uploadedFileToken,
          x: parseInt(resizeParams.x * widthRatio),
          y: parseInt(resizeParams.y * heightRatio),
          width: parseInt(resizeParams.w * widthRatio),
          height: parseInt(resizeParams.h * heightRatio),
        };
        
        var userIdInput = _modalManager.getModal().find("#userId");
        if (userIdInput.length === 1) {
          input.userId = userIdInput.val();
        }
      }

      _profileService.updateProfilePicture(input).done(function () {
        if ($jcropApi) {
          $jcropApi.destroy();
          $jcropApi = null;
        }
        
        $('.header-profile-picture').attr('src', app.getUserProfilePicturePath());
        _modalManager.close();
      });
    };

    $('#ProfilePicture').change(function () {
      var fileName = app.localize('ChooseAFile');
      if (this.files && this.files[0]) {
        fileName = this.files[0].name;
      }
      $('#ProfilePictureLabel').text(fileName);
    });
  };
})(jQuery);
