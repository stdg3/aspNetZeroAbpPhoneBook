using System;
using System.Threading.Tasks;
using Abp.Extensions;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Mvc;
using CCPDemo.Editions;
using CCPDemo.MultiTenancy;
using CCPDemo.MultiTenancy.Payments;
using CCPDemo.MultiTenancy.Payments.Stripe;
using CCPDemo.MultiTenancy.Payments.Stripe.Dto;
using CCPDemo.Url;
using CCPDemo.Web.Models.Stripe;

namespace CCPDemo.Web.Controllers
{
    public class StripeController : StripeControllerBase
    {
        private readonly StripePaymentGatewayConfiguration _stripeConfiguration;
        private readonly IPaymentAppService _paymentAppService;
        private readonly IWebUrlService _webUrlService;
        private readonly StripeGatewayManager _stripeGatewayManager;
        private readonly TenantManager _tenantManager;

        public StripeController(
            StripeGatewayManager stripeGatewayManager,
            StripePaymentGatewayConfiguration stripeConfiguration,
            IStripePaymentAppService stripePaymentAppService,
            IPaymentAppService paymentAppService,
            IWebUrlService webUrlService, TenantManager tenantManager)
            : base(stripeGatewayManager, stripeConfiguration, stripePaymentAppService)
        {
            _stripeGatewayManager = stripeGatewayManager;
            _stripeConfiguration = stripeConfiguration;
            _paymentAppService = paymentAppService;
            _webUrlService = webUrlService;
            _tenantManager = tenantManager;
        }

        public async Task<ActionResult> Purchase(long paymentId)
        {
            var payment = await _paymentAppService.GetPaymentAsync(paymentId);
            if (payment.Status != SubscriptionPaymentStatus.NotPaid)
            {
                throw new ApplicationException("This payment is processed before");
            }

            var model = new StripePurchaseViewModel
            {
                PaymentId = payment.Id,
                Amount = payment.Amount,
                Description = payment.Description,
                IsRecurring = payment.IsRecurring,
                Configuration = _stripeConfiguration,
                UpdateSubscription = payment.EditionPaymentType == EditionPaymentType.Upgrade
            };

            var sessionId = await StripePaymentAppService.CreatePaymentSession(new StripeCreatePaymentSessionInput
            {
                PaymentId = paymentId,
                SuccessUrl = _webUrlService.GetSiteRootAddress().EnsureEndsWith('/') + "Stripe/GetPaymentResult",
                CancelUrl = _webUrlService.GetSiteRootAddress().EnsureEndsWith('/') + "Stripe/PaymentCancel",
            });

            if (payment.IsRecurring && payment.EditionPaymentType == EditionPaymentType.Upgrade)
            {
                model.IsRecurring = false;
            }

            model.SessionId = sessionId;

            return View(model);
        }

        public IActionResult PaymentCancel()
        {
            return View();
        }

        public async Task<ActionResult> GetPaymentResult(string sessionId)
        {
            var payment = await StripePaymentAppService.GetPaymentAsync(
                new StripeGetPaymentInput
                {
                    StripeSessionId = sessionId
                });
            
            using (CurrentUnitOfWork.SetTenantId(null))
            {
                var tenant = await _tenantManager.GetByIdAsync(payment.TenantId);
                await _stripeGatewayManager.UpdateCustomerDescriptionAsync(sessionId, tenant.TenancyName);
            }
            
            if (payment.TenantId != AbpSession.TenantId)
            {
                return new NotFoundResult();
            }

            ViewBag.PaymentId = payment.Id;
            return View();
        }
    }
}
