using Abp.Modules;
using Abp.Reflection.Extensions;

namespace CCPDemo
{
    [DependsOn(typeof(CCPDemoXamarinSharedModule))]
    public class CCPDemoXamarinIosModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(CCPDemoXamarinIosModule).GetAssembly());
        }
    }
}