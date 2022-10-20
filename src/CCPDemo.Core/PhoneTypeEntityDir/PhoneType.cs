using Abp.Domain.Entities.Auditing;
using CCPDemo.PhoneConstDir;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CCPDemo.PhoneTypeEntityDir
{
    [Table("PbPhoneType")]
    public class PhoneType : FullAuditedEntity
    {
        [Required]
        [MaxLength(PhoneConsts.MaxNumberLength)]
        public virtual string PhoneTypeName { get; set; }
    }
}
