using Abp.AspNetCore.Mvc.Views;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Mvc.Razor.Internal;

namespace CCPDemo.Web.Public.Views
{
    public abstract class CCPDemoRazorPage<TModel> : AbpRazorPage<TModel>
    {
        [RazorInject]
        public IAbpSession AbpSession { get; set; }

        protected CCPDemoRazorPage()
        {
            LocalizationSourceName = CCPDemoConsts.LocalizationSourceName;
        }
    }
}
