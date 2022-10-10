using System.Collections.Generic;
using CCPDemo.Editions.Dto;

namespace CCPDemo.Web.Areas.App.Models.Tenants
{
    public class TenantIndexViewModel
    {
        public List<SubscribableEditionComboboxItemDto> EditionItems { get; set; }
    }
}