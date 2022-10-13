using System;
using System.Threading.Tasks;
using Abp.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc;
using CCPDemo.Web.Areas.App.Models.Persons;
using CCPDemo.Web.Controllers;
using CCPDemo.Authorization;
using CCPDemo.Persons;
using CCPDemo.Persons.Dtos;
using Abp.Application.Services.Dto;
using Abp.Extensions;

namespace CCPDemo.Web.Areas.App.Controllers
{
    [Area("App")]
    [AbpMvcAuthorize(AppPermissions.Pages_Persons)]
    public class PersonsController : CCPDemoControllerBase
    {
        private readonly IPersonsAppService _personsAppService;

        public PersonsController(IPersonsAppService personsAppService)
        {
            _personsAppService = personsAppService;

        }

        public ActionResult Index()
        {
            var model = new PersonsViewModel
            {
                FilterText = ""
            };

            return View(model);
        }

        [AbpMvcAuthorize(AppPermissions.Pages_Persons_Create, AppPermissions.Pages_Persons_Edit)]
        public async Task<PartialViewResult> CreateOrEditModal(int? id)
        {
            GetPersonForEditOutput getPersonForEditOutput;

            if (id.HasValue)
            {
                getPersonForEditOutput = await _personsAppService.GetPersonForEdit(new EntityDto { Id = (int)id });
            }
            else
            {
                getPersonForEditOutput = new GetPersonForEditOutput
                {
                    Person = new CreateOrEditPersonDto()
                };
            }

            var viewModel = new CreateOrEditPersonModalViewModel()
            {
                Person = getPersonForEditOutput.Person,

            };

            return PartialView("_CreateOrEditModal", viewModel);
        }

        public async Task<PartialViewResult> ViewPersonModal(int id)
        {
            var getPersonForViewDto = await _personsAppService.GetPersonForView(id);

            var model = new PersonViewModel()
            {
                Person = getPersonForViewDto.Person
            };

            return PartialView("_ViewPersonModal", model);
        }

    }
}