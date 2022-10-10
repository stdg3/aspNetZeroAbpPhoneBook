using Abp.AutoMapper;
using Abp.Modules;
using Abp.Reflection.Extensions;

namespace CCPDemo
{
    [DependsOn(typeof(CCPDemoClientModule), typeof(AbpAutoMapperModule))]
    public class CCPDemoXamarinSharedModule : AbpModule
    {
        public override void PreInitialize()
        {
            Configuration.Localization.IsEnabled = false;
            Configuration.BackgroundJobs.IsJobExecutionEnabled = false;
        }

        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(CCPDemoXamarinSharedModule).GetAssembly());
        }
    }
}