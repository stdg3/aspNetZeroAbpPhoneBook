using System.Collections.Generic;
using Abp.Application.Services.Dto;
using CCPDemo.Configuration.Host.Dto;
using CCPDemo.Editions.Dto;

namespace CCPDemo.Web.Areas.App.Models.HostSettings
{
    public class HostSettingsViewModel
    {
        public HostSettingsEditDto Settings { get; set; }

        public List<SubscribableEditionComboboxItemDto> EditionItems { get; set; }

        public List<ComboboxItemDto> TimezoneItems { get; set; }

        public List<string> EnabledSocialLoginSettings { get; set; } = new List<string>();
    }
}