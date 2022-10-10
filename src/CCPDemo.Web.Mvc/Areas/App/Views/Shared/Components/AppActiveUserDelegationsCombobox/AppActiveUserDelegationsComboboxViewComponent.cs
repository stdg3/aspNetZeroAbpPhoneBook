using System.Threading.Tasks;
using Abp.Domain.Uow;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using CCPDemo.Authorization.Delegation;
using CCPDemo.Authorization.Users.Delegation;
using CCPDemo.Web.Areas.App.Models.Layout;
using CCPDemo.Web.Views;

namespace CCPDemo.Web.Areas.App.Views.Shared.Components.
    AppActiveUserDelegationsCombobox
{
    public class AppActiveUserDelegationsComboboxViewComponent : CCPDemoViewComponent
    {
        private readonly IUserDelegationAppService _userDelegationAppService;
        private readonly IUserDelegationConfiguration _userDelegationConfiguration;
        private readonly IUnitOfWorkManager _unitOfWorkManager;

        public AppActiveUserDelegationsComboboxViewComponent(
            IUserDelegationAppService userDelegationAppService,
            IUserDelegationConfiguration userDelegationConfiguration,
            IUnitOfWorkManager unitOfWorkManager)
        {
            _userDelegationAppService = userDelegationAppService;
            _userDelegationConfiguration = userDelegationConfiguration;
            _unitOfWorkManager = unitOfWorkManager;
        }

        public async Task<IViewComponentResult> InvokeAsync(string logoSkin = null, string logoClass = "", string cssClass = "d-flex align-items-center ms-1 ms-lg-3 active-user-delegations me-2")
        {
            return await _unitOfWorkManager.WithUnitOfWorkAsync(async () =>
            {
                var activeUserDelegations = await _userDelegationAppService.GetActiveUserDelegations();
                var model = new ActiveUserDelegationsComboboxViewModel
                {
                    UserDelegations = activeUserDelegations,
                    UserDelegationConfiguration = _userDelegationConfiguration,
                    CssClass = cssClass
                };

                return View(model);
            });
        }
    }
}
