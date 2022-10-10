using Abp.Authorization;
using CCPDemo.Authorization.Roles;
using CCPDemo.Authorization.Users;

namespace CCPDemo.Authorization
{
    public class PermissionChecker : PermissionChecker<Role, User>
    {
        public PermissionChecker(UserManager userManager)
            : base(userManager)
        {

        }
    }
}
