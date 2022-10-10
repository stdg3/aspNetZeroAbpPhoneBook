using System.ComponentModel.DataAnnotations;

namespace CCPDemo.Web.Models.Account
{
    public class SendPasswordResetLinkViewModel
    {
        [Required]
        public string EmailAddress { get; set; }
    }
}