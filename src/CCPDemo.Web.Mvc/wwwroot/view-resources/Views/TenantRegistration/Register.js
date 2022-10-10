var CurrentPage = (function () {
  function setPayment() {
    var $periodType = $('input[name=PaymentPeriodType]:checked');
    $('input[name=DayCount]').val($periodType.data('day-count') ? $periodType.data('day-count') : 0);
  }

  var _passwordComplexityHelper = new app.PasswordComplexityHelper();

  var handleRegister = function () {
    $('input[name=PaymentPeriodType]').change(function () {
      setPayment();
    });

    $('input[name=PaymentPeriodType]:first').prop('checked', true);

    setPayment();

    $.validator.addMethod(
      'regex',
      function (value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
      },
      app.localize('TenantName_Regex_Description')
    );

    $('.register-form').validate({
      errorElement: 'div',
      errorClass: 'invalid-feedback',
      focusInvalid: false, // do not focus the last invalid input
      ignore: ':hidden',
      rules: {
        AdminPasswordRepeat: {
          equalTo: '#AdminPassword',
        },
        TenancyName: {
          required: true,
          regex: '^[a-zA-Z][a-zA-Z0-9_-]{1,}$',
        },
      },
      messages: {},
      invalidHandler: function (event, validator) {},
      highlight: function (element) {
        $(element).closest('.form-group').find('input:eq(0)').addClass('is-invalid');
      },
      success: function (label) {
        label.closest('.form-group').find('input:eq(0)').removeClass('is-invalid');
        label.remove();
      },
      errorPlacement: function (error, element) {
        if (element.closest('.input-icon').length === 1) {
          error.insertAfter(element.closest('.input-icon'));
        } else {
          error.insertAfter(element);
        }
      },
      submitHandler: function (form) {
        function setCaptchaToken(callback) {
          callback = callback || function () {};
          if (!abp.setting.getBoolean('App.TenantManagement.UseCaptchaOnRegistration')) {
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

    $('input[name=AdminPassword]').pwstrength({
      i18n: {
        t: function (key) {
          return app.localize(key);
        },
      },
    });

    _passwordComplexityHelper.setPasswordComplexityRules(
      $('input[name=AdminPassword],input[name=AdminPasswordRepeat]'),
      window.passwordComplexitySetting
    );
  };

  function init() {
    handleRegister();
  }

  return {
    init: init,
  };
})();
