using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;
using CCPDemo.Authorization;

namespace CCPDemo
{
    /// <summary>
    /// Application layer module of the application.
    /// </summary>
    [DependsOn(
        typeof(CCPDemoApplicationSharedModule),
        typeof(CCPDemoCoreModule)
        )]
    public class CCPDemoApplicationModule : AbpModule
    {
        public override void PreInitialize()
        {
            //Adding authorization providers
            Configuration.Authorization.Providers.Add<AppAuthorizationProvider>();

            //Adding custom AutoMapper configuration
            Configuration.Modules.AbpAutoMapper().Configurators.Add(CustomDtoMapper.CreateMappings);
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(CCPDemoApplicationModule).GetAssembly());
        }
    }
}