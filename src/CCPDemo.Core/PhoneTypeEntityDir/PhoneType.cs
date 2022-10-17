using Abp.Domain.Entities.Auditing;
using CCPDemo.PhoneConstDir;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
