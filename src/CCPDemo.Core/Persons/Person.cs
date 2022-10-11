using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities.Auditing;
using Abp.Domain.Entities;

namespace CCPDemo.Persons
{
    [Table("Persons")]
    public class Person : FullAuditedEntity
    {

        [Required]
        [StringLength(PersonConsts.MaxNameLength, MinimumLength = PersonConsts.MinNameLength)]
        public virtual string Name { get; set; }

        [Required]
        [StringLength(PersonConsts.MaxSurnameLength, MinimumLength = PersonConsts.MinSurnameLength)]
        public virtual string Surname { get; set; }

        [StringLength(PersonConsts.MaxEmailAddressLength, MinimumLength = PersonConsts.MinEmailAddressLength)]
        public virtual string EmailAddress { get; set; }

    }
}