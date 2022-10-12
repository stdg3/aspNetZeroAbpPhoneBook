using CCPDemo.Web.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace CCPDemo.Web.Areas.App.Controllers
{
    [Area("App")]
    public class PhoneBookController : CCPDemoControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}
