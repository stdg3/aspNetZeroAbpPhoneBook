using Abp.Application.Navigation;

namespace CCPDemo.Web.Areas.App.Models.Layout
{
    public class MenuViewModel
    {
        public UserMenu Menu { get; set; }

        public string Height { get; set; }
        
        public string CurrentPageName { get; set; }
        
        public bool IconMenu { get; set; }
    }
}
