using System.Collections.Generic;
using CCPDemo.Authorization.Delegation;
using CCPDemo.Authorization.Users.Delegation.Dto;

namespace CCPDemo.Web.Areas.App.Models.Layout
{
    public class ActiveUserDelegationsComboboxViewModel
    {
        public IUserDelegationConfiguration UserDelegationConfiguration { get; set; }

        public List<UserDelegationDto> UserDelegations { get; set; }

        public string CssClass { get; set; }
    }
}
