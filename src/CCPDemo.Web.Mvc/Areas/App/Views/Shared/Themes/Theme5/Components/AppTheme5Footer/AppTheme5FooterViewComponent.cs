using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CCPDemo.Web.Areas.App.Models.Layout;
using CCPDemo.Web.Session;
using CCPDemo.Web.Views;

namespace CCPDemo.Web.Areas.App.Views.Shared.Themes.Theme5.Components.AppTheme5Footer
{
    public class AppTheme5FooterViewComponent : CCPDemoViewComponent
    {
        private readonly IPerRequestSessionCache _sessionCache;

        public AppTheme5FooterViewComponent(IPerRequestSessionCache sessionCache)
        {
            _sessionCache = sessionCache;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var footerModel = new FooterViewModel
            {
                LoginInformations = await _sessionCache.GetCurrentLoginInformationsAsync()
            };

            return View(footerModel);
        }
    }
}
