using Abp.AspNetCore.Mvc.Views;

namespace CCPDemo.Web.Views
{
    public abstract class CCPDemoRazorPage<TModel> : AbpRazorPage<TModel>
    {
        protected CCPDemoRazorPage()
        {
            LocalizationSourceName = CCPDemoConsts.LocalizationSourceName;
        }
    }
}
