(function () {
  function preparePaypalButton() {
    window.paypal
      .Buttons({
        createOrder: function (data, actions) {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: $('input[name=Amount]').val(),
                  currency_code: $('input[name=currency]').val(),
                },
              },
            ],
          });
        },
        onApprove: function (data, actions) {
          finishPayment(data);
        },
      })
      .render('#paypal-button');
  }

  function finishPayment(data) {
    $('input[name=PayPalOrderId]').val(data.orderID);

    $('#payPalCheckoutForm').submit();
  }

  preparePaypalButton();
})();
