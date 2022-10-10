using System.Collections.Generic;
using Abp.Configuration;
using Abp.Extensions;
using Abp.Json;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Authentication.MicrosoftAccount;
using Microsoft.Extensions.Options;
using CCPDemo.Authentication;
using CCPDemo.Configuration;

namespace CCPDemo.Web.Startup.AuthConfigurers
{
    public class TenantBasedMicrosoftAccountOptions : TenantBasedSocialLoginOptionsBase<MicrosoftAccountOptions, MicrosoftExternalLoginProviderSettings>
    {
        private readonly ISettingManager _settingManager;

        public TenantBasedMicrosoftAccountOptions(
            IOptionsFactory<MicrosoftAccountOptions> factory,
            IEnumerable<IOptionsChangeTokenSource<MicrosoftAccountOptions>> sources,
            IOptionsMonitorCache<MicrosoftAccountOptions> cache,
            ISettingManager settingManager
            ) : base(factory, sources, cache)
        {
            AbpSession = NullAbpSession.Instance;
            _settingManager = settingManager;
        }

        protected override bool TenantHasSettings()
        {
            var settingValue = _settingManager.GetSettingValueForTenant(AppSettings.ExternalLoginProvider.Tenant.Microsoft, AbpSession.TenantId.Value);
            return !settingValue.IsNullOrWhiteSpace();
        }

        protected override MicrosoftExternalLoginProviderSettings GetTenantSettings()
        {
            var settingValue = _settingManager.GetSettingValueForTenant(AppSettings.ExternalLoginProvider.Tenant.Microsoft, AbpSession.TenantId.Value);
            return settingValue.FromJsonString<MicrosoftExternalLoginProviderSettings>();
        }

        protected override MicrosoftExternalLoginProviderSettings GetHostSettings()
        {
            var settingValue = _settingManager.GetSettingValueForApplication(AppSettings.ExternalLoginProvider.Host.Microsoft);
            return settingValue.FromJsonString<MicrosoftExternalLoginProviderSettings>();
        }

        protected override void SetOptions(MicrosoftAccountOptions options, MicrosoftExternalLoginProviderSettings settings)
        {
            options.ClientId = settings.ClientId;
            options.ClientSecret = settings.ClientSecret;
        }
    }
}
