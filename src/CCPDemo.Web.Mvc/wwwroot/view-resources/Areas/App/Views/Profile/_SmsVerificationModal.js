(function () {
  app.modals.SmsVerificationModal = function () {
    var _profileService = abp.services.app.profile;

    var _modalManager;
    var _$form = null;

    this.init = function (modalManager) {
      _modalManager = modalManager;
      var $modal = _modalManager.getModal();

      _$form = $modal.find('form[name=SmsVerificationModalForm]');
      _$form.validate();

      var $verifyButton = $modal.find('#verifyButton');

      $verifyButton.click(function () {
        if (!_$form.valid()) {
          return;
        }

        var input = _$form.serializeFormToObject();
        input.phoneNumber = $('#PhoneNumber').val();
        _profileService.verifySmsCode(input).done(function () {
          $('#savedPhoneNumber').val($('#PhoneNumber').val());
          $('#isPhoneNumberConfirmed').val(true);
          _modalManager.setResult(null);
          _modalManager.close();
        });
      });
    };
  };
})();
