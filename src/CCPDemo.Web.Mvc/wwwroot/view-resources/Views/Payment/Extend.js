var CurrentPage = (function () {
  function setPayment() {
    var $periodType = $('input[name=PaymentPeriodType]:checked');
    $('input[type=hidden][name=PaymentPeriodType]').val($periodType.val());
  }

  function handleRegister() {
    $('input[name=PaymentPeriodType]').change(function () {
      setPayment();
    });

    $('input[name=PaymentPeriodType]:first').prop('checked', true);

    setPayment();
  }

  function getPaymentPeriodType() {
    var $input = $('input[name=PaymentPeriodType]');
    if (!$input) {
      return null;
    }
    if ($input.attr('type') === 'radio') {
      return $('input[name=PaymentPeriodType]:checked').val();
    }

    return $input.val();
  }

  function init() {
    handleRegister();

    $('.checkout').click(function () {
      var gateway = $(this).attr('data-gateway');
      var paymentPeriodType = getPaymentPeriodType();

      var input = {
        editionId: $('input[name=EditionId]').val(),
        editionPaymentType: $('input[name=EditionPaymentType]').val(),
        subscriptionStartType: $('input[name=SubscriptionStartType]').val(),
        recurringPaymentEnabled: $('input[name=RecurringPaymentEnabled]').val(),
        paymentPeriodType: paymentPeriodType,
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
