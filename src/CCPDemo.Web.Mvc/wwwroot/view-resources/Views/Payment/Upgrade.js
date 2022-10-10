var CurrentPage = (function () {
  function init() {
    $('.checkout').click(function () {
      var gateway = $(this).attr('data-gateway');

      var input = {
        editionId: $('input[name=EditionId]').val(),
        editionPaymentType: $('input[name=EditionPaymentType]').val(),
        subscriptionStartType: $('input[name=SubscriptionStartType]').val(),
        recurringPaymentEnabled: $('input[name=RecurringPaymentEnabled]').val(),
        paymentPeriodType: $('input[name=PaymentPeriodType]').val(),
        gateway: gateway,
      };

      var formData = new FormData();
      for (var key in input) {
        formData.append(key, input[key]);
      }

      abp.ajax({
        url: abp.appPath + 'Payment/CreatePayment',
        data: formData,
        processData: false,
        contentType: false,
      });
    });
  }

  return {
    init: init,
  };
})();
