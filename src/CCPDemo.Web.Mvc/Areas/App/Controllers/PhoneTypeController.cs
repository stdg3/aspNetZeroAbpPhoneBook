using CCPDemo.Dto;
using CCPDemo.InterfacePhoneType;
using CCPDemo.Web.Areas.App.Models.PhoneBook.PhoneType;
using CCPDemo.Web.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace CCPDemo.Web.Areas.App.Controllers
{
    [Area("App")]
    public class PhoneTypeController : CCPDemoControllerBase
    {
        private readonly IPhoneTypeService _phoneTypeService;

        public PhoneTypeController(IPhoneTypeService phoneTypeService)
        {
            _phoneTypeService = phoneTypeService;
        }

        public IActionResult Index(GetPhoneTypeInput input)
        {
            var output = _phoneTypeService.GetPhoneType(input);
            var model = ObjectMapper.Map<IndexViewModel>(output);
            return View(model);
        }
    }
}
