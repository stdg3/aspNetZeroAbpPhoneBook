var CurrentPage = (function () {
  var handleValidationForm = function () {
    var $form = $('.verify-security-code-form');
    var $remainingTimeCounter = $('.remaining-time-counter');
    $form.validate();

    $form.find('input').keypress(function (e) {
      if (e.which === 13) {
        if ($('.forget-form').valid()) {
          $('.forget-form').submit();
        }
        return false;
      }
    });

    $form.submit(function (e) {
      e.preventDefault();

      if (!$form.valid()) {
        return;
      }

      abp.ui.setBusy(
        null,
        abp
          .ajax({
            contentType: app.consts.contentTypes.formUrlencoded,
            url: $form.attr('action'),
            data: $form.serialize(),
          })
          .done(function () {
            //no need to handle result since redirects and errors are automatically handled
          })
      );
    });

    if (remainingSeconds) {
      setInterval(() => {
        remainingSeconds--;
        $remainingTimeCounter.text(
          app.localize('RemainingTime') + ': ' + app.localize('SecondShort{0}', remainingSeconds)
        );
        if (remainingSeconds === 0) {
          abp.message.warn(app.localize('TimeoutPleaseTryAgain')).then(() => {
            window.location = '/Account/Login';
          });
        }
      }, 1000);
    }
  };

  return {
    init: function () {
      handleValidationForm();
    },
  };
})();
