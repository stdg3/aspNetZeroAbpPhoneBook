using Abp.Modules;
using Abp.Reflection.Extensions;

namespace CCPDemo
{
    public class CCPDemoClientModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(CCPDemoClientModule).GetAssembly());
        }
    }
}
