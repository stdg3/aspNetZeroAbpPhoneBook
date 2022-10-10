using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using CCPDemo.Authorization;
using CCPDemo.Web.Controllers;

namespace CCPDemo.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize]
    public class WidgetsController : CCPDemoControllerBase
    {
        #region Host

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_Host_Dashboard)]
        public IActionResult EditionStatistics()
        {
            return PartialView("Components/CustomizableDashboard/Widgets/EditionStatistics");
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_Host_Dashboard)]
        public IActionResult HostTopStats()
        {
            return PartialView("Components/CustomizableDashboard/Widgets/HostTopStats");
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_Host_Dashboard)]
        public IActionResult IncomeStatistics()
        {
            return PartialView("Components/CustomizableDashboard/Widgets/IncomeStatistics");
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_Host_Dashboard)]
        public IActionResult RecentTenants()
        {
            return PartialView("Components/CustomizableDashboard/Widgets/RecentTenants");
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Administration_Host_Dashboard)]
        public IActionResult SubscriptionExpiringTenants()
        {
            return PartialView("Components/CustomizableDashboard/Widgets/SubscriptionExpiringTenants");
        }

        #endregion

        #region Tenant

        [AbpMvcAuthorize(AppPermissions.Pages_Tenant_Dashboard)]
        public IActionResult DailySales()
        {
            return PartialView("Components/CustomizableDashboard/Widgets/DailySales");
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Tenant_Dashboard)]
        public IActionResult GeneralStats()
        {
            return PartialView("Components/CustomizableDashboard/Widgets/GeneralStats");
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Tenant_Dashboard)]
        public IActionResult MemberActivity()
        {
            return PartialView("Components/CustomizableDashboard/Widgets/MemberActivity");
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Tenant_Dashboard)]
        public IActionResult ProfitShare()
        {
            return PartialView("Components/CustomizableDashboard/Widgets/ProfitShare");
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Tenant_Dashboard)]
        public IActionResult RegionalStats()
        {
            return PartialView("Components/CustomizableDashboard/Widgets/RegionalStats");
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Tenant_Dashboard)]
        public IActionResult SalesSummary()
        {
            return PartialView("Components/CustomizableDashboard/Widgets/SalesSummary");
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Tenant_Dashboard)]
        public IActionResult TopStats()
        {
            return PartialView("Components/CustomizableDashboard/Widgets/TopStats");
        }

        #endregion
    }
}
