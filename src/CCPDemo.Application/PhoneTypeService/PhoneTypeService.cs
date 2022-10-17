using Abp.Application.Services.Dto;
using Abp.Collections.Extensions;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.ObjectMapping;
using Abp.Linq.Expressions;
using CCPDemo.Dto;
using CCPDemo.PhoneTypeEntityDir;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CCPDemo.InterfacePhoneType;

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
            return new ListResultDto<PhoneTypeListDto>(ObjectMapper.Map<List<PhoneTypeListDto>>(phoneType));
           
        }
    }
}
