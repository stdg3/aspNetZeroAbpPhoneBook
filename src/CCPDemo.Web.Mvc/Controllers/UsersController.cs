using Abp.AspNetCore.Mvc.Authorization;
using CCPDemo.Authorization;
using CCPDemo.Storage;
using Abp.BackgroundJobs;
using Abp.Authorization;

namespace CCPDemo.Web.Controllers
{
    [AbpMvcAuthorize(AppPermissions.Pages_Administration_Users)]
    public class UsersController : UsersControllerBase
    {
        public UsersController(IBinaryObjectManager binaryObjectManager, IBackgroundJobManager backgroundJobManager)
            : base(binaryObjectManager, backgroundJobManager)
        {
        }
    }
}