using System.Threading.Tasks;
using Abp.Application.Services;
using CCPDemo.Editions.Dto;
using CCPDemo.MultiTenancy.Dto;

namespace CCPDemo.MultiTenancy
{
    public interface ITenantRegistrationAppService: IApplicationService
    {
        Task<RegisterTenantOutput> RegisterTenant(RegisterTenantInput input);

        Task<EditionsSelectOutput> GetEditionsForSelect();

        Task<EditionSelectDto> GetEdition(int editionId);
    }
}