using System;
using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using CCPDemo.Persons.Dtos;
using CCPDemo.Dto;

namespace CCPDemo.Persons
{
    public interface IPersonsAppService : IApplicationService
    {
        Task<PagedResultDto<GetPersonForViewDto>> GetAll(GetAllPersonsInput input);

        Task<GetPersonForViewDto> GetPersonForView(int id);

        Task<GetPersonForEditOutput> GetPersonForEdit(EntityDto input);

        Task CreateOrEdit(CreateOrEditPersonDto input);

        Task Delete(EntityDto input);

        Task<FileDto> GetPersonsToExcel(GetAllPersonsForExcelInput input);

    }
}