using CCPDemo.People;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CCPDemo.Dto
{
    public class EditPersonInput
    {
        [Range(1, int.MaxValue)]
        public int Id { get; set; }
        [Required]
        [MaxLength(PersonConsts.MaxNameLength)]
        public string Name { get; set; }

        [Required]
        [MaxLength(PersonConsts.MaxSurnameLength)]
        public string Surname { get; set; }

        [EmailAddress]
        [MaxLength(PersonConsts.MaxEmailAddressLength)]
        public string EmailAddress { get; set; }
    }
}
