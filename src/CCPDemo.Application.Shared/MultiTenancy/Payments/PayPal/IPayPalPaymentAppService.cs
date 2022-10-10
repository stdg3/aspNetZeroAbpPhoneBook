using System.Threading.Tasks;
using Abp.Application.Services;
using CCPDemo.MultiTenancy.Payments.PayPal.Dto;

namespace CCPDemo.MultiTenancy.Payments.PayPal
{
    public interface IPayPalPaymentAppService : IApplicationService
    {
        Task ConfirmPayment(long paymentId, string paypalOrderId);

        PayPalConfigurationDto GetConfiguration();
    }
}
