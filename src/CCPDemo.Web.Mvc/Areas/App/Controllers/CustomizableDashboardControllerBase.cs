using Microsoft.AspNetCore.Mvc;
using CCPDemo.DashboardCustomization;
using CCPDemo.DashboardCustomization.Dto;
using CCPDemo.Web.Areas.App.Models.CustomizableDashboard;
using CCPDemo.Web.Controllers;
using System.Linq;
using System.Threading.Tasks;
using CCPDemo.Web.Areas.App.Startup;

namespace CCPDemo.Web.Areas.App.Controllers
{
    public abstract class CustomizableDashboardControllerBase : CCPDemoControllerBase
    {
        protected readonly IDashboardCustomizationAppService DashboardCustomizationAppService;
        protected readonly DashboardViewConfiguration DashboardViewConfiguration;

        protected CustomizableDashboardControllerBase(
            DashboardViewConfiguration dashboardViewConfiguration,
            IDashboardCustomizationAppService dashboardCustomizationAppService)
        {
            DashboardViewConfiguration = dashboardViewConfiguration;
            DashboardCustomizationAppService = dashboardCustomizationAppService;
        }

        public async Task<PartialViewResult> AddWidgetModal(string dashboardName, string pageId)
        {
            var availableWidgets = await DashboardCustomizationAppService.GetAllAvailableWidgetDefinitionsForPage(
                new GetAvailableWidgetDefinitionsForPageInput()
                {
                    Application = CCPDemoDashboardCustomizationConsts.Applications.Mvc,
                    PageId = pageId,
                    DashboardName = dashboardName
                });

            var viewModel = new AddWidgetViewModel
            {
                Widgets = availableWidgets,
                DashboardName = dashboardName,
                PageId = pageId
            };

            return PartialView(
                "~/Areas/App/Views/Shared/Components/CustomizableDashboard/_AddWidgetModal.cshtml",
                viewModel
            );
        }

        protected async Task<ActionResult> GetView(string dashboardName)
        {
            var dashboardDefinition = DashboardCustomizationAppService.GetDashboardDefinition(
                new GetDashboardInput
                {
                    DashboardName = dashboardName,
                    Application = CCPDemoDashboardCustomizationConsts.Applications.Mvc
                }
            );

            var userDashboard = await DashboardCustomizationAppService.GetUserDashboard(new GetDashboardInput
                {
                    DashboardName = dashboardName,
                    Application = CCPDemoDashboardCustomizationConsts.Applications.Mvc
                }
            );

            // Show only view defined widgets
            foreach (var userDashboardPage in userDashboard.Pages)
            {
                userDashboardPage.Widgets = userDashboardPage.Widgets
                    .Where(w => DashboardViewConfiguration.WidgetViewDefinitions.ContainsKey(w.WidgetId)).ToList();
            }

            dashboardDefinition.Widgets = dashboardDefinition.Widgets.Where(dw =>
                userDashboard.Pages.Any(p => p.Widgets.Select(w => w.WidgetId).Contains(dw.Id))).ToList();

            return View("~/Areas/App/Views/Shared/Components/CustomizableDashboard/Index.cshtml",
                new CustomizableDashboardViewModel(
                    dashboardDefinition,
                    userDashboard)
            );
        }
    }
}
