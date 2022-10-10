using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CCPDemo.Web.Areas.App.Models.Layout;
using CCPDemo.Web.Session;
using CCPDemo.Web.Views;

namespace CCPDemo.Web.Areas.App.Views.Shared.Themes.Theme13.Components.AppTheme13Footer
{
    public class AppTheme13FooterViewComponent : CCPDemoViewComponent
    {
        private readonly IPerRequestSessionCache _sessionCache;

        public AppTheme13FooterViewComponent(IPerRequestSessionCache sessionCache)
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
