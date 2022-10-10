using System.Threading.Tasks;
using Abp.Application.Services;

namespace CCPDemo.MultiTenancy
{
    public interface ISubscriptionAppService : IApplicationService
    {
        Task DisableRecurringPayments();

        Task EnableRecurringPayments();
    }
}
