using System.Collections.Generic;
using Abp.Configuration;
using Abp.Extensions;
using Abp.Json;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Authentication.Twitter;
using Microsoft.Extensions.Options;
using CCPDemo.Authentication;
using CCPDemo.Configuration;

namespace CCPDemo.Web.Startup.AuthConfigurers
{
    public class TenantBasedTwitterOptions : TenantBasedSocialLoginOptionsBase<TwitterOptions, TwitterExternalLoginProviderSettings>
    {
        private readonly ISettingManager _settingManager;

        public TenantBasedTwitterOptions(
            IOptionsFactory<TwitterOptions> factory,
            IEnumerable<IOptionsChangeTokenSource<TwitterOptions>> sources,
            IOptionsMonitorCache<TwitterOptions> cache,
            ISettingManager settingManager
            ) : base(factory, sources, cache)
        {
            AbpSession = NullAbpSession.Instance;

            _settingManager = settingManager;
        }

        protected override bool TenantHasSettings()
        {
            var settingValue = _settingManager.GetSettingValueForTenant(AppSettings.ExternalLoginProvider.Tenant.Twitter, AbpSession.TenantId.Value);
            return !settingValue.IsNullOrWhiteSpace();
        }

        protected override TwitterExternalLoginProviderSettings GetTenantSettings()
        {
            var settingValue = _settingManager.GetSettingValueForTenant(AppSettings.ExternalLoginProvider.Tenant.Twitter, AbpSession.TenantId.Value);

            return settingValue.FromJsonString<TwitterExternalLoginProviderSettings>();
        }

        protected override TwitterExternalLoginProviderSettings GetHostSettings()
        {
            var settingValue = _settingManager.GetSettingValueForApplication(AppSettings.ExternalLoginProvider.Host.Twitter);
            return settingValue.FromJsonString<TwitterExternalLoginProviderSettings>();
        }

        protected override void SetOptions(TwitterOptions options, TwitterExternalLoginProviderSettings settings)
        {
            options.ConsumerKey = options.ConsumerKey;
            options.ConsumerSecret = options.ConsumerSecret;
            options.RetrieveUserDetails = true;
        }
    }
}
