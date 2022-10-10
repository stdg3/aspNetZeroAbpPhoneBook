var CurrentPage = (function () {
  var handleLogin = function () {
    var $loginForm = $('#session-lock-screen-login-form');
    var $submitButton = $('#session-lock-screen-submit-button');

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

    $('input[name=password]').focus();

    function trySubmitForm() {
      if (!$loginForm.valid()) {
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

    function getLastUserInfo() {
      var userInfo = JSON.parse(abp.utils.getCookieValue('userInfo'));
      if (!userInfo) {
        window.location.replace(abp.appPath + 'Account/Logout');
      }

      $('input[name=usernameOrEmailAddress]').val(userInfo.userName);
      $('#userName').text(userInfo.userName);

      $('#tenantName').text(userInfo.tenant ? userInfo.tenant : 'Host');

      abp.services.app.profile
        .getProfilePictureByUserName(userInfo.userName)
        .done(function (data) {
          if (data.profilePicture) {
            $('#profilePicture').attr('src', 'data:image/png;base64, ' + data.profilePicture);
          } else {
            $('#profilePicture').attr('src', '/Profile/GetDefaultProfilePicture');
          }
        })
        .fail(function () {
          $('#profilePicture').attr('src', '/Profile/GetDefaultProfilePicture');
        });
    }

    getLastUserInfo();
  };

  return {
    init: function () {
      handleLogin();
    },
  };
})();
