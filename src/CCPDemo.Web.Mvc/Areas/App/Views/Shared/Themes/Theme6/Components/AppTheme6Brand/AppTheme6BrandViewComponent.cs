using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CCPDemo.Web.Areas.App.Models.Layout;
using CCPDemo.Web.Session;
using CCPDemo.Web.Views;

namespace CCPDemo.Web.Areas.App.Views.Shared.Themes.Theme6.Components.AppTheme6Brand
{
    public class AppTheme6BrandViewComponent : CCPDemoViewComponent
    {
        private readonly IPerRequestSessionCache _sessionCache;

        public AppTheme6BrandViewComponent(IPerRequestSessionCache sessionCache)
        {
            _sessionCache = sessionCache;
        }

        public async Task<IViewComponentResult> InvokeAsync(string skin = "dark-sm")
        {
            var headerModel = new HeaderViewModel
            {
                LoginInformations = await _sessionCache.GetCurrentLoginInformationsAsync(),
            };

            ViewBag.BrandLogoSkin = skin;

            return View(headerModel);
        }
    }
}
