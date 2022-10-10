using System.Collections.Generic;
using Abp.Configuration;
using Abp.Extensions;
using Abp.Json;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.Extensions.Options;
using CCPDemo.Authentication;
using CCPDemo.Configuration;

namespace CCPDemo.Web.Startup.AuthConfigurers
{
    public class TenantBasedFacebookOptions : TenantBasedSocialLoginOptionsBase<FacebookOptions, FacebookExternalLoginProviderSettings>
    {
        private readonly ISettingManager _settingManager;

        public TenantBasedFacebookOptions(
            IOptionsFactory<FacebookOptions> factory,
            IEnumerable<IOptionsChangeTokenSource<FacebookOptions>> sources,
            IOptionsMonitorCache<FacebookOptions> cache,
            ISettingManager settingManager
            ) : base(factory, sources, cache)
        {
            AbpSession = NullAbpSession.Instance;
            _settingManager = settingManager;
        }

        protected override bool TenantHasSettings()
        {
            var settingValue = _settingManager.GetSettingValueForTenant(AppSettings.ExternalLoginProvider.Tenant.Facebook, AbpSession.TenantId.Value);
            return !settingValue.IsNullOrWhiteSpace();
        }

        protected override FacebookExternalLoginProviderSettings GetTenantSettings()
        {
            string settingValue = _settingManager.GetSettingValueForTenant(AppSettings.ExternalLoginProvider.Tenant.Facebook, AbpSession.TenantId.Value);
            return settingValue.FromJsonString<FacebookExternalLoginProviderSettings>();
        }

        protected override FacebookExternalLoginProviderSettings GetHostSettings()
        {
            string settingValue = _settingManager.GetSettingValueForApplication(AppSettings.ExternalLoginProvider.Host.Facebook);
            return settingValue.FromJsonString<FacebookExternalLoginProviderSettings>();
        }

        protected override void SetOptions(FacebookOptions options, FacebookExternalLoginProviderSettings settings)
        {
            options.AppId = settings.AppId;
            options.AppSecret = settings.AppSecret;
            options.Scope.Add("email");
            options.Scope.Add("public_profile");
        }
    }
}
