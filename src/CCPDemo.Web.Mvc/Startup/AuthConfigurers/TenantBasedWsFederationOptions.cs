using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.AspNetZeroCore.Web.Authentication.External;
using Abp.Configuration;
using Abp.Extensions;
using Abp.Json;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Authentication.WsFederation;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.WsFederation;
using CCPDemo.Authentication;
using CCPDemo.Configuration;

namespace CCPDemo.Web.Startup.AuthConfigurers
{
    public class TenantBasedWsFederationOptions : TenantBasedSocialLoginOptionsBase<WsFederationOptions,
        WsFederationExternalLoginProviderSettings>
    {
        private readonly ISettingManager _settingManager;

        public TenantBasedWsFederationOptions(
            IOptionsFactory<WsFederationOptions> factory,
            IEnumerable<IOptionsChangeTokenSource<WsFederationOptions>> sources,
            IOptionsMonitorCache<WsFederationOptions> cache,
            ISettingManager settingManager,
            IAppConfigurationAccessor configurationAccessor
        ) : base(factory, sources, cache)
        {
            AbpSession = NullAbpSession.Instance;
            _settingManager = settingManager;
        }

        protected override bool TenantHasSettings()
        {
            var settingValue =
                _settingManager.GetSettingValueForTenant(AppSettings.ExternalLoginProvider.Tenant.WsFederation,
                    AbpSession.TenantId.Value);
            return !settingValue.IsNullOrWhiteSpace();
        }

        protected override WsFederationExternalLoginProviderSettings GetTenantSettings()
        {
            var settingValue =
                _settingManager.GetSettingValueForTenant(AppSettings.ExternalLoginProvider.Tenant.WsFederation,
                    AbpSession.TenantId.Value);
            return settingValue.FromJsonString<WsFederationExternalLoginProviderSettings>();
        }

        protected override WsFederationExternalLoginProviderSettings GetHostSettings()
        {
            var settingValue =
                _settingManager.GetSettingValueForApplication(AppSettings.ExternalLoginProvider.Host.WsFederation);
            return settingValue.FromJsonString<WsFederationExternalLoginProviderSettings>();
        }

        protected override void SetOptions(WsFederationOptions options,
            WsFederationExternalLoginProviderSettings settings)
        {
            options.MetadataAddress = settings.MetaDataAddress;
            options.Wtrealm = settings.Wtrealm;
            HandleOnSecurityTokenValidated(options);

            if (string.IsNullOrWhiteSpace(options.SignInScheme))
            {
                options.SignInScheme = IdentityConstants.ExternalScheme;
            }

            if (string.IsNullOrEmpty(options.SignOutScheme))
            {
                options.SignOutScheme = options.SignInScheme;
            }

            options.TokenValidationParameters.ValidAudience = options.Wtrealm;

            if (options.RequireHttpsMetadata &&
                !options.MetadataAddress.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException(
                    "The MetadataAddress must use HTTPS if RequireHttpsMetadata=true.");
            }

            options.ConfigurationManager = new ConfigurationManager<WsFederationConfiguration>(
                options.MetadataAddress,
                new WsFederationConfigurationRetriever(),
                new HttpDocumentRetriever(options.Backchannel) {RequireHttps = options.RequireHttpsMetadata});
        }

        protected virtual void HandleOnSecurityTokenValidated(WsFederationOptions options)
        {
            var mappedClaimsString =
                _settingManager.GetSettingValue(AppSettings.ExternalLoginProvider.WsFederationMappedClaims);
            var mappedClaims = mappedClaimsString.FromJsonString<List<JsonClaimMap>>() ?? new List<JsonClaimMap>();

            options.Events.OnSecurityTokenValidated = context =>
            {
                context.AddMappedClaims(mappedClaims);
                return Task.FromResult(0);
            };
        }
    }
}