using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.UI.Inputs;
using CCPDemo.DynamicEntityProperties.Dto;

namespace CCPDemo.DynamicEntityProperties
{
    public interface IDynamicPropertyAppService
    {
        Task<DynamicPropertyDto> Get(int id);

        Task<ListResultDto<DynamicPropertyDto>> GetAll();

        Task Add(DynamicPropertyDto dto);

        Task Update(DynamicPropertyDto dto);

        Task Delete(int id);

        IInputType FindAllowedInputType(string name);
    }
}
