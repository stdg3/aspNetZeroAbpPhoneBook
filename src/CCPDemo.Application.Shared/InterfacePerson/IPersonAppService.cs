using Abp.Application.Services.Dto;
using CCPDemo.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace CCPDemo.InterfacePerson
{
    public interface IPersonAppService
    {
        ListResultDto<PersonListDto> GetPeople(GetPeopleInput input);
    }
}
