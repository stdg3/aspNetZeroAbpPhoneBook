using Abp.Modules;
using Abp.Reflection.Extensions;

namespace CCPDemo
{
    [DependsOn(typeof(CCPDemoXamarinSharedModule))]
    public class CCPDemoXamarinAndroidModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(CCPDemoXamarinAndroidModule).GetAssembly());
        }
    }
}