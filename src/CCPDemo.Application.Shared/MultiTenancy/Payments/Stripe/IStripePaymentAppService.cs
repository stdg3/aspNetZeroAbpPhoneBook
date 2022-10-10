using System.Threading.Tasks;
using Abp.Application.Services;
using CCPDemo.MultiTenancy.Payments.Dto;
using CCPDemo.MultiTenancy.Payments.Stripe.Dto;

namespace CCPDemo.MultiTenancy.Payments.Stripe
{
    public interface IStripePaymentAppService : IApplicationService
    {
        Task ConfirmPayment(StripeConfirmPaymentInput input);

        StripeConfigurationDto GetConfiguration();

        Task<SubscriptionPaymentDto> GetPaymentAsync(StripeGetPaymentInput input);

        Task<string> CreatePaymentSession(StripeCreatePaymentSessionInput input);
    }
}