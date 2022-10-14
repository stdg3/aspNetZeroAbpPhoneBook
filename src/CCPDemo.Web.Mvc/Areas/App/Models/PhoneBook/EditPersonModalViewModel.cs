using Abp.AutoMapper;
using CCPDemo.Dto;

namespace CCPDemo.Web.Areas.App.Models.PhoneBook
{
    [AutoMapFrom(typeof(GetPersonForEditOutput))]
    public class EditPersonModalViewModel : GetPersonForEditOutput
    {
        public int Id { get; set; }

        //public string Name { get; set; }

        //public string Surname { get; set; }

        //public string EmailAddress { get; set; }
    }
}
