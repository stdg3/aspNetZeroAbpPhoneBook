(function () {
  app.modals.MySettingsModal = function () {
    var _profileService = abp.services.app.profile;
    var _initialTimezone = null;

    var _modalManager;
    var _$form = null;

    this.init = function (modalManager) {
      _modalManager = modalManager;
      var $modal = _modalManager.getModal();

      _$form = $modal.find('form[name=MySettingsModalForm]');
      _$form.validate();

      _initialTimezone = _$form.find("[name='Timezone']").val();

      var $btnEnableGoogleAuthenticator = $modal.find('#btnEnableGoogleAuthenticator');

      $btnEnableGoogleAuthenticator.click(function () {
        _profileService
          .updateGoogleAuthenticatorKey()
          .done(function (result) {
            $modal.find('.google-authenticator-enable').show();
            $modal.find('.google-authenticator-disable').hide();
            $modal.find('img').attr('src', result.qrCodeSetupImageUrl);
          })
          .always(function () {
            _modalManager.setBusy(false);
          });
      });

      var $btnDisableGoogleAuthenticator = $modal.find('#btnDisableGoogleAuthenticator');

      $btnDisableGoogleAuthenticator.click(function () {
        _profileService
          .disableGoogleAuthenticator()
          .done(function (result) {
            $modal.find('.google-authenticator-enable').hide();
            $modal.find('.google-authenticator-disable').show();
            $modal.find('img').attr('src', '');
          })
          .always(function () {
            _modalManager.setBusy(false);
          });
      });

      var $SmsVerification = $modal.find('#btnSmsVerification');
      var smsVerificationModal = new app.ModalManager({
        viewUrl: abp.appPath + 'App/Profile/SmsVerificationModal',
        scriptUrl: abp.appPath + 'view-resources/Areas/App/Views/Profile/_SmsVerificationModal.js',
        modalClass: 'SmsVerificationModal',
      });

      $SmsVerification.click(function () {
        _profileService.sendVerificationSms({ phoneNumber: $('#PhoneNumber').val() }).done(function () {
          smsVerificationModal.open({}, function () {
            $('#SpanSmsVerificationVerified').show();
            $('#btnSmsVerification').attr('disabled', true);
            _$form.find('.tooltips').tooltip();
          });
        });
      });

      _$form.find('.tooltips').tooltip();
      $('#PhoneNumber').keyup(function () {
        if ($('#savedPhoneNumber').val() != $(this).val() || $('#isPhoneNumberConfirmed').val() == false) {
          $('#SpanSmsVerificationVerified').hide();
          $('#btnSmsVerification').removeAttr('disabled');
        } else {
          $('#SpanSmsVerificationVerified').show();
          $('#btnSmsVerification').attr('disabled', true);
        }
      });
    };

    this.save = function () {
      if (!_$form.valid()) {
        return;
      }

      var profile = _$form.serializeFormToObject();

      _modalManager.setBusy(true);
      _profileService
        .updateCurrentUserProfile(profile)
        .done(function () {
          $('#HeaderCurrentUserName').text(profile.UserName);
          abp.notify.info(app.localize('SavedSuccessfully'));
          _modalManager.close();

          var newTimezone = _$form.find("[name='Timezone']").val();

          if (abp.clock.provider.supportsMultipleTimezone && _initialTimezone !== newTimezone) {
            abp.message.info(app.localize('TimeZoneSettingChangedRefreshPageNotification')).done(function () {
              window.location.reload();
            });
          }
        })
        .always(function () {
          _modalManager.setBusy(false);
        });
    };
  };
})();
