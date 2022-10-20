using Abp.Application.Services.Dto;
using Abp.AspNetCore.Mvc.Authorization;
using Abp.AutoMapper;
using CCPDemo.Authorization;
using CCPDemo.Dto;
using CCPDemo.InterfacePerson;
using CCPDemo.InterfacePhoneType;
using CCPDemo.Web.Areas.App.Models.PhoneBook;
using CCPDemo.Web.Controllers;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace CCPDemo.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize(AppPermissions.Pages_Tenant_PhoneBook)]
    public class PhoneBookController : CCPDemoControllerBase
    {
        private readonly IPersonAppService _personAppService;
        private readonly IPhoneTypeService _phoneTypeAppService;

        public PhoneBookController(IPersonAppService personAppService, IPhoneTypeService phoneTypeAppService)
        {
            _personAppService = personAppService;
            _phoneTypeAppService = phoneTypeAppService;

        }
        public ActionResult Index(GetPeopleInput input)
        {
            var output = _personAppService.GetPeople(input);
            var model = ObjectMapper.Map<IndexViewModel>(output);
            model.Filter = input.Filter;

            var pp = _phoneTypeAppService.GetPhoneType(new GetPhoneTypeInput());

            ViewBag.PhoneTypes = pp;
            return View(model);
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Tenant_PhoneBook_CreatePerson)]
        public PartialViewResult CreatePersonModal()
        {
            return PartialView("_CreatePersonModal");
        }

        [HttpPost]
        public async Task<PartialViewResult> AddPhone([FromBody] AddPhoneInput input)
        {
            PhoneInPersonListDto phoneInPersonList = await _personAppService.AddPhone(input);
            var model = new PhoneRowInPersonListViewModel(phoneInPersonList);

            return PartialView("_PhoneRowInPersonList", model);
        }

        public async Task<PartialViewResult> EditPersonModal(int id)
        {
            var output = await _personAppService.GetPersonForEdit(new EntityDto { Id = id });
            var viewModel = ObjectMapper.Map<EditPersonModalViewModel>(output);

            return PartialView("_EditPersonModal", viewModel);
        }
    }
}
