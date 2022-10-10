using System.ComponentModel.DataAnnotations;

namespace CCPDemo.Authorization.Accounts.Dto
{
    public class SendEmailActivationLinkInput
    {
        [Required]
        public string EmailAddress { get; set; }
    }
}