(function () {
  app.modals.InactivityControllerNotifyModal = function () {
    var that = this;
    var $countDownHolder;
    var $countDownInformation;
    var $progressBar;

    var timeOutSecond = abp.setting.getInt('App.UserManagement.SessionTimeOut.ShowTimeOutNotificationSecond'); //show inactivity modal when TimeOutSecond passed
    var currentSecond = timeOutSecond;
    var changeNotifyContentInterval;

    this.init = function (modalManager) {
      $countDownHolder = modalManager.getModal().find('#countdown-holder');
      $countDownInformation = modalManager.getModal().find('#countdown-information');
      $progressBar = modalManager.getModal().find('.progress-bar');

      $countDownHolder.text(timeOutSecond + 's');
      $progressBar.css('width', '100%');

      changeNotifyContentInterval = setInterval(changeNotifyContent, 1000);
    };

    this.Stop = function () {
      clearInterval(changeNotifyContentInterval);
      currentSecond = timeOutSecond;
    };

    function done() {
      that.Stop();

      let isSessionLockScreenEnabled = abp.setting.getBoolean(
        'App.UserManagement.SessionTimeOut.ShowLockScreenWhenTimedOut'
      );
      if (isSessionLockScreenEnabled) {
        redirectToLockScreen();
      } else {
        redirectToLogOut();
      }
    }

    function changeNotifyContent() {
      currentSecond--;
      if (currentSecond <= 0) {
        $countDownHolder.text('0s');
        $progressBar.css('width', '0%');
        done();
      } else {
        $countDownHolder.text(currentSecond + 's');
        $countDownInformation.text(app.localize('SessionExpireRedirectingInXSecond', currentSecond));
        $progressBar.css('width', parseInt((currentSecond / timeOutSecond) * 100) + '%');
      }
    }

    function redirectToLockScreen() {
      storeUserInfo(function () {
        logOut(function () {
          window.location.replace(abp.appPath + 'Account/SessionLockScreen');
        });
      });
    }

    function storeUserInfo(callBack) {
      let isSuccessfull = false;
      abp.services.app.session
        .getCurrentLoginInformations()
        .done(function (info) {
          if (info) {
            abp.utils.setCookieValue(
              'userInfo',
              JSON.stringify({
                userName: info.user.userName,
                profilePictureId: info.user.profilePictureId,
                tenant: info.tenant ? info.tenant.tenancyName : 'Host',
              }),
              null,
              abp.appPath,
              abp.domain
            );
            isSuccessfull = true;
          }
        })
        .always(function () {
          if (isSuccessfull) {
            if (typeof callBack == 'function') {
              callBack();
            }
          } else {
            window.location.replace(abp.appPath + 'Account/Logout');
          }
        });
    }

    function logOut(callBack) {
      $.get(abp.appPath + 'Account/Logout', function () {
        if (typeof callBack == 'function') {
          callBack();
        }
      }).fail(function () {
        window.location.replace(abp.appPath + 'Account/Logout');
      });
    }

    function redirectToLogOut() {
      window.location.replace(abp.appPath + 'Account/Logout');
    }
  };

  app.modals.InactivityControllerNotifyModal.create = function () {
    var modal = new app.ModalManager({
      viewUrl: abp.appPath + 'App/Common/InactivityControllerNotifyModal',
      scriptUrl:
        abp.appPath + 'view-resources/Areas/App/Views/Common/Modals/_InactivityControllerNotifyModal.js',
      modalClass: 'InactivityControllerNotifyModal',
    });

    var close = modal.close;
    modal.close = function () {
      modal.getModalObject().Stop();
      close();
    };

    return modal;
  };
})();
