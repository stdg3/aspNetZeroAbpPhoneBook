using System.Threading.Tasks;
using Abp.Webhooks;

namespace CCPDemo.WebHooks
{
    public interface IWebhookEventAppService
    {
        Task<WebhookEvent> Get(string id);
    }
}
