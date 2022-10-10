using System.Collections.Generic;
using MvvmHelpers;
using CCPDemo.Models.NavigationMenu;

namespace CCPDemo.Services.Navigation
{
    public interface IMenuProvider
    {
        ObservableRangeCollection<NavigationMenuItem> GetAuthorizedMenuItems(Dictionary<string, string> grantedPermissions);
    }
}