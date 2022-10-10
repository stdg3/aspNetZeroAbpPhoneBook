using CCPDemo.Sessions.Dto;

namespace CCPDemo.Web.Areas.App.Models.Layout
{
    public class HeaderViewModel
    {
        public int SubscriptionExpireNotifyDayCount { get; set; }

        public GetCurrentLoginInformationsOutput LoginInformations { get; set; }

        public string GetLogoUrl(string appPath, string logoSkin)
        {
            if (LoginInformations?.Tenant?.LogoId == null)
            {
                return appPath + $"Common/Images/app-logo-on-{logoSkin}.svg";
            }

            //id parameter is used to prevent caching only.
            return appPath + "TenantCustomization/GetLogo?tenantId=" + LoginInformations?.Tenant?.Id;
        }
    }
}
