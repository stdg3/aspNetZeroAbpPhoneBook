using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using CCPDemo.Dto;

namespace CCPDemo.Web.Areas.App.Models.PhoneBook.PhoneType
{
    [AutoMapFrom(typeof(ListResultDto<PhoneTypeListDto>))]
    public class IndexViewModel : ListResultDto<PhoneTypeListDto>
    {

    }
}
