using Abp.Application.Services.Dto;

namespace CCPDemo.Dto
{
    public class PhoneInPersonListDto : CreationAuditedEntityDto<long>
    {
        public string Number { get; set; }

        public int PhoneTypeId { get; set; }

        public PhoneTypeListDto PhoneType { get; set; }
    }
}
