using Abp.Modules;
using Abp.Reflection.Extensions;

namespace CCPDemo
{
    public class CCPDemoCoreSharedModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(CCPDemoCoreSharedModule).GetAssembly());
        }
    }
}