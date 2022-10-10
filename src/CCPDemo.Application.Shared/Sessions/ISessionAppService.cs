using System.Threading.Tasks;
using Abp.Application.Services;
using CCPDemo.Sessions.Dto;

namespace CCPDemo.Sessions
{
    public interface ISessionAppService : IApplicationService
    {
        Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();

        Task<UpdateUserSignInTokenOutput> UpdateUserSignInToken();
    }
}
