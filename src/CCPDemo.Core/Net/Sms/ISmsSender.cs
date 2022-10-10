using System.Threading.Tasks;

namespace CCPDemo.Net.Sms
{
    public interface ISmsSender
    {
        Task SendAsync(string number, string message);
    }
}