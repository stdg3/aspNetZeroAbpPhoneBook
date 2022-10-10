var CurrentPage = (function () {
  jQuery.validator.addMethod(
    'customUsername',
    function (value, element) {
      if (value === $('input[name="EmailAddress"]').val()) {
        return true;
      }

      return !$.validator.methods.email.apply(this, arguments);
    },
    abp.localization.localize('RegisterFormUserNameInvalidMessage')
  );

  var _passwordComplexityHelper = new app.PasswordComplexityHelper();

  var handleRegister = function () {
    $('.register-form').validate({
      rules: {
        PasswordRepeat: {
          equalTo: '#RegisterPassword',
        },
        UserName: {
          required: true,
          customUsername: true,
        },
      },

      submitHandler: function (form) {
        function setCaptchaToken(callback) {
          callback = callback || function () {};
          if (!abp.setting.getBoolean('App.UserManagement.UseCaptchaOnRegistration')) {
            callback();
          } else {
            grecaptcha.reExecute(function (token) {
              $('#recaptchaResponse').val(token);
              callback();
            });
          }
        }

        setCaptchaToken(function () {
          form.submit();
        });
      },
    });

    $('.register-form input').keypress(function (e) {
      if (e.which === 13) {
        if ($('.register-form').valid()) {
          $('.register-form').submit();
        }
        return false;
      }
    });

    $('input[name=Password]').pwstrength({
      i18n: {
        t: function (key) {
          return app.localize(key);
        },
      },
    });

    _passwordComplexityHelper.setPasswordComplexityRules(
      $('input[name=Password], input[name=PasswordRepeat]'),
      window.passwordComplexitySetting
    );
  };

  return {
    init: function () {
      handleRegister();
    },
  };
})();
