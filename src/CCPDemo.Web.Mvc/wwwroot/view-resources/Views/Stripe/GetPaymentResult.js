$(function () {
  var _stripeService = abp.services.app.stripePayment;
  var _controlTimeout = 1000 * 5;
  var _maxControlCount = 5;

  function controlAgain() {
    if (_maxControlCount === 0) {
      return;
    }
    setTimeout(controlCheckout, _controlTimeout);
    _controlTimeout *= 2;
    _maxControlCount--;
  }

  function controlCheckout() {
    var paymentId = $('#paymentId').val();

    _stripeService
      .getPaymentResult({
        paymentId: paymentId,
      })
      .done(function (data) {
        if (data.paymentDone) {
          window.location.href = '/payment/paymentcompleted';
        } else {
          controlAgain();
        }
      })
      .catch(function () {
        controlAgain();
      });
  }

  function init() {
    controlCheckout();
  }

  abp.ui.setBusy('#loading');
  init();
});
