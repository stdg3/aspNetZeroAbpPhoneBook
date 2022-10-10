using System.ComponentModel.DataAnnotations;

namespace CCPDemo.Authorization.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}
