using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using CCPDemo.Authorization.Users.Dto;

namespace CCPDemo.Authorization.Users
{
    public interface IUserLoginAppService : IApplicationService
    {
        Task<PagedResultDto<UserLoginAttemptDto>> GetUserLoginAttempts(GetLoginAttemptsInput input);
    }
}
