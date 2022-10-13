using Abp.AutoMapper;
using CCPDemo.Dto;
using CCPDemo.InterfacePerson;
using CCPDemo.Web.Areas.App.Models.PhoneBook;
using CCPDemo.Web.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace CCPDemo.Web.Areas.App.Controllers
{
    [Area("App")]
    public class PhoneBookController : CCPDemoControllerBase
    {
        private readonly IPersonAppService _personAppService;

        public PhoneBookController(IPersonAppService personAppService)
        {
            _personAppService = personAppService;
        }
        public ActionResult Index(GetPeopleInput input)
        {
            var output = _personAppService.GetPeople(input);
            var model = ObjectMapper.Map<IndexViewModel>(output);
            return View(model);
        }
    }
}
