using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CCPDemo.PhoneConstDir;
using CCPDemo.PhoneTypes;
using CCPDemo.Persons;

namespace CCPDemo.Phones
{
    [Table("PbPhones")]
    public class Phone : CreationAuditedEntity<long>
    {

        [ForeignKey("PersonId")]
        public virtual Person Person { get; set; }
        public virtual int PersonId { get; set; }

        [Required]
        public virtual PhoneType Type { get; set; }

        [Required]
        [MaxLength(PhoneConsts.MaxNumberLength)]
        public virtual string Number { get; set; }
    }
}
