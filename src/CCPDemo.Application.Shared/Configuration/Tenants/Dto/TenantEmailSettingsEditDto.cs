using Abp.Auditing;
using CCPDemo.Configuration.Dto;

namespace CCPDemo.Configuration.Tenants.Dto
{
    public class TenantEmailSettingsEditDto : EmailSettingsEditDto
    {
        public bool UseHostDefaultEmailSettings { get; set; }
    }
}