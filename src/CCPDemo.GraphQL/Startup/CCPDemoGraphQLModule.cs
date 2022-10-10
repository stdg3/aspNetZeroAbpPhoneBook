using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;

namespace CCPDemo.Startup
{
    [DependsOn(typeof(CCPDemoCoreModule))]
    public class CCPDemoGraphQLModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(CCPDemoGraphQLModule).GetAssembly());
        }

        public override void PreInitialize()
        {
            base.PreInitialize();

            //Adding custom AutoMapper configuration
            Configuration.Modules.AbpAutoMapper().Configurators.Add(CustomDtoMapper.CreateMappings);
        }
    }
}