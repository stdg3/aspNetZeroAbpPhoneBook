using Abp.Application.Services;
using Abp.Application.Services.Dto;
using CCPDemo.Dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace CCPDemo.InterfacePhoneType
{
    public interface IPhoneTypeService : IApplicationService
    {
        ListResultDto<PhoneTypeListDto> GetPhoneType(GetPhoneTypeInput input);
    }
}
