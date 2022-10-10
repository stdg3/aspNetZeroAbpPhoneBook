using System.Collections.Generic;
using Abp.Application.Services.Dto;
using CCPDemo.Authorization.Permissions.Dto;
using CCPDemo.Web.Areas.App.Models.Common;

namespace CCPDemo.Web.Areas.App.Models.Roles
{
    public class RoleListViewModel : IPermissionsEditViewModel
    {
        public List<FlatPermissionDto> Permissions { get; set; }

        public List<string> GrantedPermissionNames { get; set; }
    }
}