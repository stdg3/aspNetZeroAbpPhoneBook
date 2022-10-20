using Abp.Domain.Entities.Auditing;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using CCPDemo.People;
using CCPDemo.Phones;
using Abp.Domain.Entities;

namespace CCPDemo.Persons
{
    [Table("PbPersons")]
    public class Person : FullAuditedEntity, IMustHaveTenant
    {
        public virtual int TenantId { get; set; }

        [Required]
        [MaxLength(PersonConsts.MaxNameLength)]
        public virtual string Name { get; set; }

        [Required]
        [MaxLength(PersonConsts.MaxSurnameLength)]
        public virtual string Surname { get; set; }

        [MaxLength(PersonConsts.MaxEmailAddressLength)]
        public virtual string EmailAddress { get; set; }

        public virtual ICollection<PhonePb> Phones { get; set; }
    }
}
