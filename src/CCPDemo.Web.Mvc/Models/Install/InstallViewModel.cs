using System.Collections.Generic;
using Abp.Localization;
using CCPDemo.Install.Dto;

namespace CCPDemo.Web.Models.Install
{
    public class InstallViewModel
    {
        public List<ApplicationLanguage> Languages { get; set; }

        public AppSettingsJsonDto AppSettingsJson { get; set; }
    }
}
