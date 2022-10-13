using CCPDemo.Persons.Dtos;

using Abp.Extensions;

namespace CCPDemo.Web.Areas.App.Models.Persons
{
    public class CreateOrEditPersonModalViewModel
    {
        public CreateOrEditPersonDto Person { get; set; }

        public bool IsEditMode => Person.Id.HasValue;
    }
}