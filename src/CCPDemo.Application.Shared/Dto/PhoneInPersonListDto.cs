using Abp.Application.Services.Dto;
using CCPDemo.PhoneTypes;
using System;
using System.Collections.Generic;
using System.Text;

namespace CCPDemo.Dto
{
    public class PhoneInPersonListDto : CreationAuditedEntityDto<long>
    {
        public PhoneType Type { get; set; }

        public string Number { get; set; }
    }
}
