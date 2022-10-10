using Abp.AspNetCore.Mvc.ViewComponents;

namespace CCPDemo.Web.Public.Views
{
    public abstract class CCPDemoViewComponent : AbpViewComponent
    {
        protected CCPDemoViewComponent()
        {
            LocalizationSourceName = CCPDemoConsts.LocalizationSourceName;
        }
    }
}