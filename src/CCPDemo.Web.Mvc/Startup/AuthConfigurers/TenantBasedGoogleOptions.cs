using System.Collections.Generic;
using System.Security.Claims;
using Abp.Configuration;
using Abp.Extensions;
using Abp.Json;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.Extensions.Options;
using CCPDemo.Authentication;
using CCPDemo.Configuration;

namespace CCPDemo.Web.Startup.AuthConfigurers
{
    public class TenantBasedGoogleOptions : TenantBasedSocialLoginOptionsBase<GoogleOptions, GoogleExternalLoginProviderSettings>
    {
        private readonly ISettingManager _settingManager;

        public TenantBasedGoogleOptions(
            IOptionsFactory<GoogleOptions> factory,
            IEnumerable<IOptionsChangeTokenSource<GoogleOptions>> sources,
            IOptionsMonitorCache<GoogleOptions> cache,
            ISettingManager settingManager
            ) : base(factory, sources, cache)
        {
            AbpSession = NullAbpSession.Instance;

            _settingManager = settingManager;
        }

        protected override bool TenantHasSettings()
        {
            var settingValue = _settingManager.GetSettingValueForTenant(AppSettings.ExternalLoginProvider.Tenant.Google, AbpSession.TenantId.Value);
            return !settingValue.IsNullOrWhiteSpace();
        }

        protected override GoogleExternalLoginProviderSettings GetTenantSettings()
        {
            var settingValue = _settingManager.GetSettingValueForTenant(AppSettings.ExternalLoginProvider.Tenant.Google, AbpSession.TenantId.Value);

            var settings = settingValue.FromJsonString<GoogleExternalLoginProviderSettings>();

            if (settings.UserInfoEndpoint.IsNullOrWhiteSpace())
            {
                var hostSettingsValue = _settingManager.GetSettingValueForApplication(AppSettings.ExternalLoginProvider.Host.Google);
                var hostSettings = hostSettingsValue.FromJsonString<GoogleExternalLoginProviderSettings>();
                settings.UserInfoEndpoint = hostSettings.UserInfoEndpoint;
            }

            return settings;
        }

        protected override GoogleExternalLoginProviderSettings GetHostSettings()
        {
            var settingValue = _settingManager.GetSettingValueForApplication(AppSettings.ExternalLoginProvider.Host.Google);
            return settingValue.FromJsonString<GoogleExternalLoginProviderSettings>();
        }

        protected override void SetOptions(GoogleOptions options, GoogleExternalLoginProviderSettings settings)
        {
            options.ClientId = settings.ClientId;
            options.ClientSecret = settings.ClientSecret;

            options.UserInformationEndpoint = settings.UserInfoEndpoint;
            options.ClaimActions.Clear();

            options.ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "id");
            options.ClaimActions.MapJsonKey(ClaimTypes.Name, "name");
            options.ClaimActions.MapJsonKey(ClaimTypes.GivenName, "given_name");
            options.ClaimActions.MapJsonKey(ClaimTypes.Surname, "family_name");
            options.ClaimActions.MapJsonKey(ClaimTypes.Email, "email");
        }
    }
}
