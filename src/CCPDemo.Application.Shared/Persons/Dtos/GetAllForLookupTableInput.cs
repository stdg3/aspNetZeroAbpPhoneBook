using Abp.Application.Services.Dto;

namespace CCPDemo.Persons.Dtos
{
    public class GetAllForLookupTableInput : PagedAndSortedResultRequestDto
    {
        public string Filter { get; set; }
    }
}