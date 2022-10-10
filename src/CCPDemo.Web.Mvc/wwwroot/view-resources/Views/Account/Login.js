var CurrentPage = (function () {
  var handleLogin = function () {
    var $loginForm = $('form.login-form');
    var $submitButton = $('#kt_login_signin_submit');

    $submitButton.click(function () {
      trySubmitForm();
    });

    $loginForm.validate({
      rules: {
        username: {
          required: true,
        },
        password: {
          required: true,
        },
      },
    });

    $loginForm.find('input').keypress(function (e) {
      if (e.which === 13) {
        trySubmitForm();
      }
    });

    $('a.social-login-icon').click(function () {
      var $a = $(this);
      var $form = $a.closest('form');
      $form.find('input[name=provider]').val($a.attr('data-provider'));
      $form.submit();
    });

    $loginForm.find('input[name=returnUrlHash]').val(location.hash);

    $('input[type=text]').first().focus();

    function trySubmitForm() {
      if (!$('form.login-form').valid()) {
        return;
      }

      function setCaptchaToken(callback) {
        callback = callback || function () {};
        if (!abp.setting.getBoolean('App.UserManagement.UseCaptchaOnLogin')) {
          callback();
        } else {
          grecaptcha.reExecute(function (token) {
            $('#recaptchaResponse').val(token);
            callback();
          });
        }
      }

      setCaptchaToken(function () {
        abp.ui.setBusy(
          null,
          abp
            .ajax({
              contentType: app.consts.contentTypes.formUrlencoded,
              url: $loginForm.attr('action'),
              data: $loginForm.serialize(),
              abpHandleError: false,
            })
            .fail(function (error) {
              setCaptchaToken();
              abp.ajax.showError(error);
            })
        );
      });
    }
  };

  return {
    init: function () {
      handleLogin();
    },
  };
})();
