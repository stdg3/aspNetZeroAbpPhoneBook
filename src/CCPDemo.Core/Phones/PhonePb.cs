using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using CCPDemo.PhoneConstDir;
using CCPDemo.PhoneTypeEntityDir;
using CCPDemo.Persons;

namespace CCPDemo.Phones
{
    [Table("PbPhones")]
    public class PhonePb : CreationAuditedEntity<long>
    {

        [ForeignKey("PersonId")]
        public virtual Person Person { get; set; }
        public virtual int PersonId { get; set; }

        [ForeignKey("PhoneTypeId")]
        public virtual PhoneType PhoneType { get; set; }
        public virtual int PhoneTypeId { get; set; }

        [Required]
        [MaxLength(PhoneConsts.MaxNumberLength)]
        public virtual string Number { get; set; }
    }
}
