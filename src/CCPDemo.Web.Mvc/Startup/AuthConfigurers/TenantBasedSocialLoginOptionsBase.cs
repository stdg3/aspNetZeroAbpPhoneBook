using System.Collections.Generic;
using Abp.Runtime.Session;
using Microsoft.Extensions.Options;

namespace CCPDemo.Web.Startup.AuthConfigurers
{
    public abstract class TenantBasedSocialLoginOptionsBase<TOptions, TSettings> : OptionsMonitor<TOptions>
    where TOptions : class, new()
    {
        private readonly IOptionsMonitorCache<TOptions> _cache;
        private readonly IOptionsFactory<TOptions> _factory;
        public IAbpSession AbpSession { get; set; }

        protected TenantBasedSocialLoginOptionsBase(
            IOptionsFactory<TOptions> factory,
            IEnumerable<IOptionsChangeTokenSource<TOptions>> sources,
            IOptionsMonitorCache<TOptions> cache
            ) : base(factory, sources, cache)
        {
            AbpSession = NullAbpSession.Instance;

            _factory = factory;
            _cache = cache;
        }

        protected abstract bool TenantHasSettings();

        protected abstract TSettings GetTenantSettings();

        protected abstract TSettings GetHostSettings();

        protected abstract void SetOptions(TOptions options, TSettings settings);

        public override TOptions Get(string name)
        {
            if (AbpSession.TenantId.HasValue && TenantHasSettings())
            {
                return _cache.GetOrAdd(GetTenantCacheKey(name), () => GetTenantOptions(name));
            }

            return _cache.GetOrAdd(name, () => GetHostOptions(name));
        }

        private TOptions GetTenantOptions(string name)
        {
            var settings = GetTenantSettings();
            return CreateOptions(name, settings);
        }

        private TOptions GetHostOptions(string name)
        {
            var settings = GetHostSettings();
            return CreateOptions(name, settings);
        }

        private TOptions CreateOptions(string name, TSettings settings)
        {
            var options = _factory.Create(name);
            SetOptions(options, settings);
            return options;
        }

        private string GetTenantCacheKey(string name)
        {
            return $"{name}-{AbpSession.TenantId.Value}";
        }
    }
}

