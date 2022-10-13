using Abp.AspNetCore.Mvc.Authorization;
using Abp.AutoMapper;
using CCPDemo.Authorization;
using CCPDemo.Dto;
using CCPDemo.InterfacePerson;
using CCPDemo.Web.Areas.App.Models.PhoneBook;
using CCPDemo.Web.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace CCPDemo.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize(AppPermissions.Pages_Tenant_PhoneBook)]
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
            model.Filter = input.Filter;
            return View(model);
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Tenant_PhoneBook_CreatePerson)]
        public PartialViewResult CreatePersonModal()
        {
            return PartialView("_CreatePersonModal");
        }
    }
}
