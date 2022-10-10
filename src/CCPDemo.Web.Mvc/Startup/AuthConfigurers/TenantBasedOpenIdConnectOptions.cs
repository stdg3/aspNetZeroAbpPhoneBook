using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.AspNetZeroCore.Web.Authentication.External;
using Abp.Configuration;
using Abp.Extensions;
using Abp.Json;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using CCPDemo.Authentication;
using CCPDemo.Configuration;

namespace CCPDemo.Web.Startup.AuthConfigurers
{
    public class TenantBasedOpenIdConnectOptions : TenantBasedSocialLoginOptionsBase<OpenIdConnectOptions,
        OpenIdConnectExternalLoginProviderSettings>
    {
        private readonly ISettingManager _settingManager;
        private readonly IAppConfigurationAccessor _configurationAccessor;

        public TenantBasedOpenIdConnectOptions(
            IOptionsFactory<OpenIdConnectOptions> factory,
            IEnumerable<IOptionsChangeTokenSource<OpenIdConnectOptions>> sources,
            IOptionsMonitorCache<OpenIdConnectOptions> cache,
            ISettingManager settingManager,
            IAppConfigurationAccessor configurationAccessor
        ) : base(factory, sources, cache)
        {
            AbpSession = NullAbpSession.Instance;
            _settingManager = settingManager;
            _configurationAccessor = configurationAccessor;
        }

        protected override bool TenantHasSettings()
        {
            var settingValue = _settingManager.GetSettingValueForTenant(AppSettings.ExternalLoginProvider.Tenant.OpenIdConnect, AbpSession.TenantId.Value);
            return !settingValue.IsNullOrWhiteSpace();
        }

        protected override OpenIdConnectExternalLoginProviderSettings GetTenantSettings()
        {
            var settingValue = _settingManager.GetSettingValueForTenant(AppSettings.ExternalLoginProvider.Tenant.OpenIdConnect, AbpSession.TenantId.Value);
            return settingValue.FromJsonString<OpenIdConnectExternalLoginProviderSettings>();
        }

        protected override OpenIdConnectExternalLoginProviderSettings GetHostSettings()
        {
            var settingValue = _settingManager.GetSettingValueForApplication(AppSettings.ExternalLoginProvider.Host.OpenIdConnect);
            return settingValue.FromJsonString<OpenIdConnectExternalLoginProviderSettings>();
        }

        protected override void SetOptions(OpenIdConnectOptions options, OpenIdConnectExternalLoginProviderSettings settings)
        {
            options.ClientId = settings.ClientId;
            options.Authority = settings.Authority;
            options.SignedOutRedirectUri = _configurationAccessor.Configuration["App:WebSiteRootAddress"] + "Account/Logout";
            options.ResponseType = OpenIdConnectResponseType.IdToken;
            options.TokenValidationParameters = new TokenValidationParameters()
            {
                ValidateIssuer = settings.ValidateIssuer
            };

            HandleOnTokenValidated(options);

            var clientSecret = settings.ClientSecret;
            if (!clientSecret.IsNullOrEmpty())
            {
                options.ClientSecret = clientSecret;
            }

            if (string.IsNullOrWhiteSpace(options.SignInScheme))
            {
                options.SignInScheme = IdentityConstants.ExternalScheme;
            }

            if (string.IsNullOrEmpty(options.SignOutScheme))
            {
                options.SignOutScheme = options.SignInScheme;
            }
           
            options.TokenValidationParameters.ValidAudience = options.ClientId;            

            options.MetadataAddress = options.Authority;
            if (!options.MetadataAddress.EndsWith("/", StringComparison.Ordinal))
            {
                options.MetadataAddress += "/";
            }

            options.MetadataAddress += ".well-known/openid-configuration";

            if (options.RequireHttpsMetadata && !options.MetadataAddress.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException(
                    "The MetadataAddress or Authority must use HTTPS if RequireHttpsMetadata=true.");
            }

            options.ConfigurationManager = new ConfigurationManager<OpenIdConnectConfiguration>(
                options.MetadataAddress,
                new OpenIdConnectConfigurationRetriever(),
                new HttpDocumentRetriever(options.Backchannel) {RequireHttps = options.RequireHttpsMetadata});
        }

        protected virtual void HandleOnTokenValidated(OpenIdConnectOptions options)
        {
            var mappedClaimsString = _settingManager.GetSettingValue(AppSettings.ExternalLoginProvider.OpenIdConnectMappedClaims);
            var mappedClaims = mappedClaimsString.FromJsonString<List<JsonClaimMap>>() ?? new List<JsonClaimMap>();

            options.Events.OnTokenValidated = context =>
            {
                context.AddMappedClaims(mappedClaims);
                return Task.FromResult(0);
            };
        }
    }
}
