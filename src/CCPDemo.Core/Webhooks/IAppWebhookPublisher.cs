using System.Threading.Tasks;
using CCPDemo.Authorization.Users;

namespace CCPDemo.WebHooks
{
    public interface IAppWebhookPublisher
    {
        Task PublishTestWebhook();
    }
}
