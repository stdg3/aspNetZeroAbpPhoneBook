using Microsoft.AspNetCore.Mvc;
using CCPDemo.Web.Controllers;

namespace CCPDemo.Web.Public.Controllers
{
    public class HomeController : CCPDemoControllerBase
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}