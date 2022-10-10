using Abp.Dependency;
using Abp.Runtime.Session;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.MicrosoftAccount;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authentication.Twitter;
using Microsoft.AspNetCore.Authentication.WsFederation;
using Microsoft.Extensions.Options;
using CCPDemo.Configuration;

namespace CCPDemo.Web.Startup.AuthConfigurers
{
    public class ExternalLoginOptionsCacheManager : IExternalLoginOptionsCacheManager, ITransientDependency
    {
        public IAbpSession AbpSession { get; set; }
        private readonly IOptionsMonitorCache<FacebookOptions> _facebookOptionsCache;
        private readonly IOptionsMonitorCache<GoogleOptions> _googleOptionsCache;
        private readonly IOptionsMonitorCache<TwitterOptions> _twitterOptionsCache;
        private readonly IOptionsMonitorCache<MicrosoftAccountOptions> _microsoftOptionsCache;
        private readonly IOptionsMonitorCache<OpenIdConnectOptions> _openIdConnectOptionsCache;
        private readonly IOptionsMonitorCache<WsFederationOptions> _wsFederationOptionsCache;

        public ExternalLoginOptionsCacheManager(
            IOptionsMonitorCache<FacebookOptions> facebookOptionsCache,
            IOptionsMonitorCache<GoogleOptions> googleOptionsCache,
            IOptionsMonitorCache<TwitterOptions> twitterOptionsCache,
            IOptionsMonitorCache<MicrosoftAccountOptions> microsoftOptionsCache,
            IOptionsMonitorCache<OpenIdConnectOptions> openIdConnectOptionsCache,
            IOptionsMonitorCache<WsFederationOptions> wsFederationOptionsCache)
        {
            AbpSession = NullAbpSession.Instance;

            _facebookOptionsCache = facebookOptionsCache;
            _googleOptionsCache = googleOptionsCache;
            _twitterOptionsCache = twitterOptionsCache;
            _microsoftOptionsCache = microsoftOptionsCache;
            _openIdConnectOptionsCache = openIdConnectOptionsCache;
            _wsFederationOptionsCache = wsFederationOptionsCache;
        }

        public void ClearCache()
        {
            ClearFacebookCache();
            ClearGoogleCache();
            ClearTwitterCache();
            ClearMicrosoftAccountOptionsCache();
            ClearOpenIdConnectOptionsCache();
            ClearWsFederationOptionsCache();
            //add your other caches here
        }

        private void ClearWsFederationOptionsCache()
        {
            _wsFederationOptionsCache.TryRemove(GetCacheKey("WsFederation"));
        }
        
        private void ClearOpenIdConnectOptionsCache()
        {
            _openIdConnectOptionsCache.TryRemove(GetCacheKey("OpenIdConnect"));
        }

        private void ClearMicrosoftAccountOptionsCache()
        {
            _microsoftOptionsCache.TryRemove(GetCacheKey("Microsoft"));
        }

        private void ClearTwitterCache()
        {
            _twitterOptionsCache.TryRemove(GetCacheKey("Twitter"));
        }

        private void ClearGoogleCache()
        {
            _googleOptionsCache.TryRemove(GetCacheKey("Google"));
        }

        private void ClearFacebookCache()
        {
            _facebookOptionsCache.TryRemove(GetCacheKey("Facebook"));
        }

        private string GetCacheKey(string name)
        {
            if (AbpSession.TenantId.HasValue)
            {
                return $"{name}-{AbpSession.TenantId.Value}";
            }

            return name;
        }
    }
}