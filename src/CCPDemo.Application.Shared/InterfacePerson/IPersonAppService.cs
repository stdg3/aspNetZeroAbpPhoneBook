using Abp.Application.Services.Dto;
using CCPDemo.Dto;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CCPDemo.InterfacePerson
{
    public interface IPersonAppService
    {
        ListResultDto<PersonListDto> GetPeople(GetPeopleInput input);
        Task CreatePerson(CreatePersonInput input);
        Task DeletePerson(EntityDto input);
        Task DeletePhone(EntityDto<long> input);
        Task<PhoneInPersonListDto> AddPhone(AddPhoneInput input);
        //Task GetPersonForEdit(EntityDto entityDto);
        Task<GetPersonForEditOutput> GetPersonForEdit(IEntityDto input);
    }
}
