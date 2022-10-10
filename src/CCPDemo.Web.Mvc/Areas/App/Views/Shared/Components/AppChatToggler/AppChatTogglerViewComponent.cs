using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CCPDemo.Web.Areas.App.Models.Layout;
using CCPDemo.Web.Views;

namespace CCPDemo.Web.Areas.App.Views.Shared.Components.AppChatToggler
{
    public class AppChatTogglerViewComponent : CCPDemoViewComponent
    {
        public Task<IViewComponentResult> InvokeAsync(string cssClass, string iconClass = "flaticon-chat-2 fs-2")
        {
            return Task.FromResult<IViewComponentResult>(View(new ChatTogglerViewModel
            {
                CssClass = cssClass,
                IconClass = iconClass
            }));
        }
    }
}
