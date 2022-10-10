using Abp.Application.Services;
using Abp.Application.Services.Dto;
using CCPDemo.Authorization.Permissions.Dto;

namespace CCPDemo.Authorization.Permissions
{
    public interface IPermissionAppService : IApplicationService
    {
        ListResultDto<FlatPermissionWithLevelDto> GetAllPermissions();
    }
}
