using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CCPDemo.Web.Areas.App.Models.Layout;
using CCPDemo.Web.Views;

namespace CCPDemo.Web.Areas.App.Views.Shared.Components.AppToggleDarkMode
{
    public class AppToggleDarkModeViewComponent : CCPDemoViewComponent
    {
        public Task<IViewComponentResult> InvokeAsync(string cssClass, bool isDarkModeActive)
        {
            return Task.FromResult<IViewComponentResult>(View(new ToggleDarkModeViewModel(cssClass, isDarkModeActive)));
        }
    }
}