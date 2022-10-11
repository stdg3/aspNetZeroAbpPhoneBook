using System;
using Abp.Application.Services.Dto;
using System.ComponentModel.DataAnnotations;

namespace CCPDemo.Persons.Dtos
{
    public class CreateOrEditPersonDto : EntityDto<int?>
    {

        [Required]
        [StringLength(PersonConsts.MaxNameLength, MinimumLength = PersonConsts.MinNameLength)]
        public string Name { get; set; }

        [Required]
        [StringLength(PersonConsts.MaxSurnameLength, MinimumLength = PersonConsts.MinSurnameLength)]
        public string Surname { get; set; }

        [StringLength(PersonConsts.MaxEmailAddressLength, MinimumLength = PersonConsts.MinEmailAddressLength)]
        public string EmailAddress { get; set; }

    }
}