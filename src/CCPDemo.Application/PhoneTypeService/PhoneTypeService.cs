using Abp.Application.Services.Dto;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Extensions;
using CCPDemo.Dto;
using System.Collections.Generic;
using System.Linq;
using CCPDemo.InterfacePhoneType;
using Microsoft.EntityFrameworkCore;
using PhoneType = CCPDemo.PhoneTypeEntityDir.PhoneType;

namespace CCPDemo.PhoneTypeService
{
    public class PhoneTypeService : CCPDemoAppServiceBase, IPhoneTypeService
    {
        private readonly IRepository<PhoneType> _repository;

        public PhoneTypeService(IRepository<PhoneType> repository)
        {
            _repository = repository;
        }

        public ListResultDto<PhoneTypeListDto> GetPhoneType(GetPhoneTypeInput input)
        {
            
            var phoneType = _repository
                .GetAll()
                .WhereIf(
                !input.PhoneTypeFilter.IsNullOrEmpty(),
                p => p.PhoneTypeName.Contains(input.PhoneTypeFilter))
                .OrderBy(p => p.PhoneTypeName)
                .ToList();
            //return null;
            return new ListResultDto<PhoneTypeListDto>(ObjectMapper.Map<List<PhoneTypeListDto>>(phoneType));
           
        }
    }
}
