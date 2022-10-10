(function () {
  function prepareStripeButton() {
    var stripe = Stripe($('#stripePublishableKey').val());
    var sessionId = $('#sessionId').val();

    $('#stripe-checkout').click(function () {
      stripe.redirectToCheckout({ sessionId: sessionId });
    });
  }

  prepareStripeButton();
})();
