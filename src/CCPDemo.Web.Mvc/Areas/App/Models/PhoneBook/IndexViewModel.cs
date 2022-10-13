using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using CCPDemo.Dto;

namespace CCPDemo.Web.Areas.App.Models.PhoneBook
{
    [AutoMapFrom(typeof(ListResultDto<PersonListDto>))]
    public class IndexViewModel : ListResultDto<PersonListDto>
    {

    }
}
