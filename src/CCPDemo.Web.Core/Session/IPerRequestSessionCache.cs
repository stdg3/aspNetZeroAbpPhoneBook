using System.Threading.Tasks;
using CCPDemo.Sessions.Dto;

namespace CCPDemo.Web.Session
{
    public interface IPerRequestSessionCache
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformationsAsync();
    }
}
