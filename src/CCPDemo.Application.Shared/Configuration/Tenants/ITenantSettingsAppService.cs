using System.Threading.Tasks;
using Abp.Application.Services;
using CCPDemo.Configuration.Tenants.Dto;

namespace CCPDemo.Configuration.Tenants
{
    public interface ITenantSettingsAppService : IApplicationService
    {
        Task<TenantSettingsEditDto> GetAllSettings();

        Task UpdateAllSettings(TenantSettingsEditDto input);

        Task ClearLogo();

        Task ClearCustomCss();
    }
}
