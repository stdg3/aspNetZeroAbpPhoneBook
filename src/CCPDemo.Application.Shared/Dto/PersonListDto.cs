using Abp.Application.Services.Dto;
using System.Collections.ObjectModel;

namespace CCPDemo.Dto
{
    public class PersonListDto: FullAuditedEntityDto
    {
        public string Name { get; set; }

        public string Surname { get; set; }

        public string EmailAddress { get; set; }

        public Collection<PhoneInPersonListDto> Phones { get; set; }
    }
}
