using Abp.Modules;
using Abp.Reflection.Extensions;

namespace CCPDemo
{
    [DependsOn(typeof(CCPDemoCoreSharedModule))]
    public class CCPDemoApplicationSharedModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(CCPDemoApplicationSharedModule).GetAssembly());
        }
    }
}