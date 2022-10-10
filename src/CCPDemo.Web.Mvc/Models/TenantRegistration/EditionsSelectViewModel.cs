using Abp.AutoMapper;
using CCPDemo.MultiTenancy.Dto;

namespace CCPDemo.Web.Models.TenantRegistration
{
    [AutoMapFrom(typeof(EditionsSelectOutput))]
    public class EditionsSelectViewModel : EditionsSelectOutput
    {
    }
}
