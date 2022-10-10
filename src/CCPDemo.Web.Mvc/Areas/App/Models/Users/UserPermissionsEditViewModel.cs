using Abp.AutoMapper;
using CCPDemo.Authorization.Users;
using CCPDemo.Authorization.Users.Dto;
using CCPDemo.Web.Areas.App.Models.Common;

namespace CCPDemo.Web.Areas.App.Models.Users
{
    [AutoMapFrom(typeof(GetUserPermissionsForEditOutput))]
    public class UserPermissionsEditViewModel : GetUserPermissionsForEditOutput, IPermissionsEditViewModel
    {
        public User User { get; set; }
    }
}