using System.Collections.Generic;
using Abp.AspNetZeroCore.Web.Authentication.External;
using Abp.AspNetZeroCore.Web.Authentication.External.Twitter;
using Abp.Configuration;
using Abp.Dependency;
using Abp.Extensions;
using Abp.Json;
using Abp.Runtime.Caching;
using Abp.Runtime.Session;
using CCPDemo.Authentication;
using CCPDemo.Configuration;

namespace CCPDemo.Web.Startup.ExternalLoginInfoProviders
{
    public class TenantBasedTwitterExternalLoginInfoProvider : TenantBasedExternalLoginInfoProviderBase,
        ISingletonDependency
    {
        private readonly ISettingManager _settingManager;
        private readonly IAbpSession _abpSession;

        public override string Name { get; } = TwitterAuthProviderApi.Name;

        public TenantBasedTwitterExternalLoginInfoProvider(
            ISettingManager settingManager,
            IAbpSession abpSession,
            ICacheManager cacheManager) : base(abpSession, cacheManager)
        {
            _settingManager = settingManager;
            _abpSession = abpSession;
        }

        private ExternalLoginProviderInfo CreateExternalLoginInfo(TwitterExternalLoginProviderSettings settings)
        {
            return new ExternalLoginProviderInfo(
                Name,
                settings.ConsumerKey,
                settings.ConsumerSecret,
                typeof(TwitterAuthProviderApi)
            );
        }

        protected override bool TenantHasSettings()
        {
            var settingValue = _settingManager.GetSettingValueForTenant(
                AppSettings.ExternalLoginProvider.Tenant.Twitter,
                _abpSession.GetTenantId()
            );

            return !settingValue.IsNullOrWhiteSpace();
        }

        protected override ExternalLoginProviderInfo GetTenantInformation()
        {
            var settingValue = _settingManager.GetSettingValueForTenant(
                AppSettings.ExternalLoginProvider.Tenant.Twitter,
                _abpSession.GetTenantId()
            );
            
            var settings = settingValue.FromJsonString<TwitterExternalLoginProviderSettings>();
            return CreateExternalLoginInfo(settings);
        }

        protected override ExternalLoginProviderInfo GetHostInformation()
        {
            var settingValue = _settingManager.GetSettingValueForApplication(AppSettings.ExternalLoginProvider.Host.Twitter);
            var settings = settingValue.FromJsonString<TwitterExternalLoginProviderSettings>();
            return CreateExternalLoginInfo(settings);
        }
    }
}
