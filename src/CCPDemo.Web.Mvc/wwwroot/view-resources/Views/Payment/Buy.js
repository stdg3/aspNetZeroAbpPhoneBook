var CurrentPage = (function () {
  function setPayment() {
    var $periodType = $('input[name=PaymentPeriodType]:checked');
    $('input[name=DayCount]').val($periodType.data('day-count'));
    $('input[type=hidden][name=PaymentPeriodType]').val($periodType.val());
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

  function recurringPaymentSelected() {
    return $('input[name=RecurringPaymentEnabled]:checked').length > 0;
  }

  function init() {
    $('input[name=PaymentPeriodType]').change(function () {
      setPayment();
    });

    $('input[name=RecurringPaymentEnabled]').change(function () {
      var recurringPaymentEnabled = recurringPaymentSelected();
      if (recurringPaymentEnabled) {
        $('.checkout[data-supports-subscription=false]').hide();
      } else {
        $('.checkout[data-supports-subscription=false]').show();
      }
    });

    $('.checkout').click(function () {
      var gateway = $(this).attr('data-gateway');
      var paymentPeriodType = getPaymentPeriodType();

      var input = {
        editionId: $('input[name=EditionId]').val(),
        editionPaymentType: $('input[name=EditionPaymentType]').val(),
        recurringPaymentEnabled: recurringPaymentSelected(),
        gateway: gateway,
      };

      if (paymentPeriodType) {
        input.paymentPeriodType = paymentPeriodType;
      }

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

    $('input[name=PaymentPeriodType]:first').prop('checked', true);

    setPayment();
  }
  return {
    init: init,
  };
})();
