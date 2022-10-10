using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CCPDemo.Web.Session;

namespace CCPDemo.Web.Views.Shared.Components.AccountLogo
{
    public class AccountLogoViewComponent : CCPDemoViewComponent
    {
        private readonly IPerRequestSessionCache _sessionCache;

        public AccountLogoViewComponent(IPerRequestSessionCache sessionCache)
        {
            _sessionCache = sessionCache;
        }

        public async Task<IViewComponentResult> InvokeAsync(string skin)
        {
            var loginInfo = await _sessionCache.GetCurrentLoginInformationsAsync();
            return View(new AccountLogoViewModel(loginInfo, skin));
        }
    }
}
