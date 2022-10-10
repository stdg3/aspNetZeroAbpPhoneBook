using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using CCPDemo.Common.Dto;
using CCPDemo.Editions.Dto;

namespace CCPDemo.Common
{
    public interface ICommonLookupAppService : IApplicationService
    {
        Task<ListResultDto<SubscribableEditionComboboxItemDto>> GetEditionsForCombobox(bool onlyFreeItems = false);

        Task<PagedResultDto<NameValueDto>> FindUsers(FindUsersInput input);

        GetDefaultEditionNameOutput GetDefaultEditionName();
    }
}