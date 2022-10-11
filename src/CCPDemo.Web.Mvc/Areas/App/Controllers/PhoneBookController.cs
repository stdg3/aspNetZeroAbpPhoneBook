using CCPDemo.Web.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace CCPDemo.Web.Areas.App.Controllers
{
    [Area("App")]
    public class PhoneBookController : CCPDemoControllerBase  
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
